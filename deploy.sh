#!/usr/bin/env bash
# Production deploy of the ITE SLS frontend (Vite + React) on the Hostinger VPS, supervised by pm2,
# published at https://ite-sls.transportation-lab.tech through nginx.
#
# Run on the server from the ite-sls-fe root:   chmod +x deploy.sh && ./deploy.sh
# Re-run the same script for every update — every step is idempotent.
#
# What it does: checks prerequisites, picks a port that no other app on this server uses
# (listening sockets, other pm2 apps, other nginx sites), installs deps, type-checks, builds,
# starts the app under pm2, waits for it to answer, wires nginx + HTTPS for the subdomain,
# then prints the IP, port and domain the site is reachable on.
#
# Prerequisite outside this server: a DNS A record  ite-sls  ->  <this VPS public IP>
# on the transportation-lab.tech zone (wherever that domain's DNS is managed).
#
# Overridable via environment variables:
#   PORT          force a specific port (fails if taken). Default: last used port, else 3427
#   BIND_HOST     interface the pm2 app binds to (default 0.0.0.0 so http://IP:PORT also works;
#                 use 127.0.0.1 to only allow access through nginx/the domain)
#   APP_NAME      pm2 process name (default ite-sls-fe)
#   DOMAIN        public hostname (default ite-sls.transportation-lab.tech)
#   CERTBOT_EMAIL email for Let's Encrypt expiry notices (optional)
#   SKIP_NGINX=1  don't touch nginx (domain setup skipped)
#   SKIP_SSL=1    don't run certbot
#   SKIP_LINT=1   skip `tsc --noEmit`
#   WAIT_SECONDS  how long to wait for the app to answer after start (default 30)
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
ROOT_DIR="$PWD"

DEFAULT_PORT=3427
PORT_SEARCH_RANGE=200
PORT_FILE="$ROOT_DIR/.deploy-port"
APP_NAME="${APP_NAME:-ite-sls-fe}"
DOMAIN="${DOMAIN:-ite-sls.transportation-lab.tech}"
BIND_HOST="${BIND_HOST:-0.0.0.0}"
WAIT_SECONDS="${WAIT_SECONDS:-30}"
TOTAL_STEPS=9

