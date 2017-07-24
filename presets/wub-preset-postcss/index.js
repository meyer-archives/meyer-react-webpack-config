const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function({ browserslist }, presetConfig, { hot }) {
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
  if (!hot) {
    plugins.push(new ExtractTextPlugin(cssFileName));
  }

  return {
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: hot
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
