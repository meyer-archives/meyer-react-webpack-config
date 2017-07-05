'use strict';

const path = require('path');

const modulePaths = [
  // check webpack config folder first
  path.join(__dirname, 'node_modules'),
  // fall back to project folder
  path.join(process.env.PWD, 'node_modules'),
];

process.env.NODE_PATH = modulePaths.join(':');
require('module').Module._initPaths();

const invariant = require('invariant');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const EvaluateBundlePlugin = require('./EvaluateBundlePlugin');
const entrypointPath = require.resolve('./entrypoint');

function getWebpackConfig({
  componentPath,
  buildPath,
  jsxstyleLoaderOptions,
  emitCallback,
  htmlTemplate = path.resolve(__dirname, 'template.html'),
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

  invariant(
    typeof htmlTemplate === 'string' &&
      path.isAbsolute(htmlTemplate) &&
      path.extname(htmlTemplate) === '.html',
    '`htmlTemplate` is expected to be an absolute path to a HTML file'
  );

  if (typeof emitCallback !== 'undefined') {
    invariant(
      typeof emitCallback === 'function',
      '`emitCallback` is expected to be a function'
    );
  }

  const postcssLoaderObject = {
    loader: require.resolve('postcss-loader'),
    options: {
      plugins: loader => [require('postcss-cssnext')({ browsers })],
    },
  };

  const cssLoaderObject = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
    },
  };

  return function(idk, env) {
    return {
      entry: [
        // patch is a noop in non-hot environments, but let's filter it out anyway
        env.hot && require.resolve('react-hot-loader/patch'),
        entrypointPath,
      ].filter(f => f),
      output: {
        path: buildPath,
        filename: bundleFileName,
      },
      plugins: [
        !env.hot &&
          emitCallback &&
          new EvaluateBundlePlugin({ callback: emitCallback }),
        env.hot && new webpack.NamedModulesPlugin(),
        !env.hot && new ExtractTextPlugin(cssFileName),
        new HtmlWebpackPlugin({
          template: htmlTemplate,
          inject: false,
          _react_id: reactID,
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
          __REACT_ROOT_ID__: JSON.stringify(reactID),
          __ROOT_COMPONENT__: JSON.stringify(componentPath),
        }),
      ].filter(f => f),
      resolve: {
        alias: {
          __ROOT_COMPONENT__: componentPath,
        },
        modules: [].concat(modulePaths, 'node_modules'),
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
                    env.hot && require.resolve('react-hot-loader/babel'),
                    require.resolve(
                      'babel-plugin-transform-object-rest-spread'
                    ),
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
            use: env.hot
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
              loader: require.resolve('file-loader'),
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
  };
}

module.exports = getWebpackConfig;
