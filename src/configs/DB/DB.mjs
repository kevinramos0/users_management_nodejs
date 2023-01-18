import { Sequelize } from 'sequelize';
import config from '../db.mjs';

export default class db {
  static connection(connection = null) {
    const predefinida = config.default;
    let dbConfig = {};
    if (connection) dbConfig = config.connections[connection];
    else dbConfig = config.connections[predefinida];

    return new Sequelize(
      dbConfig.options.db_name,
      dbConfig.options.db_username,
      dbConfig.options.db_password,
      {
        host: dbConfig.options.db_host,
        port: dbConfig.options.db_port,
        dialect: dbConfig.motor,
      }
    );
  }

  static async testing(connection = null) {
    try {
      await this.connection(connection).authenticate();
      return true;
    } catch (e) {
      return false;
    }
  }
}
// const envFile = process.env.APP_ENV ? `.env.${process.env.APP_ENV}` : '.env';

// dotenv.config({
//   path: path.resolve(envFile),
// });

// const database = process.env.DB_DATABASE;
// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
// const host = process.env.DB_HOST;
// const port = process.env.DB_PORT;
// const dialect = process.env.DB_DIALECT;

// const conexion = new Sequelize(database, username, password, {
//   host,
//   port,
//   dialect,
// });

// const connect = async () => {
//   await conexion
//     .authenticate();
// };
// const db = {
//   conexion,
//   connect,
// };

// export default db;
