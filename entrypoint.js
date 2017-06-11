/* global __REACT_ROOT_ID__ */

var React = require('react');
var ReactDOM = require('react-dom');
var AppContainer = require('react-hot-loader').AppContainer;

var reactRoot = document.getElementById(__REACT_ROOT_ID__);

function renderComponent() {
  var Component = require('__ROOT_COMPONENT__').default;

  ReactDOM.render(
    React.createElement(
      AppContainer,
      null,
      React.createElement(Component, null)
    ),
    reactRoot
  );
}

renderComponent();

if (module.hot) {
  module.hot.accept('__ROOT_COMPONENT__', renderComponent);
} else {
  module.exports = require('__ROOT_COMPONENT__').default;
}
