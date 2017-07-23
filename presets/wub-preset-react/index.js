const invariant = require('invariant');
const webpack = require('webpack');

const entrypointPath = require.resolve('./entrypoint');

module.exports = function(config, presetOptions, isServing, babelOptions) {
  const domID = presetOptions.domID || '.react-root';

  invariant(
    typeof domID === 'string' && domID !== '',
    'React preset requires domID option to be set to a valid ID'
  );

  const entry = [entrypointPath];
  babelOptions.presets.push(require.resolve('babel-preset-react'));

  if (isServing) {
    entry.unshift(require.resolve('react-hot-loader/patch'));
    babelOptions.plugins.push(require.resolve('react-hot-loader/babel'));
  }

  return {
    entry,
    plugins: [
      new webpack.DefinePlugin({
        __REACT_ROOT_ID__: JSON.stringify(domID),
      }),
    ],
  };
};
