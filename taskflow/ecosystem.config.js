module.exports = {
  apps: [
    {
      name: 'taskflow',
      script: './node_modules/tsx/dist/cli.mjs',
      args: 'src/index.ts',
      cwd: './server',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
