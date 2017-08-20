const webpack = require('webpack');
const invariant = require('invariant');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function({ uglifyOptions }, webpackOptions) {
  const p = process.argv.indexOf('-p') !== -1;
  const optMin = process.argv.indexOf('--optimize-minimize') !== -1;

  invariant(
    !(p || optMin),
    'wub-preset-uglify is a replacement for running webpack with the `%s` option',
    p ? '-p' : '--optimize-minimize'
  );

  // only minify in production
  if (webpackOptions.hot) {
    return null;
  }

  return {
    plugins: [
      // Same as the -p option
      // https://github.com/webpack/webpack/blob/991b360/bin/convert-argv.js#L21
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),

      // Same as the --optimize-minimize option
      // https://github.com/webpack/webpack/blob/991b360/bin/convert-argv.js#L457-L465
      // using the beta instead of builtin
      new UglifyJsPlugin({
        parallel: true,
        sourceMap:
          webpackOptions.devtool &&
          (webpackOptions.devtool.indexOf('sourcemap') >= 0 ||
            webpackOptions.devtool.indexOf('source-map') >= 0),
        uglifyOptions: Object.assign({}, uglifyOptions),
      }),

      new webpack.LoaderOptionsPlugin({ minimize: true }),
    ],
  };
};
