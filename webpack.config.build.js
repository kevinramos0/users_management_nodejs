const path = require('path');
const nodeExternals = require('webpack-node-externals');
const DotEnv = require('dotenv-webpack');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

dotenv.config();

module.exports = {
  entry: {
    server: './app.mjs',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  mode: 'production',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.mjs'],
    alias: {
      '@Src': path.resolve(__dirname, 'src/'),
      '@Public': path.resolve(__dirname, 'public/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [new DotEnv(), new CleanWebpackPlugin()],
};
