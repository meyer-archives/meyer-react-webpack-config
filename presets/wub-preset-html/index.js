'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlTemplate = path.resolve(__dirname, 'template.html');

module.exports = function() {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: htmlTemplate,
        inject: false,
      }),
    ],
  };
};
