const invariant = require('invariant');

module.exports = function({ test }) {
  invariant(
    typeof test !== 'undefined',
    'wub-preset-svgo expects the `test` param to be a regular expression'
  );

  return {
    module: {
      rules: [
        {
          test,
          use: [
            {
              loader: require.resolve('raw-loader'),
            },
            {
              loader: require.resolve('svgo-loader'),
              options: {
                plugins: [{ removeTitle: true }],
              },
            },
          ],
        },
      ],
    },
  };
};
