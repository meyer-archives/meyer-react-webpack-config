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
  title = title || 'wub-preset-react';
  emitIndex = typeof emitIndex !== 'undefined' ? !!emitIndex : true;

  invariant(
    typeof domID === 'string' && domID !== '',
    'wub-preset-react requires domID option to be set to a valid ID'
  );

  invariant(
    typeof rootComponent === 'string',
    'wub-preset-react requires rootComponent option to be set to a valid path'
  );

  babelOptions.presets.push(require.resolve('babel-preset-react'));

  const plugins = [
    new webpack.DefinePlugin({
      __REACT_ROOT_ID__: JSON.stringify(domID),
      __DOM_ID__: JSON.stringify(domID),
    }),
  ];

  const entry = [require.resolve('./entrypoint')];

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

    // patch is a noop in production but might as well filter it out
    entry.unshift(require.resolve('react-hot-loader/patch'));
    babelOptions.plugins.push(require.resolve('react-hot-loader/babel'));
  }

  return {
    entry,
    plugins,
    resolve: {
      alias: {
        __REACT_ROOT_COMPONENT__: this.projectResolver.resolve(rootComponent),
      },
    },
  };
};
