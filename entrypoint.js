/* global __REACT_ROOT_ID__ */

const React = require('react');
const ReactDOM = require('react-dom');
const { AppContainer } = require('react-hot-loader');

const reactRoot = document.getElementById(__REACT_ROOT_ID__);

function renderComponent() {
  const Component = require('__ROOT_COMPONENT__').default;

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
