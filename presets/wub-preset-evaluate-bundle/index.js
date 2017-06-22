'use strict';

const EvaluateBundlePlugin = require('evaluate-bundle-webpack-plugin');

module.exports = function(env, options) {
  return {
    plugins: [new EvaluateBundlePlugin(options)],
  };
};
