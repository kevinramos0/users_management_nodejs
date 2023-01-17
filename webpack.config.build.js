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
      '@src': path.resolve(__dirname, 'src/'),
      '@configs': path.resolve(__dirname, 'src/configs/'),
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
      },
    ],
  },
  plugins: [
    new DotEnv(),
    new CleanWebpackPlugin(),
  ],
};
