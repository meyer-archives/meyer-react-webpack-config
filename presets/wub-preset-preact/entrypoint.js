/** jsx h */

var h = require('preact').h;
var render = require('preact').render;

var RootComponent = require('__ROOT_COMPONENT__').default;

if (typeof document !== 'undefined') {
  var root;
  var renderComponent = function(Component) {
    root = render(h(Component, null), document.body, root);
  };
  renderComponent(RootComponent);

  if (module.hot) {
    require('preact/devtools');
    module.hot.accept('__ROOT_COMPONENT__', function() {
      var NewRootComponent = require('__ROOT_COMPONENT__').default;
      renderComponent(NewRootComponent);
    });
  }
}

module.exports = RootComponent;
