const fs = require('fs');
const path = require('path');
const invariant = require('invariant');

const configFilename = 'wub.config.js';

function getNearestConfig(startDir) {
  invariant(
    typeof startDir === 'string' &&
      startDir !== '' &&
      path.isAbsolute(startDir),
    'getNearestConfig expects an absolute path as its first and only parameter'
  );

  const searchPaths = startDir
    // trim initial slash as well as terminal slash
    .replace(/^\/+|\/+$/g, '')
    .split(path.sep)
    // add that initial slash back in
    .map((b, i, a) => '/' + a.slice(0, i + 1).join(path.sep))
    .reverse();

  let configFilePath;

  for (let i = -1, len = searchPaths.length; ++i < len; ) {
    const p = searchPaths[i];
    const potentialConfig = path.join(p, configFilename);

    if (fs.existsSync(potentialConfig)) {
      configFilePath = potentialConfig;
      break;
    }
  }

  invariant(
    typeof configFilePath === 'string',
    'getNearestConfig could not find a config file named `%s` in any of the following paths:\n%s',
    configFilename,
    searchPaths.map(f => '- ' + f).join('\n')
  );

  return configFilePath;
}

module.exports = getNearestConfig;
