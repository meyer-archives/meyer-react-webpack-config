const entrypointPath = require.resolve('./entrypoint');

module.exports = function reactPreset(env) {
  return {
    entry: [
      // patch is a noop in non-hot environments, but let's filter it out anyway
      env.hot && require.resolve('react-hot-loader/patch'),
      entrypointPath,
    ].filter(f => f),
  };
};
