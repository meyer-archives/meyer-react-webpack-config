const invariant = require('invariant');
const path = require('path');

const getWebpackConfig = require('./getWebpackConfig');
const normaliseConfig = require('./normaliseConfig');
const { styleEnd, styleStart } = require('./utils/console-format');

module.exports = wubConfig => (env, options) => {
  try {
    invariant(
      // match webpack.config.js and all its weird friends
      path.basename(module.parent.filename).startsWith('webpack.config.'),
      '`wub` should be required from a webpack config file'
    );

    const normalisedConfig = normaliseConfig(wubConfig, module.parent.filename);
    return getWebpackConfig(normalisedConfig, options);
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
};
