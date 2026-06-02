let activeConfirmCleanup = null;

function ensureConfirmElements(documentObj = typeof document !== 'undefined' ? document : null) {
  if (!documentObj) {
    return null;
  }
  // Confirm modals are a document-level singleton overlay by design. These
  // fixed IDs are an intentional public contract for dialog services, Storybook
  // cleanup, and page-object abstractions that interact with the top-level host.
  let backdrop = documentObj.getElementById('confirm-modal-backdrop');
  if (backdrop) {
    return backdrop;
  }

  backdrop = documentObj.createElement('div');
  backdrop.id = 'confirm-modal-backdrop';
  backdrop.className = 'text-input-modal-backdrop';
  backdrop.innerHTML = `
    <div class="text-input-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <h3 id="confirm-modal-title" class="text-input-modal-title"></h3>
      <p id="confirm-modal-message" class="text-input-modal-message"></p>
      <div class="text-input-modal-actions">
        <button id="confirm-modal-ok" type="button">OK</button>
        <button id="confirm-modal-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;
  backdrop.style.display = 'none';
  documentObj.body.appendChild(backdrop);
  return backdrop;
}

function closeActiveConfirm(result) {
  if (typeof activeConfirmCleanup === 'function') {
    const cleanup = activeConfirmCleanup;
    activeConfirmCleanup = null;
    cleanup(result);
  }
}

function showConfirmModal({
  documentObj = typeof document !== 'undefined' ? document : null,
  title = 'Are you sure?',
  message = '',
  okLabel = 'OK',
  cancelLabel = 'Cancel',
} = {}) {
  closeActiveConfirm(false);
  const backdrop = ensureConfirmElements(documentObj);
  if (!backdrop) {
    return Promise.resolve(false);
  }
  const titleElem = backdrop.querySelector('#confirm-modal-title');
  const messageElem = backdrop.querySelector('#confirm-modal-message');
  const okButton = backdrop.querySelector('#confirm-modal-ok');
  const cancelButton = backdrop.querySelector('#confirm-modal-cancel');

  titleElem.textContent = String(title || 'Are you sure?');
  messageElem.textContent = String(message || '');
  okButton.textContent = String(okLabel || 'OK');
  cancelButton.textContent = String(cancelLabel || 'Cancel');
  backdrop.style.display = 'flex';

  return new Promise((resolve) => {
    const onBackdropClick = (event) => {
      if (event.target === backdrop) {
        closeActiveConfirm(false);
      }
    };
    const onCancel = () => closeActiveConfirm(false);
    const onOk = () => closeActiveConfirm(true);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeActiveConfirm(false);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        closeActiveConfirm(true);
      }
    };

    activeConfirmCleanup = (result) => {
      backdrop.removeEventListener('click', onBackdropClick);
      cancelButton.removeEventListener('click', onCancel);
      okButton.removeEventListener('click', onOk);
      documentObj.removeEventListener('keydown', onKeyDown);
      backdrop.style.display = 'none';
      resolve(result === true);
    };

    backdrop.addEventListener('click', onBackdropClick);
    cancelButton.addEventListener('click', onCancel);
    okButton.addEventListener('click', onOk);
    documentObj.addEventListener('keydown', onKeyDown);
    setTimeout(() => {
      okButton.focus();
    }, 0);
  });
}

export { showConfirmModal };
