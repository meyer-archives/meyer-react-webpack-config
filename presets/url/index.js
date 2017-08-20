module.exports = function({ test }) {
  return {
    module: {
      rules: [
        {
          test,
          loader: require.resolve('url-loader'),
          options: {
            limit: 8192,
          },
        },
      ],
    },
  };
};
