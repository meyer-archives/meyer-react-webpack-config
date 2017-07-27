const domID = '.wub-demo';

module.exports = require('../')({
  entrypoint: './Demo',
  presets: [
    ['react', { domID }],
    'cssnext',
    [
      'html',
      {
        title: 'wub + react demo',
        template: './template.ejs',
        _react_dom_id: domID,
      },
    ],
  ],
});
