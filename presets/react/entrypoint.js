/* global __DOM_ID__ */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import RootComponent from '__REACT_ROOT_COMPONENT__';

if (typeof document !== 'undefined') {
  const reactRoot = document.getElementById(__DOM_ID__);

  const renderComponent = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      reactRoot
    );
  };

  renderComponent(RootComponent);

  if (module.hot) {
    module.hot.accept('__REACT_ROOT_COMPONENT__', () => {
      const NewRootComponent = require('__REACT_ROOT_COMPONENT__').default;
      renderComponent(NewRootComponent);
    });
  }
}

module.exports = RootComponent;
