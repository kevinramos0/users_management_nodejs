/* eslint-disable import/extensions */
import Server from './src/configs/server.mjs';
import './src/configs/cors.mjs';

const server = new Server();

server.listen();
