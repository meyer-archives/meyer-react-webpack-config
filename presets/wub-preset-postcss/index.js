const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function({ browserslist }, presetConfig, isServing) {
  const cssFileName = presetConfig.cssFileName || 'bundle.css';

  const postcssLoaderObject = {
    loader: require.resolve('postcss-loader'),
    options: {
      plugins: () => [require('postcss-cssnext')({ browserslist })],
    },
  };

  const cssLoaderObject = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
    },
  };

  const plugins = [];
  if (!isServing) {
    plugins.push(new ExtractTextPlugin(cssFileName));
  }

  return {
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: isServing
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
