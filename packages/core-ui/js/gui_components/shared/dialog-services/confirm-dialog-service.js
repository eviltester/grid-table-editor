import { createConfirmDialogComponent } from '../modal-confirm.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createConfirmDialogService({ documentObj = getDefaultDocumentObj(), windowObj } = {}) {
  const confirmDialog = createConfirmDialogComponent({ documentObj, windowObj });

  return {
    requestConfirm(options = {}) {
      return confirmDialog.requestConfirm(options);
    },
    destroy() {
      confirmDialog.destroy();
    },
  };
}

export { createConfirmDialogService };
