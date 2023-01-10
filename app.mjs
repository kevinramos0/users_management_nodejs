/* eslint-disable import/extensions */
import Server from './configs/server.mjs';
import './configs/cors.mjs';

const server = new Server();

server.listen();
