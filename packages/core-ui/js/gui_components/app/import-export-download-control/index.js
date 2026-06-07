import { ImportExportDownloadControlController } from './import-export-download-control-controller.js';
import { ImportExportDownloadControlView } from './import-export-download-control-view.js';

function createImportExportDownloadControlComponent({ root, props = {}, callbacks = {} } = {}) {
  const controller = new ImportExportDownloadControlController({ props });
  const view = new ImportExportDownloadControlView({
    root,
    controller,
    callbacks,
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

export { createImportExportDownloadControlComponent };
