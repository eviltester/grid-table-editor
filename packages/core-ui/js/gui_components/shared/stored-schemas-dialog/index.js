import { StoredSchemasDialogController } from './stored-schemas-dialog-controller.js';
import { StoredSchemasDialogView } from './stored-schemas-dialog-view.js';

function createStoredSchemasDialogComponent({ documentObj, windowObj, callbacks = {} } = {}) {
  const controller = new StoredSchemasDialogController();
  const view = new StoredSchemasDialogView({
    controller,
    documentObj,
    windowObj,
    callbacks,
  });

  return {
    open(entries) {
      view.open(entries);
    },
    show() {
      view.show();
    },
    hide() {
      view.hide();
    },
    setEntries(entries) {
      view.setEntries(entries);
    },
    close() {
      view.close();
    },
    destroy() {
      view.destroy();
    },
  };
}

export { createStoredSchemasDialogComponent };
