const invariant = require('invariant');
const path = require('path');
const fs = require('fs');

/**
 * @param {object} config user-specified `wub` config object
 * @param {string} configFilePath path to `wub.config.js`
 * @returns {object} normalised wub config
 */
function normaliseConfig(config, configFilePath) {
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

  if (!path.isAbsolute(config.entrypoint)) {
    normalisedConfig.entrypoint = path.resolve(
      path.dirname(configFilePath),
      normalisedConfig.entrypoint
    );
  } else {
    normalisedConfig.entrypoint = config.entrypoint;
  }

  invariant(
    fs.existsSync(normalisedConfig.entrypoint),
    'config.entrypoint did not resolve to a valid file:\n  %s\n  --->\n  %s',
    config.entrypoint,
    normalisedConfig.entrypoint
  );

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
