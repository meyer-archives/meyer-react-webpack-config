#!/usr/bin/env node
/* eslint-disable no-console */

const invariant = require('invariant');

const getNearestConfig = require('./getNearestConfig');
const getWebpackConfig = require('./getWebpackConfig');
const normaliseConfig = require('./normaliseConfig');

const [command, ...args] = process.argv.slice(2);

const commands = {
  build: require('./options/build'),
  serve: require('./options/serve'),
};

if (command === 'help') {
  require('./options/help').run(args);
}

try {
  invariant(command, 'An argument is required');
  invariant(commands.hasOwnProperty(command), 'Invalid option: `%s`', command);

  const configFilePath = getNearestConfig(process.cwd());
  const config = require(configFilePath);
  const normalisedConfig = normaliseConfig(config);
  const webpackConfig = getWebpackConfig(normalisedConfig, command);
  commands[command].run(args, webpackConfig);
} catch (err) {
  require('./options/help').run(args, err);
}
