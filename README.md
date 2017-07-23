# wub
`wub` is a lightweight wrapper around `webpack` and `webpack-dev-server`.

It provides a CLI application with two commands, `serve` and `build`, and it also exports a method that lets you build your own `webpack` config from `wub` presets.

**`wub` presets** are lightweight webpack configs that enable one feature.

## Getting Started

Install `wub` globally with `npm install -g wub`. It will be available to you on the command line as `wub`.

In your project folder, run `wub init`. This will generate a barebones `wub.config.js` file which you can then tweak.

Here’s an example:

```js
module.exports = {
  entrypoint: './components/Site',
  presets: [
    ['react', {domID: '.react-root'}],
    'postcss',
  ],
};
```

### Alternate usage

If you’d like to manage `webpack` and `webpack-dev-server` versions yourself, you’ll want to use the **node API** to generate a webpack config. Install `wub` locally by running `npm install wub`.

In your project folder, create a webpack config file with the following contents:

```js
module.exports = require('wub')({
  entrypoint: './components/Site',
  presets: [
    ['react', {domID: '.react-root'}],
    'postcss',
  ],
});
```

If you’re using the node API, you’ll need to pass an additional `env` flag to webpack to switch between `serve` and `build`.

[browserslist]: https://github.com/ai/browserslist
