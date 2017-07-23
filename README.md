# wub
`wub` is a lightweight wrapper around `webpack` and `webpack-dev-server`.

It provides a `cli` application with two commands, `serve` and `build`, and it also exports a method that lets you build your own `webpack` config from `wub` presets.

Using `wub` is as simple as 1, 2.

1. Install it:

```npm install --save wub```

2. Use it:

  - If you’d like `wub` to manage `webpack` and `webpack-dev-server` versions,
    use the **CLI application**.

    In your project folder, create a file called `wub.config.js` that looks something like this:

```js
module.exports = {
  entrypoint: './components/Site',
  presets: ['react', 'postcss'],
};
```

  - If you’d like access to the raw webpack config, use the **node API**:

    In your project folder, create a webpack config file with the following contents:

```js
module.exports = require('wub')({
  entrypoint: './components/Site',
  presets: ['react', 'postcss'],
});
```


3. #### Add `scripts` to your `package.json` file:

- For a **producution** build:

    ```webpack -p --progress```

- For a **development** hot-reloading environment:

    ```webpack-dev-server --hot --hotOnly --inline --historyApiFallback```

[browserslist]: https://github.com/ai/browserslist