# ---------------------------------------------------------------------------
# Presentation helpers
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'
  C_RED=$'\033[31m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_BLUE=$'\033[34m'; C_CYAN=$'\033[36m'
else
  C_RESET=""; C_BOLD=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_CYAN=""
fi
STEP=0
step()  { STEP=$((STEP + 1)); printf '\n%s[%d/%d] %s%s\n' "${C_BOLD}${C_BLUE}" "$STEP" "$TOTAL_STEPS" "$1" "$C_RESET"; }
info()  { printf '%s   -%s %s\n' "$C_CYAN" "$C_RESET" "$1"; }
ok()    { printf '%s   ✓%s %s\n' "$C_GREEN" "$C_RESET" "$1"; }
warn()  { printf '%s   ! WARNING:%s %s\n' "$C_YELLOW" "$C_RESET" "$1" >&2; }
fail()  { printf '\n%s✗ ERROR:%s %s\n' "${C_RED}${C_BOLD}" "$C_RESET" "$1" >&2; }

on_error() {
  local line="$1" cmd="$2"
  fail "Deploy failed at line ${line}, while running:"
  printf '%s     %s%s\n' "$C_RED" "$cmd" "$C_RESET" >&2
  printf '\n%sFix the error printed above, then re-run ./deploy.sh — every step is safe to re-run.%s\n\n' "$C_YELLOW" "$C_RESET" >&2
  exit 1
}
trap 'on_error "$LINENO" "$BASH_COMMAND"' ERR

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
elif command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
else
  SUDO="__none__"
fi

as_root() {
  if [[ "$SUDO" == "__none__" ]]; then
    fail "This step needs root and sudo is not installed. Re-run as root, or with SKIP_NGINX=1."
    return 1
  fi
  $SUDO "$@"
}

require_cmd() {
  local cmd="$1" hint="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "'$cmd' is not installed, or not on PATH."
    printf '%s   -> %s%s\n' "$C_YELLOW" "$hint" "$C_RESET" >&2
    exit 1
  fi
  ok "$cmd found ($(command -v "$cmd"))"
}

port_listening() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -H -ltn "sport = :$port" 2>/dev/null | grep -q .
    return $?
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN -P -n >/dev/null 2>&1
    return $?
  fi
  (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null
}

describe_port_owner() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    as_root ss -ltnp "sport = :$port" 2>/dev/null || ss -ltn "sport = :$port"
  elif command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN -P -n 2>/dev/null
  fi
}

# Prints "<pm2 name> <port>" for every pm2 app that declares a port (env PORT or -p/--port args),
# including stopped apps — a stopped app still "owns" its port and would clash when restarted.
pm2_declared_ports() {
  pm2 jlist 2>/dev/null | node -e '
    let raw = "";
    process.stdin.on("data", (c) => (raw += c));
    process.stdin.on("end", () => {
      let procs = [];
      try { procs = JSON.parse(raw.slice(raw.indexOf("["))); } catch { return; }
      for (const p of procs) {
        const env = p.pm2_env || {};
        const ports = new Set();
        for (const v of [env.PORT, env.env && env.env.PORT]) if (/^\d+$/.test(String(v || ""))) ports.add(String(v));
        const args = [].concat(env.args || []).map(String);
        args.forEach((a, i) => {
          const m = a.match(/^--port=(\d+)$/);
          if (m) ports.add(m[1]);
          if ((a === "-p" || a === "--port") && /^\d+$/.test(args[i + 1] || "")) ports.add(args[i + 1]);
        });
        for (const port of ports) console.log(`${p.name} ${port}`);
      }
    });
  ' || true
}

# Ports other nginx sites proxy to (so we never grab a port that belongs to a stopped app).
nginx_claimed_ports() {
  local files=() f
  shopt -s nullglob
  files+=(/etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf)
  shopt -u nullglob
  for f in "${files[@]}"; do
    [[ "$(basename "$f")" == "$DOMAIN" || "$(basename "$f")" == "$DOMAIN.conf" ]] && continue
    grep -hoE 'proxy_pass[[:space:]]+https?://(127\.0\.0\.1|localhost|0\.0\.0\.0|\[::1\]):[0-9]+' "$f" 2>/dev/null \
      | grep -oE '[0-9]+$' || true
  done
}

detect_public_ip() {
  local ip="" url
  for url in https://api.ipify.org https://ipv4.icanhazip.com https://ifconfig.me/ip; do
    ip="$(curl -4 -fsS --max-time 3 "$url" 2>/dev/null | tr -d '[:space:]' || true)"
    [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && { echo "$ip"; return; }
  done
  hostname -I 2>/dev/null | awk '{print $1}' || true
}

resolve_domain() {
  local d="$1"
  if command -v dig >/dev/null 2>&1; then
    dig +short A "$d" 2>/dev/null | grep -E '^[0-9.]+$' | head -n1 && return
  fi
  if command -v getent >/dev/null 2>&1; then
    getent ahostsv4 "$d" 2>/dev/null | awk 'NR==1 {print $1}' && return
  fi
  if command -v host >/dev/null 2>&1; then
    host -t A "$d" 2>/dev/null | awk '/has address/ {print $4; exit}'
  fi
}

wait_for_http() {
  local url="$1" timeout="$2" waited=0
  until curl -fsS --max-time 2 "$url" >/dev/null 2>&1; do
    sleep 1
    waited=$((waited + 1))
    (( waited >= timeout )) && return 1
  done
  return 0
}

printf '%s%s=== ITE SLS frontend deploy ===%s\n' "$C_BOLD" "$C_BLUE" "$C_RESET"
info "Directory : $ROOT_DIR"
info "pm2 name  : $APP_NAME"
info "Domain    : $DOMAIN"

# ---------------------------------------------------------------------------
step "Checking prerequisites"
# ---------------------------------------------------------------------------
require_cmd node "Install Node.js 20+ (e.g. via nvm, or NodeSource: https://github.com/nodesource/distributions)."
require_cmd npm "npm ships with Node.js — reinstall Node."
require_cmd curl "sudo apt-get install -y curl"
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 20 )); then
  fail "Node ${NODE_MAJOR}.x detected — Vite 6 / React 19 need Node 20 or newer."
  exit 1
fi
if ! command -v pm2 >/dev/null 2>&1; then
  info "pm2 not found — installing it globally."
  npm install -g pm2 || as_root npm install -g pm2
fi
ok "pm2 found ($(command -v pm2), v$(pm2 --version 2>/dev/null | tail -n1))"

# ---------------------------------------------------------------------------
step "Choosing a unique port"
# ---------------------------------------------------------------------------
OUR_PORT=""
OTHER_PM2_PORTS=()
while read -r name port; do
  [[ -z "${name:-}" ]] && continue
  if [[ "$name" == "$APP_NAME" ]]; then
    OUR_PORT="$port"
  else
    OTHER_PM2_PORTS+=("$port")
  fi
