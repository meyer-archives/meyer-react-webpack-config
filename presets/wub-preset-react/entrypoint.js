/* global __REACT_ROOT_ID__ */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import RootComponent from '__WUB_ENTRYPOINT__';

console.log('wow!');

if (typeof document !== 'undefined') {
  const reactRoot = document.getElementById(__REACT_ROOT_ID__);

  const renderComponent = () => {
    ReactDOM.render(
      <AppContainer>
        <RootComponent />
      </AppContainer>,
      reactRoot
    );
  };

  renderComponent(RootComponent);

  if (module.hot) {
    module.hot.accept('__WUB_ENTRYPOINT__', renderComponent);
  }
}

module.exports = RootComponent;
