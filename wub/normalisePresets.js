const invariant = require('invariant');
const path = require('path');
const ModuleResolver = require('./ModuleResolver');

/**
 * @param {object} presets preset arrays passed to `wub` merged into one
 * @param {object} globalConfig config objects passed to `wub` merged into one
 * @param {string} projectDir absolute path the `webpack.config.js` that called `wub`
 * @returns {array} normalised preset array
 */
function normalisePresets(presets, globalConfig, projectDir) {
  const presetDirs = [];

  // prevent global config mutation
  globalConfig = Object.assign({}, globalConfig);

  const presetResolver = new ModuleResolver([
    // wub directory
    path.join(__dirname, 'node_modules'),
    // project directory
    path.join(projectDir, 'node_modules'),
    // PWD (might not be the project directory)
    path.join(process.env.PWD, 'node_modules'),
  ]);

  // expand presets
  const normalisedPresets = presets.map((preset, idx) => {
    const pType = typeof preset;

    if (pType === 'string' || Array.isArray(preset)) {
      let presetPath;
      let presetName;
      let presetConfig;

      if (pType === 'string') {
        presetName = preset;
        presetConfig = {};
      } else {
        presetName = preset[0];
        presetConfig = preset[1];

        invariant(
          typeof presetName === 'string',
          'config.presets[%s][0] is expected to be a string'
        );

        if (typeof presetConfig === 'undefined') {
          presetConfig = {};
        } else {
          invariant(
            typeof presetConfig === 'object' && presetConfig !== null,
            'config.presets[%s][1] is expected to be a config object',
            idx
          );
        }
      }

      if (presetName.indexOf('/') === -1) {
        if (!presetName.startsWith('wub-preset-')) {
          presetName = `wub-preset-${presetName}`;
        }

        // if no slash is present, it's a module
        presetPath = presetResolver.resolve(presetName);
      } else {
        // if a slash is present, it's some kind of path
        presetPath = path.resolve(projectDir, presetName);
      }

      const presetModule = require(presetPath);

      invariant(
        typeof presetModule === 'function',
        'Preset `%s` is not a module that exports a function (resolved path: %s)',
        presetName,
        presetPath
      );
      presetDirs.push(path.dirname(presetPath));

      // string/array presets receive a preset config object as their first parameter
      return presetModule.bind(globalConfig, presetConfig);
    } else if (pType === 'function') {
      // assume function returns a config
      return preset.bind(globalConfig);
    } else if (pType === 'object') {
      // convert raw webpack config into a function that returns a config
      return () => preset;
    } else {
      invariant(false, 'Invalid preset at `presets[%s]`', idx);
    }
  });

  return {
    normalisedPresets,
    presetDirs,
  };
}

module.exports = normalisePresets;
