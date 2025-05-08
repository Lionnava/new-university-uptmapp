module.exports = {
  apps: [
    {
      name: "sistema-universitario",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
      env_development: {
        PORT: 3000,
        NODE_ENV: "development",
      },
      max_memory_restart: "1G",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
    },
  ],
}
