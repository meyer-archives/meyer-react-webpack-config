const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

/**
 * Merges presets specified in a `wub` config object into a webpack config
 * @param {object} config `wub` config object
 * @param {string} command CLI option passed to `wub`
 * @returns {object} merged webpack config object
 */
function getWebpackConfig(config, command) {
  // Add each preset's node_module path to the require path
  const modulePaths = config.presets.map(p =>
    path.resolve(path.dirname(p[0]), 'node_modules')
  );

  // allow local override, fall back to project folder
  modulePaths.unshift(path.join(process.env.PWD, 'node_modules'));
  modulePaths.push(path.join(__dirname, 'node_modules'));

  process.env.NODE_PATH = modulePaths.join(':');
  require('module').Module._initPaths();

  const isServing = command === 'serve';

  // base configuration
  let mergedConfig = {
    entry: [config.entrypoint],
    output: {
      path: path.join(process.env.PWD, 'build'),
    },
    resolve: {
      alias: {
        // __WUB_ENTRYPOINT__: config.entrypoint,
      },
      // 'node_modules' makes webpack search all ancestor node_modules folders
      modules: [].concat(modulePaths, 'node_modules'),
    },
    plugins: [
      new webpack.DefinePlugin({
        __WUB_ENTRYPOINT__: JSON.stringify(config.entrypoint),
      }),
      // enable named modules in development
      isServing && new webpack.NamedModulesPlugin(),
      isServing && new webpack.HotModuleReplacementPlugin(),
      new webpack.ProgressPlugin(),
    ].filter(f => f),
    module: { rules: [] },
  };

  const babelOptions = {
    presets: [['env', { targets: { browsers: config.browserslist } }]],
    plugins: ['transform-object-rest-spread', 'transform-object-assign'],
  };

  const mergeStrategy = { entry: 'replace' };

  for (let idx = -1, len = config.presets.length; ++idx < len; ) {
    const [presetPath, presetOptions] = config.presets[idx];

    const getPreset = require(presetPath);
    const presetConfig = getPreset(
      config,
      presetOptions,
      isServing,
      babelOptions
    );

    mergedConfig = webpackMerge.smartStrategy(mergeStrategy)(
      mergedConfig,
      presetConfig
    );
  }

  babelOptions.babelrc = false;

  mergedConfig = webpackMerge(mergedConfig, {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions,
            },
          ],
        },
      ],
    },
  });

  return mergedConfig;
}

module.exports = getWebpackConfig;
