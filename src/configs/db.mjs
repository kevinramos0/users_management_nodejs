import './env.mjs';

const config = {
  connections: {
    postgres: {
      motor: process.env.DB_DIALECT, // mysql, mariadb, sqlite, postgres
      options: {
        db_host: process.env.DB_HOST,
        db_port: +process.env.DB_PORT,
        db_name: process.env.DB_DATABASE,
        db_username: process.env.DB_USERNAME,
        db_password: process.env.DB_PASSWORD,
      },
    },
  },
  default: 'postgres',
};

export default config;
