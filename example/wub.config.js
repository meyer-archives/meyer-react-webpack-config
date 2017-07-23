module.exports = {
  entrypoint: require.resolve('./Demo'),
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
};
