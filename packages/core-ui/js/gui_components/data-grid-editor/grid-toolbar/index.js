import { GridToolbarController } from './grid-toolbar-controller.js';
import { GridToolbarView } from './grid-toolbar-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createGridToolbarComponent({ root, props = {}, callbacks = {}, documentObj } = {}) {
  const controller = new GridToolbarController({ props, callbacks });
  const view = new GridToolbarView({ root, controller, documentObj: resolveDocumentObj(documentObj, root) });
  view.mount();

  return {
    update(nextProps) {
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

export { createGridToolbarComponent, GridToolbarController, GridToolbarView };