done < <(pm2_declared_ports)
NGINX_PORTS=()
while read -r port; do
  [[ -n "$port" ]] && NGINX_PORTS+=("$port")
done < <(nginx_claimed_ports)
RESERVED=" ${OTHER_PM2_PORTS[*]:-} ${NGINX_PORTS[*]:-} "
info "Ports declared by other pm2 apps : ${OTHER_PM2_PORTS[*]:-none}"
info "Ports used by other nginx sites  : ${NGINX_PORTS[*]:-none}"

# Prints why a port can't be used, or nothing if it is free for this app.
port_conflict() {
  local p="$1"
  if [[ "$RESERVED" == *" $p "* ]]; then echo "reserved by another pm2 app or nginx site"; return; fi
  if [[ "$p" == "$OUR_PORT" ]]; then return; fi
  if port_listening "$p"; then echo "something is already listening on it"; return; fi
  return 0
}

if [[ -n "${PORT:-}" ]]; then
  REASON="$(port_conflict "$PORT")"
  if [[ -n "$REASON" ]]; then
    fail "Requested PORT=${PORT} is not available: ${REASON}."
    describe_port_owner "$PORT" >&2 || true
    exit 1
  fi
else
  PREFERRED="$DEFAULT_PORT"
  if [[ -f "$PORT_FILE" ]]; then
    SAVED="$(tr -dc '0-9' < "$PORT_FILE")"
    [[ -n "$SAVED" ]] && PREFERRED="$SAVED"
  fi
  [[ -n "$OUR_PORT" ]] && PREFERRED="$OUR_PORT"
  PORT=""
  for (( p = PREFERRED; p < PREFERRED + PORT_SEARCH_RANGE; p++ )); do
    REASON="$(port_conflict "$p")"
    if [[ -z "$REASON" ]]; then PORT="$p"; break; fi
    info "Port $p skipped — $REASON."
  done
  if [[ -z "$PORT" ]]; then
    fail "No free port between ${PREFERRED} and $((PREFERRED + PORT_SEARCH_RANGE - 1)). Pass one explicitly: PORT=xxxx ./deploy.sh"
    exit 1
  fi
fi
echo "$PORT" > "$PORT_FILE"
ok "Using port ${PORT} (saved to .deploy-port so future deploys keep it)."

# ---------------------------------------------------------------------------
step "Installing dependencies (npm ci)"
# ---------------------------------------------------------------------------
# Not under NODE_ENV=production: the build needs devDependencies (typescript, tailwind, etc.).
npm ci --no-audit --no-fund
ok "Dependencies installed."

# ---------------------------------------------------------------------------
step "Type-checking and building"
# ---------------------------------------------------------------------------
if [[ "${SKIP_LINT:-0}" != "1" ]]; then
  npm run lint
  ok "Type-check passed."
else
  warn "SKIP_LINT=1 — skipping tsc --noEmit."
fi
npm run build
[[ -f dist/index.html ]] || { fail "Build finished but dist/index.html is missing."; exit 1; }
ok "Production bundle built in dist/."

# ---------------------------------------------------------------------------
step "Starting the app under pm2"
# ---------------------------------------------------------------------------
mkdir -p logs
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  info "Replacing existing pm2 process '$APP_NAME'."
  pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
fi
PORT="$PORT" HOST="$BIND_HOST" APP_NAME="$APP_NAME" pm2 start ecosystem.config.cjs --only "$APP_NAME" --update-env
ok "pm2 process '$APP_NAME' started on ${BIND_HOST}:${PORT}."

if wait_for_http "http://127.0.0.1:${PORT}/healthz" "$WAIT_SECONDS"; then
  ok "App is answering on http://127.0.0.1:${PORT}"
else
  fail "App did not answer on http://127.0.0.1:${PORT} within ${WAIT_SECONDS}s. Recent logs:"
  pm2 logs "$APP_NAME" --lines 40 --nostream 2>&1 | tail -n 40 >&2 || true
  exit 1
fi
if pm2 save >/dev/null 2>&1; then
  ok "pm2 process list saved."
else
  warn "pm2 save failed — the app won't come back after a reboot until it succeeds."
fi
if ! systemctl list-unit-files 2>/dev/null | grep -q '^pm2-'; then
  info "To make pm2 start on boot (one-time), run the command printed by: pm2 startup"
fi

