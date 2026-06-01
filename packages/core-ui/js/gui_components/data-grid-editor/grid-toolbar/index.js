import { GridToolbarController } from './grid-toolbar-controller.js';
import { GridToolbarView } from './grid-toolbar-view.js';

function createGridToolbarComponent({ root, props = {}, callbacks = {}, documentObj = document } = {}) {
  const controller = new GridToolbarController({ props, callbacks });
  const view = new GridToolbarView({ root, controller, documentObj });
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
