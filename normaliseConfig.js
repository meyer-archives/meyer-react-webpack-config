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

  const normalisedConfig = {
    browserslist: ['last 2 versions', '> 5%'],
  };

  invariant(
    typeof config.entrypoint === 'string' && config.entrypoint !== '',
    'config.entrypoint is expected to be a path to a JS file'
  );

  try {
    if (!path.isAbsolute(config.entrypoint)) {
      normalisedConfig.entrypoint = require.resolve(
        path.join(path.dirname(configFilePath), config.entrypoint)
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

  const modulePaths = [path.resolve(__dirname, 'node_modules')];

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
        invariant(
          typeof config === 'object' && config !== null,
          'config.presets[%s][1] is expected to be a config object',
          idx
        );
      } else {
        invariant(false, 'Invalid preset at `config.presets[%s]`', idx);
      }

      if (name.indexOf('/') === -1) {
        modulePaths.push(
          path.resolve(__dirname, `./presets/wub-preset-${name}/node_modules`)
        );
        return [require.resolve(`./presets/wub-preset-${name}`), config];
      }
      modulePaths.push(path.resolve(name, 'node_modules'));
      return [require.resolve(name), config];
    });
  }

  return normalisedConfig;
}

module.exports = normaliseConfig;
