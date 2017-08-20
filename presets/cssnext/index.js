const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(presetConfig, webpackOptions) {
  const options = Object.assign(
    { filename: 'style.[contenthash].css' },
    presetConfig
  );

  const postcssLoaderObject = {
    loader: require.resolve('postcss-loader'),
    options: {
      plugins: () => [
        require('postcss-cssnext')({ browserslist: this.browserslist }),
      ],
    },
  };

  const cssLoaderObject = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
    },
  };

  const plugins = [];
  if (!webpackOptions.hot) {
    plugins.push(new ExtractTextPlugin(options));
  }

  return {
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: webpackOptions.hot
            ? [
                require.resolve('style-loader'),
                cssLoaderObject,
                postcssLoaderObject,
              ]
            : ExtractTextPlugin.extract({
                use: [cssLoaderObject, postcssLoaderObject],
                fallback: require.resolve('style-loader'),
              }),
        },
      ],
    },
  };
};
