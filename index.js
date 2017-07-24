const getWebpackConfig = require('./getWebpackConfig');
const normaliseConfig = require('./normaliseConfig');
const invariant = require('invariant');
const path = require('path');

const { styleEnd, styleStart } = require('./utils/console-format');

invariant(
  // match webpack.config.js and all its weird friends
  path.basename(module.parent.filename).startsWith('webpack.config.'),
  '`wub` should be required from a webpack config file'
);

function wub(wubConfig) {
  try {
    const normalisedConfig = normaliseConfig(wubConfig, module.parent.filename);

    // Add each preset's node_module path to the require path
    const modulePaths = normalisedConfig.presets.map(p =>
      path.resolve(path.dirname(p[0]), 'node_modules')
    );

    // allow local override, fall back to project folder
    modulePaths.unshift(path.join(process.env.PWD, 'node_modules'));
    modulePaths.push(path.join(__dirname, 'node_modules'));

    process.env.NODE_PATH = modulePaths.join(':');
    require('module').Module._initPaths();

    return function(env, options) {
      return getWebpackConfig(normalisedConfig, modulePaths, options);
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
