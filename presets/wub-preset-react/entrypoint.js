/* global __REACT_ROOT_ID__ */

var React = require('react');
var ReactDOM = require('react-dom');
var AppContainer = require('react-hot-loader').AppContainer;

var RootComponent = require('__WUB_ENTRYPOINT__').default;

if (typeof document !== 'undefined') {
  var reactRoot = document.getElementById(__REACT_ROOT_ID__);

  var renderComponent = function(Component) {
    ReactDOM.render(
      React.createElement(
        AppContainer,
        null,
        React.createElement(Component, null)
      ),
      reactRoot
    );
  };

  renderComponent(RootComponent);

  if (module.hot) {
    module.hot.accept('__WUB_ENTRYPOINT__', function() {
      var NewRootComponent = require('__WUB_ENTRYPOINT__').default;
      renderComponent(NewRootComponent);
    });
  }
}

module.exports = RootComponent;
