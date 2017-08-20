/** @jsx h */
/* global __DOM_ID__ */

import { h, render } from 'preact';

if (
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
) {
  let root = document.getElementById(__DOM_ID__);
  const init = () => {
    const RootComponent = require('__PREACT_ROOT_COMPONENT__').default;
    root = render(h(RootComponent), document.body, root);
  };

  if (module.hot) {
    require('preact/devtools');
    module.hot.accept('__PREACT_ROOT_COMPONENT__', () =>
      requestAnimationFrame(init)
    );
  }

  init();
}

export { default } from '__PREACT_ROOT_COMPONENT__';
