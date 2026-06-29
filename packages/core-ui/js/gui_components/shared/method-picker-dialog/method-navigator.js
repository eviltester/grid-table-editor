import { MethodNavigatorController } from './method-navigator-controller.js';
import { MethodNavigatorView } from './method-navigator-view.js';

function createMethodNavigator({ root, props = {}, callbacks = {} } = {}) {
  const controller = new MethodNavigatorController({ props });
  const view = new MethodNavigatorView({ root, controller, callbacks });
  view.mount();

  return {
    update(nextProps = {}) {
      controller.updateProps(nextProps);
      view.render();
    },
    focusSearch() {
      view.focusSearch();
    },
    isSearchFocused(documentObj) {
      return view.isSearchFocused(documentObj);
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createMethodNavigator };
