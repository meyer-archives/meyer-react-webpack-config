const invariant = require('invariant');
const path = require('path');

// CAUTION: HAX

// Delete the module from the require cache so it gets loaded fresh every time.
// module.parent.filename always refers to the first parent that loaded wub
// unless the cache is cleared. This is mainly for webpack multi-compiler support.
delete require.cache[__filename];

// Add project directory to require path
const Module = require('module');
const ModuleResolver = require('./ModuleResolver');
const projectDir = path.dirname(module.parent.filename);
const modulePaths = Array.from(
  // dedupe
  new Set(
    [].concat(
      // project node_modules
      path.join(projectDir, 'node_modules'),
      // PWD (might not be the project directory)
      path.join(process.env.PWD, 'node_modules'),
      // wub directory
      path.join(__dirname, 'node_modules'),
      // fall back to defaults
      module.paths
    )
  )
);
process.env.NODE_PATH = modulePaths.join(':');
Module._initPaths();

// END HAX

const getWebpackConfig = require('./getWebpackConfig');
const normalisePresets = require('./normalisePresets');
const { styleEnd, styleStart } = require('./utils/console-format');

module.exports = (...args) => (env, webpackOptions) => {
  let presets = [];
  // config object shared among presets, available as `this`
  const globalConfig = {};

  try {
    // match webpack.config.js and all its weird friends
    invariant(
      path.basename(module.parent.filename).startsWith('webpack.config.'),
      '`wub` should be required from a webpack config file'
    );

    // split args into either config objects or preset arrays
    for (let idx = -1, len = args.length; ++idx < len; ) {
      const arg = args[idx];

      if (Array.isArray(arg)) {
        presets = [].concat(presets, arg);
      } else if (typeof arg === 'object' && arg !== null) {
        Object.assign(globalConfig, arg);
      } else {
        invariant(
          false,
          'Param %s is invalid. Only config objects and preset arrays are allowed.',
          idx + 1
        );
      }
    }

    // make sure there's at least one preset array
    invariant(
      presets.length > 0,
      '`wub` function expects an array of presets.'
    );

    // Lightly validate browserslist
    if (
      !globalConfig.browserslist ||
      Array.isArray(globalConfig.browserslist)
    ) {
      Object.assign(globalConfig, {
        browserslist: ['last 2 versions', '> 5%'],
      });
    }

    // Add utilities to globalConfig
    Object.assign(globalConfig, {
      projectDir,
      projectResolver: new ModuleResolver([projectDir, process.env.PWD]),
    });

    const { normalisedPresets, presetDirs } = normalisePresets(
      presets,
      globalConfig,
      projectDir
    );

    return getWebpackConfig(
      normalisedPresets,
      presetDirs,
      projectDir,
      globalConfig,
      webpackOptions
    );
  } catch (e) {
    console.error(
      styleStart('red', 'bold') +
        '[WUB] Error: ' +
        e.message +
        styleEnd() +
        '\n\n' +
        e.stack
    );
    process.exit(69); // nice
  }
};
