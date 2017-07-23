const fs = require('fs');
const path = require('path');
const invariant = require('invariant');

/**
 * Find a file by the name of `filename` that's closest to `startDir`
 * @param {string} filename
 * @param {string} startDir
 * @returns {string} absolute path to the file
 */
function getClosestAncestor(filename, startDir) {
  invariant(
    typeof startDir === 'string' &&
      startDir !== '' &&
      path.isAbsolute(startDir),
    'getClosestAncestor expects an absolute path as its first and only parameter'
  );

  const searchPaths = startDir
    // trim initial slash as well as terminal slash
    .replace(/^\/+|\/+$/g, '')
    .split(path.sep)
    // add that initial slash back in
    .map((b, i, a) => '/' + a.slice(0, i + 1).join(path.sep))
    .reverse();

  let filePath;

  for (let i = -1, len = searchPaths.length; ++i < len; ) {
    const p = searchPaths[i];
    const potentialFilePath = path.join(p, filename);

    if (fs.existsSync(potentialFilePath)) {
      filePath = potentialFilePath;
      break;
    }
  }

  invariant(
    typeof filePath === 'string',
    'getClosestAncestor could not find a file named `%s` in any of the following paths:\n%s',
    filename,
    searchPaths.map(f => '- ' + f).join('\n')
  );

  return filePath;
}

module.exports = getClosestAncestor;
