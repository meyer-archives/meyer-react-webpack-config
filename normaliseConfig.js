const invariant = require('invariant');
const path = require('path');

/**
 * @param {object} config user-specified `wub` config object
 * @param {string} configFilePath path to `wub.config.js`
 * @returns {object} normalised wub config
 */
function normaliseConfig(config, configFilePath) {
  invariant(
    typeof configFilePath === 'string' && configFilePath !== '',
    'normaliseConfig expects a valid path as its second parameter'
  );

  invariant(
    typeof config === 'object' && config !== null,
    'Config at `%s` is not a valid config file.',
    configFilePath
  );

  const configFileDir = path.dirname(configFilePath);

  const normalisedConfig = {
    browserslist: ['last 2 versions', '> 5%'],
    configFilePath,
    configFileDir,
  };

  invariant(
    typeof config.entrypoint === 'string' && config.entrypoint !== '',
    'config.entrypoint is expected to be a path to a JS file'
  );

  const modulePaths = Array.from(
    new Set([
      // this project's directory
      path.join(__dirname, 'node_modules'),
      // directory that contains webpack.config.js
      path.join(configFileDir, 'node_modules'),
      // PWD (might not be webpack config directory)
      path.join(process.env.PWD, 'node_modules'),
    ])
  );

  process.env.NODE_PATH = modulePaths.join(':');
  require('module').Module._initPaths();

  try {
    if (!path.isAbsolute(config.entrypoint)) {
      normalisedConfig.entrypoint = require.resolve(
        path.join(configFileDir, config.entrypoint)
      );
    } else {
      normalisedConfig.entrypoint = require.resolve(config.entrypoint);
    }
  } catch (e) {
    const err = new Error(
      `Entrypoint \`${config.entrypoint}\` could not be resolved`
    );
    err.stack = e.stack;
    throw err;
  }

  // expand presets
  if (config.hasOwnProperty('presets')) {
    invariant(
      Array.isArray(config.presets),
      'config.presets is expected to be an array (in %s)',
      configFilePath
    );

    normalisedConfig.presets = config.presets.map((p, idx) => {
      let name;
      let config;
      if (typeof p === 'string') {
        invariant(
          typeof p === 'string',
          'config.presets[%s] is expected to be a string'
        );
        name = p;
        config = {};
      } else if (Array.isArray(p)) {
        name = p[0];
        config = p[1];

        invariant(
          typeof name === 'string',
          'config.presets[%s][0] is expected to be a string'
        );
        if (p.length > 1) {
          invariant(
            typeof config === 'object' && config !== null,
            'config.presets[%s][1] is expected to be a config object',
            idx
          );
        } else {
          config = {};
        }
      } else {
        invariant(false, 'Invalid preset at `config.presets[%s]`', idx);
      }

      let preset;
      if (name.indexOf('/') === -1) {
        if (!name.startsWith('wub-preset-')) {
          name = `wub-preset-${name}`;
        }

        // if no slash is present, it's a module
        preset = require.resolve(name);
      } else {
        // if a slash is present, it's some kind of path
        const presetPath = path.resolve(configFileDir, name);
        preset = require.resolve(presetPath);
      }

      // this will fail if `preset` resolves to a file in a subdirectory
      return [preset, config];
    });
  }

  return normalisedConfig;
}

module.exports = normaliseConfig;
