'use strict';

const EvaluateBundlePlugin = require('evaluate-bundle-webpack-plugin');

module.exports = function(pluginOptions) {
  return {
    plugins: [new EvaluateBundlePlugin(pluginOptions)],
  };
};
