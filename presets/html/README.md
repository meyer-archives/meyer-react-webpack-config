# wub-preset-html

This [wub preset][] adds an instance of `html-webpack-plugin` to webpack.

| Config option | Required? | Description |
|:--|:---:|:--|
| `template` | | Path to the root component for your preact app. Will be resolved relative to your project directory (obviously). |
| `...options` |  | Any valid [`html-webpack-plugin` option][options]. |

[options]: https://github.com/jantimon/html-webpack-plugin#configuration
[wub preset]: https://github.com/meyer/wub
