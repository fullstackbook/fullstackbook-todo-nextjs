module.exports = {
  apps: [{
    name: "app",
    script: 'npm start',
  }],

  // Deployment Configuration
  deploy: {
    production: {
      "key": "key.pem",
      "user": "ubuntu",
      "host": ["54.187.13.4"],
      "ref": "origin/main",
      "repo": "git@github.com:travisluong/fullstackbook-todo-nextjs.git",
      "path": "/home/ubuntu/src",
      "post-deploy": "source ~/.nvm/nvm.sh ; source ~/.profile ; npm install ; pm2 startOrRestart ecosystem.config.js",
      "ssh_options": "ForwardAgent=yes"
    }
  }
};
