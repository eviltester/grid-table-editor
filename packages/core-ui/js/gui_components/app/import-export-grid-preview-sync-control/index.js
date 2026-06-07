import { ImportExportGridPreviewSyncControlController } from './import-export-grid-preview-sync-control-controller.js';
import { ImportExportGridPreviewSyncControlView } from './import-export-grid-preview-sync-control-view.js';

function createImportExportGridPreviewSyncControlComponent({ root, props = {}, callbacks = {} } = {}) {
  const controller = new ImportExportGridPreviewSyncControlController({ props });
  const view = new ImportExportGridPreviewSyncControlView({
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

export { createImportExportGridPreviewSyncControlComponent };
