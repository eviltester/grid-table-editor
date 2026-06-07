import { createFileImportBindingsAdapter } from '../import-export-adapters/file-import-bindings-adapter.js';
import { ImportExportImportControlController } from './import-export-import-control-controller.js';
import { ImportExportImportControlView } from './import-export-import-control-view.js';

function createImportExportImportControlComponent({ root, props = {}, callbacks = {}, services = {} } = {}) {
  const controller = new ImportExportImportControlController({ props });
  const view = new ImportExportImportControlView({
    root,
    controller,
    callbacks,
    services: {
      createFileImportBindingsAdapter: services.createFileImportBindingsAdapter || createFileImportBindingsAdapter,
    },
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

export { createImportExportImportControlComponent };
