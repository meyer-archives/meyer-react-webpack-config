/* global __REACT_ROOT_ID__ */

var React = require('react');
var ReactDOM = require('react-dom');
var AppContainer = require('react-hot-loader').AppContainer;

var RootComponent = require('__ROOT_COMPONENT__').default;

if (typeof document !== 'undefined') {
  var reactRoot = document.getElementById(__REACT_ROOT_ID__);

  function renderComponent(Component) {
    ReactDOM.render(
      React.createElement(
        AppContainer,
        null,
        React.createElement(Component, null)
      ),
      reactRoot
    );
  }

  renderComponent(RootComponent);

  if (module.hot) {
    module.hot.accept('__ROOT_COMPONENT__', function() {
      var NewRootComponent = require('__ROOT_COMPONENT__').default;
      renderComponent(NewRootComponent);
    });
  }
}

module.exports = RootComponent;
