import { showConfirmModal } from '../modal-confirm.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createConfirmDialogService({ documentObj = getDefaultDocumentObj() } = {}) {
  return {
    requestConfirm(options = {}) {
      return showConfirmModal({
        documentObj,
        ...options,
      });
    },
  };
}

export { createConfirmDialogService };
