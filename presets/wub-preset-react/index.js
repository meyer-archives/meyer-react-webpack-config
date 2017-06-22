const webpack = require('webpack');

const entrypointPath = require.resolve('./entrypoint');

module.exports = function(env, options, { existingConfig }) {
  const babelLoader = existingConfig.module.rules.find(
    m => typeof m === 'object' && m.loader.match(/babel\-loader/)
  );

  const entry = [entrypointPath];
  babelLoader.options.presets.push(require.resolve('babel-preset-react'));

  if (env.hot) {
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
