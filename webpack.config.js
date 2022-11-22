const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portfinder = require('portfinder');

const DEFAULT_PORT = 3000;

module.exports = async () => {
  const port = await portfinder.getPortPromise({ port: DEFAULT_PORT });

  return {
    context: path.resolve(__dirname, 'src'),
    entry: './index.jsx',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js',
    },
    devServer: {
      port,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
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
        Store: path.resolve(__dirname, 'src/store'),
      },
      extensions: ['.js', '.jsx', '.glsl'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '/public/index.html'),
      }),
    ],
  };
};