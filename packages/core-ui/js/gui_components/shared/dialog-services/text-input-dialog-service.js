import { createTextInputDialogComponent } from '../modal-text-input.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createTextInputDialogService({ documentObj = getDefaultDocumentObj(), windowObj } = {}) {
  const textInputDialog = createTextInputDialogComponent({ documentObj, windowObj });

  return {
    requestTextInput(options = {}) {
      return textInputDialog.requestTextInput(options);
    },
    destroy() {
      textInputDialog.destroy();
    },
  };
}

export { createTextInputDialogService };
