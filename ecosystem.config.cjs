// pm2 process definition. deploy.sh exports PORT / HOST / APP_NAME before calling
// `pm2 start ecosystem.config.cjs`, so the chosen port is never hard-coded here.
const path = require('path');

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || 'ite-sls-fe',
      script: path.join(__dirname, 'prod-server.js'),
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '256M',
      time: true,
      out_file: path.join(__dirname, 'logs', 'out.log'),
      error_file: path.join(__dirname, 'logs', 'error.log'),
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '3427',
        HOST: process.env.HOST || '0.0.0.0',
      },
    },
  ],
};
