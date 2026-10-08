// Production static server for the Vite build in dist/, run under pm2 (see ecosystem.config.cjs).
// `vite preview` is not meant for production, so this serves the same files with proper caching.
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');
const PORT = Number(process.env.PORT || 3427);
const HOST = process.env.HOST || '0.0.0.0';

if (!fs.existsSync(INDEX_HTML)) {
  console.error(`[ite-sls] ${INDEX_HTML} not found — run "npm run build" first.`);
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 'loopback');

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Vite fingerprints everything under dist/assets, so those files can be cached forever.
app.use(
  '/assets',
  express.static(path.join(DIST_DIR, 'assets'), {
    immutable: true,
    maxAge: '1y',
    fallthrough: false,
  }),
);

app.use(express.static(DIST_DIR, { index: false, maxAge: '1h' }));

// Single-page app: every other GET returns index.html, never cached so new deploys show up immediately.
app.get('*', (_req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(INDEX_HTML);
});

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[ite-sls]', err);
  res.status(status).end();
});

const server = app.listen(PORT, HOST, () => {
  console.log(`[ite-sls] serving ${DIST_DIR} on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error(`[ite-sls] failed to listen on ${HOST}:${PORT}: ${err.message}`);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
