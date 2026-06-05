import { RowCountControlController } from './row-count-control-controller.js';
import { RowCountControlView } from './row-count-control-view.js';
import { parseRowCountInputElement } from './row-count-control-parsing.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createRowCountControl({ root, props = {}, callbacks = {}, documentObj = getDefaultDocumentObj() } = {}) {
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
      return controller.parseValue(view.getInputValue());
    },
  };
}

export { createRowCountControl, RowCountControlController, RowCountControlView };
export { parseRowCountInputElement };
