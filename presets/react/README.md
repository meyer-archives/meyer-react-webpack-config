# wub-preset-react

This [wub preset][] adds React and `react-hot-loader` support to webpack.

| Config option | Required? | Description |
|:--|:---:|:--|
| `rootComponent` | ✓ | Path to the root component for your React app. |
| `emitIndex` |  | Emit an `index.html` file that points to your bundle. Defaults to `true` when hot reloading. |
| `domID` | | The ID of the element that React will mount to. |

[wub preset]: https://github.com/meyer/wub
