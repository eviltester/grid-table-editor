import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { createFileImportBindingsAdapter } from '../import-export-adapters/file-import-bindings-adapter.js';
import { ImportExportToolbarController } from './import-export-toolbar-controller.js';
import { ImportExportToolbarView } from './import-export-toolbar-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createImportExportToolbarComponent({ root, props = {}, callbacks = {}, services = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new ImportExportToolbarController({ props });
  const view = new ImportExportToolbarView({
    root,
    controller,
    callbacks,
    services: {
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(resolvedDocumentObj, root),
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

export { createImportExportToolbarComponent };
