// definitely inspired by babel config
require('wub')({
  babelrc: {}, // either an object or path to babelrc file
  browserslist: [], // either an array or path to browserslist file
  presets: [
    // either a string or a two-item array
    'wub-preset-postcss',
    ['wub-preset-eval-bundle', { callback: () => ({}) }],
    ['wub-preset-react', { mountID: '.react-root' }],
  ],
});

// wub-react-preset

module.exports = function reactPreset(env, options) {
  return {
    entry: [options.entrypoint],
    definitions: {
      __REACT_ROOT_ID__: JSON.stringify(options.mountID),
      __ROOT_COMPONENT__: JSON.stringify(options.componentPath),
    },
    plugins: [
      env.hot &&
        new HtmlWebpackPlugin({
          template: options.htmlTemplate,
          inject: false,
          _react_id: options.mountID,
        }),
    ].filter(f => f),
  };
};

// wub-react-preset/options.json

{
}
