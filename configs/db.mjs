import './env.mjs';

const config = {
  connections: {
    postgres: {
      motor: process.env.DB_DIALECT || 'postgres', // mysql, mariadb, sqlite, postgres
      options: {
        db_host: process.env.DB_HOST || 'localhost',
        db_port: process.env.DB_PORT || 5432,
        db_name: process.env.DB_DATABASE || 'users_management',
        db_username: process.env.DB_USERNAME || 'admin',
        db_password: process.env.DB_PASSWORD || 'admin',
      },
    },
  },
  default: 'postgres',
};

export default config;
