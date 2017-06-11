const invariant = require('invariant');
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entrypointPath = require.resolve('./entrypoint');

// gross
const IS_HOT =
  typeof process.argv[1] === 'string' &&
  /webpack-dev-server/.test(process.argv[1]);

function getWebpackConfig({
  componentPath,
  buildPath,
  jsxstyleLoaderOptions,
  reactID = '.react-root',
  cssFileName = 'bundle.css',
  bundleFileName = 'bundle.js',
  browsers = ['last 2 versions', '> 5%'],
}) {
  invariant(
    typeof componentPath === 'string' &&
      path.isAbsolute(componentPath) &&
      path.extname(componentPath) === '.js',
    '`componentPath` is expected to be an absolute path to a JS file'
  );

  invariant(
    typeof buildPath === 'string' && path.isAbsolute(buildPath),
    '`buildPath` is expected to be an absolute path to a directory'
  );

  const postcssLoaderObject = {
    loader: require.resolve('postcss-loader'),
    options: {
      plugins: loader => [require('postcss-cssnext')({ browsers })],
    },
  };

  const cssLoaderObject = {
    loader: require.resolve('css-loader'),
    options: {
      modules: true,
      importLoaders: 1,
    },
  };

  return {
    entry: [
      // patch is a noop in non-hot environments, but let's filter it out anyway
      IS_HOT && require.resolve('react-hot-loader/patch'),
      entrypointPath,
    ].filter(f => f),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: bundleFileName,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: './DemoPage.js',
        template: path.resolve(__dirname, 'template.html'),
        inject: false,
        _react_id: reactID,
      }),
      IS_HOT ? new webpack.NamedModulesPlugin() : null,
      new webpack.NoEmitOnErrorsPlugin(),
      IS_HOT ? null : new ExtractTextPlugin(cssFileName),
      new webpack.DefinePlugin({
        __REACT_ROOT_ID__: JSON.stringify(reactID),
        __ROOT_COMPONENT__: JSON.stringify(componentPath),
      }),
    ].filter(f => f),
    resolve: {
      alias: {
        __ROOT_COMPONENT__: componentPath,
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                // ignoring babelrc
                babelrc: false,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    { targets: { browsers } },
                  ],
                  require.resolve('babel-preset-react'),
                ],
                plugins: [
                  IS_HOT && require.resolve('react-hot-loader/babel'),
                  require.resolve('babel-plugin-transform-object-rest-spread'),
                  require.resolve('babel-plugin-transform-object-assign'),
                ].filter(f => f),
              },
            },
            {
              loader: require.resolve('jsxstyle-loader'),
              options: jsxstyleLoaderOptions,
            },
          ],
        },
        {
          test: /\.css$/,
          use: IS_HOT
            ? [
                require.resolve('style-loader'),
                cssLoaderObject,
                postcssLoaderObject,
              ]
            : ExtractTextPlugin.extract({
                use: [cssLoaderObject, postcssLoaderObject],
                fallback: require.resolve('style-loader'),
              }),
        },
        {
          test: /fonts\/[^/]+\.(eot|svg|ttf|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'webfonts/[name].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          use: [
            require.resolve('raw-loader'),
            {
              loader: require.resolve('svgo-loader'),
              query: {
                plugins: [{ removeTitle: true }, { convertPathData: false }],
              },
            },
          ],
        },
      ],
    },
  };
}

module.exports = getWebpackConfig;
