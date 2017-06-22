#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const invariant = require('invariant');

const pkg = require('./package.json');

// Add pwd and wub project dir to module resolve paths
const modulePaths = [
  path.join(process.env.PWD, 'node_modules'),
  path.join(__dirname, 'node_modules'),
];
process.env.NODE_PATH = modulePaths.join(':');
require('module').Module._initPaths();

const { styleString, styleStart, styleEnd } = require('./utils/console-format');

const defaultBuildDir = './dist';

const [binaryPath, command, ...args] = process.argv.slice(1);
const binaryName = binaryPath.split('/').pop();

// prettier-ignore
const info = `${styleStart('bold')}WUB: Webpack Uh-pinionated B...CLI${styleEnd()}

By default, the entrypoint is read from the \`main\` field in your
  project\u2019s package.json file, but you can also specify it if you wish.

Two options for you:

${styleStart('bold', 'yellow', 'underline')}${binaryName} serve [port]${styleEnd()}
Serve your project with webpack dev server.
  - ${styleString('port', 'bold')} defaults to 3000.

${styleStart('bold', 'yellow', 'underline')}${binaryName} build [destination]${styleEnd()}
Compile your project with webpack.
  - ${styleString('destination', 'bold')} defaults to \`${defaultBuildDir}\`.

Read more here: ${styleString(pkg.homepage, 'underline')}
`

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  invariant(command, 'An argument is required');

  if (command === 'help') {
    console.log(info);
    process.exit(0);
  } else if (command === 'build' || command === 'serve') {
    // build: build main with webpack
    if (command === 'build') {
      invariant(
        args.length <= 1,
        `\`${binaryName} build\` takes one optional parameter.`
      );

      require('./options/build')({});

      // serve: serve main with webpack-dev-server
    } else {
      invariant(
        args.length === 2,
        '`serve` expects two arguments: a component path and a port number'
      );

      const port = parseInt(args[1]);

      invariant(port > 1024, 'Port number should be greater than 1024');

      require('./options/serve')({});
    }
  } else {
    invariant(false, `Invalid command: \`${command}\``);
  }
} catch (err) {
  console.error(styleString(err.message, 'red', 'bold'));
  console.log('\n~~~\n');
  console.log(info);
  process.exit(69);
}
