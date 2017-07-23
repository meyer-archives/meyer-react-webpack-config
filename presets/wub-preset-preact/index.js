const invariant = require('invariant');
const path = require('path');
const webpack = require('webpack');

const entrypointPath = require.resolve('./entrypoint');

module.exports = function(pluginOptions, isServing, existingConfig) {
  const options = Object.assign({ domID: '.react-root' }, pluginOptions);

  invariant(
    typeof options.domID === 'string' && options.domID !== '',
    'React preset requires rootComponent option to be set'
  );
  invariant(
    typeof options.rootComponent === 'string' &&
      path.isAbsolute(options.rootComponent),
    'wub-preset-react requires `rootComponent` option to be set to an absolute path to a React component'
  );

  const babelLoader = existingConfig.module.rules.find(
    m => typeof m === 'object' && /babel\-loader/.test(m.loader)
  );

  const entry = [entrypointPath];
  babelLoader.options.presets.push(require.resolve('babel-preset-react'));

  if (isServing) {
    entry.unshift(require.resolve('react-hot-loader/patch'));
    babelLoader.options.plugins.push(require.resolve('react-hot-loader/babel'));
  }

  return {
    entry,
    plugins: [
      new webpack.DefinePlugin({
        __REACT_ROOT_ID__: JSON.stringify(options.domID),
        __ROOT_COMPONENT__: JSON.stringify(options.rootComponent),
      }),
    ],
    module: { rules: [babelLoader] },
  };
};
