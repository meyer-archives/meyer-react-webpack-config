const HtmlWebpackPlugin = require('html-webpack-plugin');
const invariant = require('invariant');
const path = require('path');
const webpack = require('webpack');

module.exports = function(
  { domID, template, rootComponent, emitIndex, title },
  webpackOptions,
  babelOptions
) {
  domID = domID || '.app-root';
  title = title || 'wub-preset-preact';
  emitIndex = typeof emitIndex !== 'undefined' ? !!emitIndex : true;

  invariant(
    typeof domID === 'string' && domID !== '',
    'wub-preset-preact requires domID option to be set to a valid ID'
  );

  invariant(
    typeof rootComponent === 'string',
    'wub-preset-preact requires rootComponent option to be set to a valid path'
  );

  babelOptions.presets.push(require.resolve('babel-preset-preact'));

  const plugins = [
    new webpack.DefinePlugin({
      __DOM_ID__: JSON.stringify(domID),
    }),
  ];

  if (webpackOptions.hot || emitIndex) {
    // Emit an index.html when hot reloading
    let templatePath;
    if (template) {
      templatePath = path.resolve(this.projectDir, template);
    } else {
      templatePath = path.resolve(__dirname, 'template.ejs');
    }

    plugins.push(
      new HtmlWebpackPlugin({
        inject: false,
        title,
        template: templatePath,
        domID,
      })
    );
  }

  return {
    entry: require.resolve('./entrypoint'),
    plugins,
    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        __PREACT_ROOT_COMPONENT__: this.projectResolver.resolve(rootComponent),
      },
    },
  };
};
