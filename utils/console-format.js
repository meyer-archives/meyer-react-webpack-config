// super simplified & opinionated version of https://github.com/Marak/colors.js
// (zalgo???? whyyyyyyy)

const invariant = require('invariant');

const supportsColors = (function() {
  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();

const ansiCodes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
};

let appliedStyles = [];

function styleString() {
  const [str, ...styles] = Array.from(arguments);

  if (!supportsColors) return str;

  invariant(styles.length > 0, 'styleString requires at least two parameters');

  const oldStyles = appliedStyles.slice(0);

  const styled = styles.reduce((s, style) => {
    invariant(ansiCodes[style], `'${style}' is not a valid style.`);
    return `\u001b[${ansiCodes[style][0]}m${s}\u001b[${ansiCodes[style][1]}m`;
  }, str);

  if (appliedStyles.length === 0) {
    return styled;
  }

  return styleEnd() + styled + styleStart.call(null, oldStyles);
}

function styleStart() {
  if (!supportsColors) return '';
  return Array.from(arguments)
    .map(style => {
      invariant(ansiCodes[style], `'${style}' is not a valid style.`);
      appliedStyles.unshift(style);
      return `\u001b[${ansiCodes[style][0]}m`;
    })
    .join('');
}

function styleEnd() {
  if (!supportsColors) return '';
  const oldStyles = appliedStyles.slice(0);
  appliedStyles = [];
  return oldStyles.map(style => `\u001b[${ansiCodes[style][1]}m`).join('');
}

function cleanup({ exit }, err) {
  process.stdout.write(styleEnd());
  if (err) console.log(err.stack);
  if (exit) process.exit();
}

// prevent unclosed ANSI color weirdness
process.on('exit', cleanup);
process.on('SIGINT', cleanup.bind(null, { exit: true })); // Ctrl+C
process.on('SIGTERM', cleanup.bind(null, { exit: true })); // necessary?
process.on('uncaughtException', cleanup.bind(null, { exit: true }));

module.exports = { styleString, styleStart, styleEnd };
