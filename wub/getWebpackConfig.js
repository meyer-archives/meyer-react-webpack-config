const invariant = require('invariant');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackPkgJson = require('webpack/package');
const Module = require('module');

/**
 * Merges presets specified in a wub config object into a webpack config
 * @param {array} presets merged array of presets passed to wub
 * @param {array} presetDirs array of paths to externally required presets
 * @param {string} projectDir the directory of the `webpack.config.js` file that called wub
 * @param {object} globalConfig merged config objects passed to wub
 * @param {string} webpackOptions webpack's `options` object passed through to wub
 * @returns {object} merged webpack config object
 */
function getWebpackConfig(
  presets,
  presetDirs,
  projectDir,
  globalConfig,
  webpackOptions
) {
  const modulePaths = Array.from(
    // dedupe
    new Set(
      [].concat(
        // project directory
        path.join(projectDir, 'node_modules'),
        // PWD (might not be the project directory)
        path.join(process.env.PWD, 'node_modules'),
        // wub directory
        path.join(__dirname, 'node_modules'),
        // preset directories
        presetDirs.map(p => path.join(p, 'node_modules'))
      )
    )
  );

  process.env.NODE_PATH = modulePaths.join(':');
  Module._initPaths();

  invariant(
    (webpackPkgJson.version + '').startsWith('3.'),
    'wub is designed to work webpack 3. webpack %s is not supported.',
    webpackPkgJson.version
  );

  // base configuration
  let mergedConfig = {
    output: {
      path: path.join(projectDir, 'build'),
      publicPath: '/',
      filename: 'bundle.[name].[hash].js',
    },
    plugins: [
      // enable named modules in development
      webpackOptions.hot && new webpack.NamedModulesPlugin(),
      new webpack.ProgressPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ].filter(f => f),
    module: { rules: [] },
    devServer: {
      // still gotta use the --hot option with webpack-dev-server
      hot: true,
      hotOnly: true,
      inline: true,
      historyApiFallback: true,
    },
  };

  // babel options object. presets will mutate this directly (eww gross i know)
  const babelOptions = {
    presets: [['env', { targets: { browsers: globalConfig.browserslist } }]],
    plugins: ['transform-object-rest-spread', 'transform-object-assign'],
  };

  const mergeStrategy = { entry: 'replace' };

  // loop through presets
  for (let idx = -1, len = presets.length; ++idx < len; ) {
    const preset = presets[idx];

    const presetConfig = preset(webpackOptions, babelOptions);

    mergedConfig = webpackMerge.smartStrategy(mergeStrategy)(
      mergedConfig,
      presetConfig
    );
  }

  babelOptions.babelrc = false;

  // prepend babel-loader to loader array
  mergedConfig = webpackMerge(
    {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: babelOptions,
              },
            ],
          },
        ],
      },
    },
    mergedConfig
  );

  // ensure module.resolve does not get overwritten
  mergedConfig = webpackMerge(mergedConfig, {
    resolve: {
      // 'node_modules' makes webpack search all ancestor node_modules folders
      modules: [].concat(modulePaths, 'node_modules'),
    },
  });

  return mergedConfig;
}

module.exports = getWebpackConfig;
