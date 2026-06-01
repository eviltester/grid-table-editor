import { ImportExportToolbarController } from './import-export-toolbar-controller.js';
import { ImportExportToolbarView } from './import-export-toolbar-view.js';

function createImportExportToolbarComponent({ root, props = {} } = {}) {
  const controller = new ImportExportToolbarController({ props });
  const view = new ImportExportToolbarView({
    root,
    controller,
  });

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

export { createImportExportToolbarComponent, ImportExportToolbarController, ImportExportToolbarView };
