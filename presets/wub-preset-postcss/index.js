const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(env, options, { browserslist }) {
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

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: env.hot
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
