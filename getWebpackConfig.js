const path = require('path');
const webpackMerge = require('webpack-merge');
const Module = require('module');
const invariant = require('invariant');

/**
 * Merges presets specified in a wub config object into a webpack config
 * @param {object} wubConfig wub config object
 * @param {string} webpackOptions webpack's `options` object passed through to wub
 * @returns {object} merged webpack config object
 */
function getWebpackConfig(wubConfig, webpackOptions) {
  const modulePaths = Array.from(
    // dedupe
    new Set(
      [].concat(
        // project directory
        path.join(wubConfig.configFileDir, 'node_modules'),
        // PWD (might not be the project directory)
        path.join(process.env.PWD, 'node_modules'),
        // wub directory
        path.join(__dirname, 'node_modules'),
        // preset directories
        wubConfig.presets.map(p =>
          path.resolve(path.dirname(p[0]), 'node_modules')
        ),
        module.paths,
        Module.globalPaths
      )
    )
  );

  // gross
  process.env.NODE_PATH = modulePaths.join(':');
  Module.Module._initPaths();
  const webpack = require('webpack');
  const webpackPkgJson = require('webpack/package');

  invariant(
    (webpackPkgJson.version + '').startsWith('3.'),
    'wub is designed to work webpack 3. webpack %s is not supported.',
    webpackPkgJson.version
  );

  // base configuration
  let mergedConfig = {
    entry: [wubConfig.entrypoint],
    output: {
      path: wubConfig.outputPath,
      filename: wubConfig.outputFilename,
    },
    resolve: {
      alias: {
        __WUB_ENTRYPOINT__: wubConfig.entrypoint,
      },
      // 'node_modules' makes webpack search all ancestor node_modules folders
      modules: [].concat(modulePaths, 'node_modules'),
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
    presets: [['env', { targets: { browsers: wubConfig.browserslist } }]],
    plugins: ['transform-object-rest-spread', 'transform-object-assign'],
  };

  const mergeStrategy = { entry: 'replace' };

  // loop through presets
  for (let idx = -1, len = wubConfig.presets.length; ++idx < len; ) {
    const [presetPath, presetOptions] = wubConfig.presets[idx];

    const presetConfig = require(presetPath)(
      wubConfig,
      presetOptions,
      webpackOptions,
      babelOptions
    );

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

  return mergedConfig;
}

module.exports = getWebpackConfig;