# ---------------------------------------------------------------------------
step "Checking DNS for ${DOMAIN}"
# ---------------------------------------------------------------------------
PUBLIC_IP="$(detect_public_ip)"
DNS_IP="$(resolve_domain "$DOMAIN" || true)"
DNS_OK=0
info "This server's public IP : ${PUBLIC_IP:-unknown}"
info "${DOMAIN} resolves to : ${DNS_IP:-nothing (no A record yet)}"
if [[ -n "$DNS_IP" && "$DNS_IP" == "$PUBLIC_IP" ]]; then
  DNS_OK=1
  ok "DNS points at this server."
elif [[ -z "$DNS_IP" ]]; then
  warn "No A record for ${DOMAIN}. Add one: host 'ite-sls' -> ${PUBLIC_IP:-<VPS IP>} (TTL 300), then re-run."
else
  warn "${DOMAIN} points at ${DNS_IP}, not this server (${PUBLIC_IP}). Behind a Cloudflare proxy? Otherwise fix the A record."
fi

# ---------------------------------------------------------------------------
step "Configuring nginx for ${DOMAIN}"
# ---------------------------------------------------------------------------
NGINX_DONE=0
NGINX_CONF=""
if [[ "${SKIP_NGINX:-0}" == "1" ]]; then
  warn "SKIP_NGINX=1 — not touching nginx. The domain will not work until a reverse proxy points at port ${PORT}."
else
  if ! command -v nginx >/dev/null 2>&1; then
    info "nginx not installed — installing."
    as_root apt-get update -y
    as_root apt-get install -y nginx
  fi
  if [[ -d /etc/nginx/sites-available ]]; then
    NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
    NGINX_LINK="/etc/nginx/sites-enabled/${DOMAIN}"
  else
    NGINX_CONF="/etc/nginx/conf.d/${DOMAIN}.conf"
    NGINX_LINK=""
  fi

  shopt -s nullglob
  for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do
    [[ "$(readlink -f "$f")" == "$NGINX_CONF" ]] && continue
    if grep -qE "server_name[^;]*[[:space:]]${DOMAIN//./\\.}([[:space:]]|;)" "$f" 2>/dev/null; then
      warn "Another nginx file also declares server_name ${DOMAIN}: $f — remove it or nginx may route to the wrong app."
    fi
  done
  shopt -u nullglob

  BACKUP=""
  if as_root test -f "$NGINX_CONF"; then
    # Keep the existing file (it may contain certbot's HTTPS block) and only swap the upstream port.
    BACKUP="$(mktemp)"
    as_root cat "$NGINX_CONF" > "$BACKUP"
    as_root sed -i -E "s#(proxy_pass[[:space:]]+http://127\.0\.0\.1:)[0-9]+#\1${PORT}#g" "$NGINX_CONF"
    ok "Updated existing ${NGINX_CONF} to proxy to 127.0.0.1:${PORT}."
  else
    as_root tee "$NGINX_CONF" >/dev/null <<NGINX
