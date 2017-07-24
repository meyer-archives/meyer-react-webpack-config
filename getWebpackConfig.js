const path = require('path');
const webpackMerge = require('webpack-merge');

/**
 * Merges presets specified in a wub config object into a webpack config
 * @param {Object} wubConfig wub config object
 * @param {String} webpackOptions webpack's `options` object passed through to wub
 * @returns {Object} merged webpack config object
 */
function getWebpackConfig(wubConfig, modulePaths, webpackOptions) {
  // gross
  const webpack = require('webpack');

  // base configuration
  let mergedConfig = {
    entry: [wubConfig.entrypoint],
    output: {
      path: path.join(process.env.PWD, 'build'),
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
