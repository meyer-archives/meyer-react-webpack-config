'use strict';

const path = require('path');

module.exports = require('../')({
  componentPath: require.resolve('./Demo'),
  buildPath: path.resolve('build'),
  reactID: '.example',
});
