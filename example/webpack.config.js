module.exports = require('../')({
  entrypoint: './Demo',
  presets: [
    [
      'react',
      {
        domID: '.react-root',
      },
    ],
    'postcss',
    'html',
  ],
});
