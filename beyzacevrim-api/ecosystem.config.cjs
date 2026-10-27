// PM2 process definition. Usage: pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: 'beyzacevrim-api',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '256M',
      kill_timeout: 10000,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
