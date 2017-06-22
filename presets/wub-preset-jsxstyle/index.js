'use strict';
module.exports = function(env, options) {
  return {
    module: {
      rules: [
        {
          test: /\.js/,
          loader: require.resolve('jsxstyle-loader'),
          options,
        },
      ],
    },
  };
};
