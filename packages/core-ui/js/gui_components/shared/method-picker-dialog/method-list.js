import { MethodListController } from './method-list-controller.js';
import { MethodListView } from './method-list-view.js';

function createMethodList({ root, props = {}, callbacks = {} } = {}) {
  const controller = new MethodListController({ props });
  const view = new MethodListView({ root, controller, callbacks });
  view.mount();

  return {
    update(nextProps = {}) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
    focusCommand(command) {
      view.focusCommand(command);
    },
  };
}

export { createMethodList };
