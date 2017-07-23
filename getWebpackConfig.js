const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

function getWebpackConfig(config, command) {
  // Add each preset's node_module path to the require path
  const modulePaths = config.presets.map(p =>
    path.resolve(path.dirname(p[0]), 'node_modules')
  );
  // allow local override
  modulePaths.unshift(path.join(process.env.PWD, 'node_modules'));
  // fall back to project folder
  modulePaths.push(path.join(__dirname, 'node_modules'));

  process.env.NODE_PATH = modulePaths.join(':');
  require('module').Module._initPaths();

  const isServing = command === 'serve';

  // base configuration
  let mergedConfig = {
    entry: config.entrypoint,
    output: {
      path: path.join(process.env.PWD, 'build'),
    },
    resolve: {
      alias: {
        __WUB_ENTRYPOINT__: config.entrypoint,
      },
      // 'node_modules' makes webpack search all ancestor node_modules folders
      modules: [].concat(modulePaths, 'node_modules'),
    },
    module: { rules: [] },
    plugins: [
      new webpack.DefinePlugin({
        __WUB_ENTRYPOINT__: JSON.stringify(config.entrypoint),
      }),
      // enable named modules in development
      isServing && new webpack.NamedModulesPlugin(),
    ].filter(f => f),
  };

  const babelOptions = {
    presets: [['env', { targets: { browsers: config.browserslist } }]],
    plugins: ['transform-object-rest-spread', 'transform-object-assign'],
  };

  for (let idx = -1, len = config.presets.length; ++idx < len; ) {
    const [presetPath, presetOptions] = config.presets[idx];

    const getPreset = require(presetPath);
    const presetConfig = getPreset(
      config,
      presetOptions,
      isServing,
      babelOptions
    );

    mergedConfig = webpackMerge(mergedConfig, presetConfig);
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
