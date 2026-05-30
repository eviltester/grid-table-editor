import { RowCountControlController } from './row-count-control-controller.js';
import { RowCountControlView } from './row-count-control-view.js';

function createRowCountControl({ root, props = {}, callbacks = {}, documentObj = document } = {}) {
  const controller = new RowCountControlController({ props, callbacks });
  const view = new RowCountControlView({ root, controller, documentObj });
  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    focus() {
      view.focus();
    },
    getState() {
      return controller.getState();
    },
    getParsedValue() {
      return controller.getParsedValue();
    },
  };
}

export { createRowCountControl, RowCountControlController, RowCountControlView };
