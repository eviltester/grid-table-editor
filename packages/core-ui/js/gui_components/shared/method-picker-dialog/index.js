import { resolveDocumentObj } from '../dom/default-objects.js';
import { MethodPickerDialogController } from './method-picker-dialog-controller.js';
import { MethodPickerDialogView } from './method-picker-dialog-view.js';

function createMethodPickerDialog({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocument = resolveDocumentObj(documentObj, root);
  const controller = new MethodPickerDialogController({ props, services });
  const view = new MethodPickerDialogView({
    root,
    controller,
    callbacks,
    documentObj: resolvedDocument,
  });
  view.mount();

  return {
    update(nextProps = {}) {
      controller.updateProps(nextProps);
      view.render();
    },
    focusSearch() {
      view.focusSearch();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createMethodPickerDialog };
