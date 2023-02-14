const path = require('path');

const config = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/components'),
      Constants: path.resolve(__dirname, 'src/constants'),
      Hooks: path.resolve(__dirname, 'src/hooks'),
      Store: path.resolve(__dirname, 'src/store'),
      Utility: path.resolve(__dirname, 'src/utility'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};

module.exports = config;
