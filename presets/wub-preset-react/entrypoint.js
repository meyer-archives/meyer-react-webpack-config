/* global __REACT_ROOT_ID__ */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import RootComponent from '__WUB_ENTRYPOINT__';

if (typeof document !== 'undefined') {
  const reactRoot = document.getElementById(__REACT_ROOT_ID__);

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
    module.hot.accept('__WUB_ENTRYPOINT__', () => {
      const NewRootComponent = require('__WUB_ENTRYPOINT__').default;
      renderComponent(NewRootComponent);
    });
  }
}

module.exports = RootComponent;
