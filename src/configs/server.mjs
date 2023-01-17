// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDevMiddleware from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import './env.mjs';

// eslint-disable-next-line import/extensions
import webpackConfig from '../../webpack.config.js';
import routers from '../routes/index.mjs';
import swagger from '../routes/swagger.mjs';
import ErrorException from './handlers/ErrorExceptions.mjs';
import StatusCode from './handlers/StatusCode.mjs';
import ErrorHandler from './handlers/ErrorHandler.mjs';
import corsConfig from './cors.mjs';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Manejador de errores
    this.ExceptionConfig();

    // webpack
    this.configuracion();

    // provar conexion a la DB
    // DB.testing();
  }

  middlewares() {
    // compression
    this.app.use(compression());

    // CORS
    this.app.use(cors(corsConfig));

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use('/api', routers);
    this.app.use('', swagger);
    this.app.all('*', () => {
      throw new ErrorException(StatusCode.NotFound, 'Page not found');
    });
  }

  configuracion() {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line import/extensions
      const compiler = webpack(webpackConfig);
      this.app.use(webpackDevMiddleware(compiler));
      this.app.use(webpackHotMiddleware(compiler));
    }
  }

  ExceptionConfig() {
    this.app.use(ErrorHandler);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }
}
export default Server;
