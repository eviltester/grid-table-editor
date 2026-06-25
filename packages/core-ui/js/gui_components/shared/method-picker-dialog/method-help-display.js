import { MethodHelpDisplayController } from './method-help-display-controller.js';
import { MethodHelpDisplayView } from './method-help-display-view.js';

function createMethodHelpDisplay({ root, props = {} } = {}) {
  const controller = new MethodHelpDisplayController({ props });
  const view = new MethodHelpDisplayView({ root, controller });
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
  };
}

export { createMethodHelpDisplay };
