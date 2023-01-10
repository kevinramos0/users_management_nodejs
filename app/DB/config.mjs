import '../../configs/env.mjs';

const development = {
  database: process.env.DB_DATABASE || 'users_management',
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
};

export default development;
