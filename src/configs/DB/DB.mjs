import { Sequelize } from 'sequelize';
import dbConfig from '../db.mjs';

export default class db {
  static connection(connection = null) {
    const predefinida = dbConfig.default;
    let config = {};
    if (connection) config = dbConfig.connections[connection];
    else config = dbConfig.connections[predefinida];

    return new Sequelize(
      config.options.db_name,
      config.options.db_username,
      config.options.db_password,
      {
        host: config.options.db_host,
        port: config.options.db_port,
        dialect: config.motor,
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