# Managed by ite-sls-fe/deploy.sh — certbot adds the HTTPS block on first deploy.
server {
    listen 80;
    server_name ${DOMAIN};

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
    ok "Wrote ${NGINX_CONF}."
  fi
  [[ -n "$NGINX_LINK" ]] && as_root ln -sf "$NGINX_CONF" "$NGINX_LINK"

  if as_root nginx -t; then
    as_root systemctl reload nginx || as_root systemctl restart nginx
    NGINX_DONE=1
    ok "nginx reloaded."
  else
    fail "nginx config test failed — rolling back ${NGINX_CONF} so the other sites keep working."
    if [[ -n "$BACKUP" ]]; then
      as_root cp "$BACKUP" "$NGINX_CONF"
    else
      as_root rm -f "$NGINX_CONF" ${NGINX_LINK:+"$NGINX_LINK"}
    fi
    as_root nginx -t && as_root systemctl reload nginx || true
    exit 1
  fi
  [[ -n "$BACKUP" ]] && rm -f "$BACKUP"

  if command -v ufw >/dev/null 2>&1 && as_root ufw status 2>/dev/null | grep -q 'Status: active'; then
    as_root ufw allow 'Nginx Full' >/dev/null 2>&1 || { as_root ufw allow 80/tcp >/dev/null; as_root ufw allow 443/tcp >/dev/null; }
    ok "ufw: ports 80/443 allowed."
    if [[ "$BIND_HOST" == "0.0.0.0" ]]; then
      as_root ufw allow "${PORT}/tcp" >/dev/null && ok "ufw: port ${PORT} allowed (direct IP:port access)."
    fi
  fi
fi

# ---------------------------------------------------------------------------
step "HTTPS certificate (Let's Encrypt)"
# ---------------------------------------------------------------------------
HTTPS_OK=0
if [[ "$NGINX_DONE" -ne 1 ]]; then
  info "Skipped — nginx was not configured."
elif [[ "${SKIP_SSL:-0}" == "1" ]]; then
  warn "SKIP_SSL=1 — the site will be HTTP only."
elif [[ "$DNS_OK" -ne 1 ]]; then
  warn "Skipped — DNS for ${DOMAIN} does not point here yet, so Let's Encrypt can't verify it. Fix DNS and re-run."
elif as_root test -d "/etc/letsencrypt/live/${DOMAIN}" && as_root grep -q 'listen 443' "$NGINX_CONF"; then
  HTTPS_OK=1
  ok "Certificate already installed (certbot's timer renews it automatically)."
else
  if ! command -v certbot >/dev/null 2>&1; then
    info "certbot not installed — installing."
    as_root apt-get update -y
    as_root apt-get install -y certbot python3-certbot-nginx
  fi
  if [[ -n "${CERTBOT_EMAIL:-}" ]]; then
    EMAIL_ARGS=(-m "$CERTBOT_EMAIL")
  else
    EMAIL_ARGS=(--register-unsafely-without-email)
  fi
  if as_root certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect --keep-until-expiring "${EMAIL_ARGS[@]}"; then
    HTTPS_OK=1
    ok "HTTPS enabled; HTTP now redirects to HTTPS."
  else
    warn "certbot failed (output above). The site still works over HTTP; re-run once the issue is fixed."
  fi
fi

# ---------------------------------------------------------------------------
step "Final check through nginx"
# ---------------------------------------------------------------------------
SCHEME="http"; [[ "$HTTPS_OK" -eq 1 ]] && SCHEME="https"
DOMAIN_URL="${SCHEME}://${DOMAIN}"
if [[ "$NGINX_DONE" -ne 1 ]]; then
  info "Skipped — nginx was not configured."
elif curl -fsS --max-time 5 -o /dev/null -L \
    --resolve "${DOMAIN}:80:127.0.0.1" --resolve "${DOMAIN}:443:127.0.0.1" "http://${DOMAIN}/healthz"; then
  ok "nginx routes ${DOMAIN} to the app."
else
  warn "nginx did not return the app for ${DOMAIN} — inspect with: sudo nginx -T | grep -A12 ${DOMAIN}"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
printf '\n%s%s================================================================%s\n' "$C_BOLD" "$C_GREEN" "$C_RESET"
printf '%s ITE SLS frontend is deployed and running under pm2%s\n' "${C_BOLD}${C_GREEN}" "$C_RESET"
printf '%s----------------------------------------------------------------%s\n' "$C_GREEN" "$C_RESET"
printf '  Server IP : %s\n' "${PUBLIC_IP:-unknown}"
printf '  Port      : %s   (bound on %s)\n' "$PORT" "$BIND_HOST"
printf '  Domain    : %s\n' "$DOMAIN"
printf '%s----------------------------------------------------------------%s\n' "$C_GREEN" "$C_RESET"
if [[ "$NGINX_DONE" -eq 1 && "$DNS_OK" -eq 1 ]]; then
  printf '  Website   : %s%s%s\n' "$C_BOLD" "$DOMAIN_URL" "$C_RESET"
elif [[ "$DNS_OK" -ne 1 ]]; then
  printf '  Website   : %s   (pending: DNS A record ite-sls -> %s)\n' "$DOMAIN_URL" "${PUBLIC_IP:-<server-ip>}"
else
  printf '  Website   : %s   (pending: nginx)\n' "$DOMAIN_URL"
fi
if [[ "$BIND_HOST" == "0.0.0.0" ]]; then
  printf '  By IP     : http://%s:%s   (port %s must be open in the Hostinger VPS firewall)\n' "${PUBLIC_IP:-<server-ip>}" "$PORT" "$PORT"
fi
printf '  Local     : http://127.0.0.1:%s\n' "$PORT"
printf '%s----------------------------------------------------------------%s\n' "$C_GREEN" "$C_RESET"
printf '  pm2 name  : %s\n' "$APP_NAME"
printf '  Logs      : pm2 logs %s\n' "$APP_NAME"
printf '  Restart   : pm2 restart %s\n' "$APP_NAME"
printf '  Update    : upload new code, then ./deploy.sh again\n'
printf '%s================================================================%s\n\n' "${C_BOLD}${C_GREEN}" "$C_RESET"
