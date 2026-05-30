import { showTextInputModal } from '../modal-text-input.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createTextInputDialogService({ documentObj = getDefaultDocumentObj() } = {}) {
  return {
    requestTextInput(options = {}) {
      return showTextInputModal({
        documentObj,
        ...options,
      });
    },
  };
}

export { createTextInputDialogService };
