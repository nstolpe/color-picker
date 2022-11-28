const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

const { npm_package_name: name, npm_package_version: version } = process.env;
const [, month, day, year] = new Date().toDateString().split(' ');
const date = `${day}-${month}-${year}`;
const lines = [
  ` * package: ${name}`,
  ` * version: ${version}`,
  ` * published: ${date}`,
];
const endPadding = 8;
const longest = lines.reduce(
  (longest, line) => Math.max(longest, line.length),
  0
);
const banner =
  lines.reduce(
    (str, line) => `${str}${line.padEnd(longest + endPadding)}*\n`,
    `${'/*'.padEnd(longest + endPadding, '*')}*\n`
  ) + `${' *'.padEnd(longest + endPadding, '*')}*/\n\n`;

module.exports = () => {
  const config = {
    entry: path.resolve(__dirname, 'src', 'components', 'ColorPicker.jsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: 'color-picker',
      libraryTarget: 'umd',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            output: {
              comments: false,
              preamble: banner,
            },
          },
        }),
      ],
    },
    mode: 'none',
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
        Components: path.resolve(__dirname, 'src', 'components'),
        Store: path.resolve(__dirname, 'src', 'store'),
      },
      extensions: ['.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    externals: [
      nodeExternals({
        allowlist: ['chroma-js'],
      }),
    ],
    plugins: [],
    devtool: 'source-map',
  };

  return config;
};
