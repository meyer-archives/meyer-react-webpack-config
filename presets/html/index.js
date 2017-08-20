'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(presetOptions) {
  let templatePath;
  if (presetOptions.hasOwnProperty('template')) {
    templatePath = this.projectResolver.resolve(presetOptions.template);
  } else {
    templatePath = path.resolve(__dirname, 'template.ejs');
  }

  return {
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {
            // default options
            inject: false,
            title: 'wub',
          },
          presetOptions,
          {
            template: templatePath,
          }
        )
      ),
    ],
  };
};
