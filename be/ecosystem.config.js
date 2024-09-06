require('dotenv').config();
module.exports = {
  apps: [
    {
      name: 'bracket',
      script: 'src/index.js --interpreter=/root/.nvm/versions/node/v18.18.2/bin/node',
      instances: 1,
      autorestart: true,
      watch: ['src'],
      ignore_watch: ['node_modules', 'logs'],
      time: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};

//sudo pm2 start src/index.js --interpreter=/root/.nvm/versions/node/v18.18.2/bin/node --name=goochy_be
