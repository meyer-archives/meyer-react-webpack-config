const getWebpackConfig = require('./getWebpackConfig');
const normaliseConfig = require('./normaliseConfig');

function wub(config) {
  const normalisedConfig = normaliseConfig(config);
  return function(env = {}) {
    return getWebpackConfig(normalisedConfig, env.hot);
  };
}

module.exports = wub;
