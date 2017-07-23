const invariant = require('invariant');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const portfinder = require('portfinder');

function run(args, webpackConfig) {
  portfinder.basePort = 8080;
  portfinder.getPort(function(err, port) {
    invariant(!err, err || 'no');

    webpackConfig.entry.unshift('webpack/hot/only-dev-server');
    webpackConfig.entry.unshift(
      `webpack-dev-server/client?http://localhost:${port}`
    );

    const compiler = webpack(webpackConfig);

    compiler.apply(new ProgressPlugin());
    compiler.plugin('done', () =>
      console.log('Serving on http://localhost:' + port)
    );

    const server = new WebpackDevServer(compiler, {
      // contentBase: dirPath,
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      stats: {
        colors: true,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    server.listen(port, '127.0.0.1', err => {
      invariant(!err, err || 'nope');
    });
  });
}

module.exports = { run };
