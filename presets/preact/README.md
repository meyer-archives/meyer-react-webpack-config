# wub-preset-preact

This [wub preset][] adds `preact` support to webpack.

| Config option | Required? | Description |
|:--|:---:|:--|
| `rootComponent` | ✓ | Path to the root component for your preact app. |
| `emitIndex` |  | Emit an `index.html` file that points to your bundle. Defaults to `true` when hot reloading. |
| `domID` | | The ID of the element that preact will mount to. |

[wub preset]: https://github.com/meyer/wub
