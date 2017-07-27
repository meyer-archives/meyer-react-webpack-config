module.exports = require('../')({
  entrypoint: './Demo',
  presets: [
    'preact',
    'cssnext',
    [
      'html',
      {
        title: 'wub + preact demo',
        template: './template.ejs',
      },
    ],
  ],
});
