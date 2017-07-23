'use strict';
module.exports = function(pluginOptions) {
  return {
    module: {
      rules: [
        {
          test: /\.js/,
          loader: require.resolve('jsxstyle-loader'),
          pluginOptions,
        },
      ],
    },
  };
};
