// https://github.com/eslint/eslint/blob/master/lib/util/module-resolver.js
const Module = require('module');
const invariant = require('invariant');

// ModuleResolvers arguments are assumed to be paths or arrays of paths
class ModuleResolver {
  constructor(paths) {
    const modulePaths = Array.from(
      // dedupe
      new Set([].concat(paths, module.paths, Module.globalPaths).filter(f => f))
    );

    this.resolve = name => {
      const result = Module._findPath(name, modulePaths);
      invariant(result, 'Cannot find module `%s`', name);
      return result;
    };
  }
}

module.exports = ModuleResolver;
