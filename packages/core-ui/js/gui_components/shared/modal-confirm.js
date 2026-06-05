import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from './dom/default-objects.js';

const LEGACY_CONFIRM_COMPONENTS = new WeakMap();

function ensureConfirmElements(documentObj = getDefaultDocumentObj()) {
  if (!documentObj) {
    return null;
  }
  // Confirm modals are a document-level singleton overlay by design. These
  // fixed IDs are an intentional public contract for dialog services, Storybook
  // cleanup, and page-object abstractions that interact with the top-level host.
  let backdrop = documentObj.getElementById('confirm-modal-backdrop');
  if (backdrop) {
    return { backdrop, owned: false };
  }

  backdrop = documentObj.createElement('div');
  backdrop.id = 'confirm-modal-backdrop';
  backdrop.className = 'text-input-modal-backdrop';
  backdrop.innerHTML = `
    <div class="text-input-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <h3 id="confirm-modal-title" data-role="confirm-dialog-title" class="text-input-modal-title"></h3>
      <p id="confirm-modal-message" data-role="confirm-dialog-message" class="text-input-modal-message"></p>
      <div class="text-input-modal-actions">
        <button id="confirm-modal-ok" data-role="confirm-dialog-ok" type="button">OK</button>
        <button id="confirm-modal-cancel" data-role="confirm-dialog-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;
  backdrop.style.display = 'none';
  documentObj.body.appendChild(backdrop);
  return { backdrop, owned: true };
}

function createConfirmDialogComponent({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
} = {}) {
  const ensured = ensureConfirmElements(documentObj);
  const backdrop = ensured?.backdrop || null;
  const owned = ensured?.owned === true;
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
  let activeCleanup = null;

  const closeActiveConfirm = (result) => {
    if (typeof activeCleanup === 'function') {
      const cleanup = activeCleanup;
      activeCleanup = null;
      cleanup(result);
    }
  };

  return {
    requestConfirm({ title = 'Are you sure?', message = '', okLabel = 'OK', cancelLabel = 'Cancel' } = {}) {
      closeActiveConfirm(false);
      if (!backdrop) {
        return Promise.resolve(false);
      }

      const titleElem = backdrop.querySelector('[data-role="confirm-dialog-title"]');
      const messageElem = backdrop.querySelector('[data-role="confirm-dialog-message"]');
      const okButton = backdrop.querySelector('[data-role="confirm-dialog-ok"]');
      const cancelButton = backdrop.querySelector('[data-role="confirm-dialog-cancel"]');

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

        activeCleanup = (result) => {
          backdrop.removeEventListener('click', onBackdropClick);
          cancelButton.removeEventListener('click', onCancel);
          okButton.removeEventListener('click', onOk);
          documentObj?.removeEventListener('keydown', onKeyDown);
          backdrop.style.display = 'none';
          resolve(result === true);
        };

        backdrop.addEventListener('click', onBackdropClick);
        cancelButton.addEventListener('click', onCancel);
        okButton.addEventListener('click', onOk);
        documentObj?.addEventListener('keydown', onKeyDown);
        const scheduleFocus = resolvedWindowObj?.setTimeout?.bind(resolvedWindowObj) || globalThis.setTimeout;
        scheduleFocus(() => {
          okButton.focus();
        }, 0);
      });
    },

    destroy() {
      closeActiveConfirm(false);
      if (owned && backdrop?.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    },
  };
}

function getLegacyConfirmComponent(documentObj = getDefaultDocumentObj(), windowObj = getDefaultWindowObj()) {
  if (!documentObj) {
    return createConfirmDialogComponent({ documentObj: null, windowObj });
  }
  if (LEGACY_CONFIRM_COMPONENTS.has(documentObj)) {
    return LEGACY_CONFIRM_COMPONENTS.get(documentObj);
  }
  const component = createConfirmDialogComponent({ documentObj, windowObj });
  LEGACY_CONFIRM_COMPONENTS.set(documentObj, component);
  return component;
}

function showConfirmModal({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  ...options
} = {}) {
  return getLegacyConfirmComponent(documentObj, windowObj).requestConfirm(options);
}

export { createConfirmDialogComponent, showConfirmModal };
