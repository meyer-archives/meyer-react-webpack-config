# wub-preset-uglify

This [wub preset][] enables production minification with `uglifyjs-webpack-plugin`. It is equivalent to running `webpack` with the `-p` flag, with two exception: it’s using the beta version of Uglify v3, and Uglify options can be configured.

| Config option | Required? | Description |
|:--|:---:|:--|
| `uglifyOptions` | | Object of [uglify options][] to be passed to `UglifyJsPlugin` |

[uglify options]: https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/master#uglifyoptions
[wub preset]: https://github.com/meyer/wub
