# wub

`wub` is a tool designed to take the pain and repitition out of configuring `webpack`. `wub` is quite simply a function that takes the *presets* you specify and combines them into valid webpack config. These *presets* enable features you want from webpack, like CSS modules or a hot reloading React environment.

Here’s an example `webpack.config.js` that uses `wub`:

```js
module.exports = require('wub')([
  'preact',
  'postcss',
  'uglify',
]);
```

## Customisation

### Preset configuration

Individual `wub` presets may require you to specify *preset-specific* configuration options. For presets that require configuration, you can specify the preset as an array with two values: the *name* of the preset and a *configuration object* that will be passed through to the preset:

```js
module.exports = require('wub')([
  [
    // preset name
    'preact',
    // preset config object
    {
      rootComponent: './components/Site',
      domID: '.app-root',
    }
  ],
  'postcss',
  'uglify',
]);
```

### Global configuration

`wub` provides a global configuration object to each preset. The default configuration object provides a [`browserslist`][browserslist] that defaults to `['last 2 versions', '> 5%']`.

If you would like to customise this configuration or provide additional options to each preset, you can pass in an additional object to `wub`:

```js
module.exports = require('wub')([
  'preact',
  'postcss',
  'uglify',
], {
  browserslist: ['last 2 versions', '> 5%', 'IE 10']
});
```

### Configuration configuration 😓

Your `webpack` config might require settings that your presets cannot provide; perhaps an [entrypoint][entry] or [output options][output]. In this case, you can provide a minimal `webpack` config object to the end of your presets and `wub` will merge it into the final `webpack` config.

```js
module.exports = require('wub')([
  'preact',
  'postcss',
  'uglify',
  {
    output: {
      filename: 'bundle-[hash].js',
      path: './path/to/build/dir'
    }
  }
]);
```

You can also specify a function that will be treated like a preset with no configuration.

```js
module.exports = require('wub')([
  'preact',
  'postcss',
  'uglify',
  function(webpackOptions) {
    return {
      output: {
        filename: webpackOptions.hot ? 'bundle.js' : 'bundle-[hash].js',
        path: './path/to/build/dir'
      }
    }
  },
]);
```

[browserslist]: https://github.com/ai/browserslist
[entry]: https://webpack.js.org/configuration/entry-context/
[output]: https://webpack.js.org/configuration/output/
