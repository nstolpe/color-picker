const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.config');

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
    ...common,
    entry: path.resolve(__dirname, 'src', 'components', 'ColorPicker.tsx'),
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
    externals: [
      nodeExternals({
        allowlist: ['chroma-js'],
      }),
    ],
    plugins: [],
  };

  return config;
};
