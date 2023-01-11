const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Webpack = require('webpack');
// eslint-disable-next-line no-unused-vars
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    server: './app.mjs',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.mjs'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@configs': path.resolve(__dirname, 'src/configs/'),
      // '@utils': path.resolve(__dirname, 'src/utils/'),
      // '@handlers': path.resolve(__dirname, 'src/configs/handlers/'),
      '@public': path.resolve(__dirname, 'public/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@validators': path.resolve(__dirname, 'src/validators/'),
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
      }],
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new DotEnv(),
    new ESLintPlugin(),
  ],
};
