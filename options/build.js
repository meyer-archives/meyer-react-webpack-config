const invariant = require('invariant');

function validate(args, config) {
  invariant(args.length <= 1, '`build` command takes one optional parameter.');
}

function run() {}

module.exports = { validate, run };
