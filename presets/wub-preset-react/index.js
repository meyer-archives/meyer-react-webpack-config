const invariant = require('invariant');
const webpack = require('webpack');

module.exports = function(config, presetOptions, { hot }, babelOptions) {
  const domID = presetOptions.domID || '.react-root';

  invariant(
    typeof domID === 'string' && domID !== '',
    'React preset requires domID option to be set to a valid ID'
  );

  const entry = [require.resolve('./entrypoint')];
  babelOptions.presets.push(require.resolve('babel-preset-react'));
  if (hot) {
    // path is a noop in production but might as well filter it out
    entry.unshift('react-hot-loader/patch');
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
