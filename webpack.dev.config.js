const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portfinder = require('portfinder');
const common = require('./webpack.common.config');

const DEFAULT_PORT = 3000;

module.exports = async () => {
  const port = await portfinder.getPortPromise({ port: DEFAULT_PORT });

  return {
    ...common,
    context: path.resolve(__dirname, 'src'),
    entry: './index.jsx',
    devServer: {
      port,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '/public/index.html'),
      }),
    ],
  };
};
