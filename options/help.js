const pkg = require('../package.json');

const {
  styleString,
  styleStart,
  styleEnd,
} = require('../utils/console-format');

function run(args, err) {
  const binaryPath = process.argv[1];
  const binaryName = binaryPath.split('/').pop();

  // prettier-ignore
  const info = `${styleStart('bold')}WUB: Webpack Uh-pinionated B...CLI${styleEnd()}

Two options for you:

${styleStart('bold', 'yellow', 'underline')}${binaryName} serve${styleEnd()} -- Serve your project with webpack dev server.
${styleStart('bold', 'yellow', 'underline')}${binaryName} build${styleEnd()} -- Compile your project with webpack.

Read more here: ${styleString(pkg.homepage, 'underline')}
`

  if (err) {
    console.error(
      styleStart('red') +
        'Error running ' +
        styleString(binaryName, 'red', 'bold') +
        ':\n' +
        err.message +
        styleEnd()
    );
    console.info('\n~~~\n');
    console.info(info);
    process.exit(69);
  }

  console.info(info);
  process.exit(0);
}

module.exports = { run };
