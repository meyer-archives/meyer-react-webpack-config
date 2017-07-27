const invariant = require('invariant');
const path = require('path');

const getWebpackConfig = require('./getWebpackConfig');
const normaliseConfig = require('./normaliseConfig');
const { styleEnd, styleStart } = require('./utils/console-format');

invariant(
  // match webpack.config.js and all its weird friends
  path.basename(module.parent.filename).startsWith('webpack.config.'),
  '`wub` should be required from a webpack config file'
);

function wub(wubConfig) {
  try {
    const normalisedConfig = normaliseConfig(wubConfig, module.parent.filename);

    return function(env, options) {
      return getWebpackConfig(normalisedConfig, options);
    };
  } catch (e) {
    console.error(
      styleStart('red', 'bold') +
        '[WUB] Error: ' +
        e.message +
        styleEnd() +
        '\n\n' +
        e.stack
    );
    process.exit(69);
  }
}

module.exports = wub;
