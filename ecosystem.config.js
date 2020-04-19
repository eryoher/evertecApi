module.exports = {
    apps : [{
      name: 'Evertec - API',
      script: 'server/server.js',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
      env: {
        NODE_ENV: 'dev'
      },
      env_stg: {
        NODE_ENV: 'stg'
      }
    }]
};