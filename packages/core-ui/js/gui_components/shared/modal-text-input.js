import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from './dom/default-objects.js';

function ensureModalElements(documentObj = getDefaultDocumentObj()) {
  if (!documentObj) {
    return null;
  }
  // Text-input modals are a document-level singleton overlay by design. These
  // fixed IDs are an intentional public contract for dialog services, Storybook
  // cleanup, and page-object abstractions that interact with the top-level host.
  let backdrop = documentObj.getElementById('text-input-modal-backdrop');
  if (backdrop) {
    return { backdrop, owned: false };
  }

  backdrop = documentObj.createElement('div');
  backdrop.id = 'text-input-modal-backdrop';
  backdrop.className = 'text-input-modal-backdrop';
  backdrop.innerHTML = `
    <div class="text-input-modal" data-role="text-input-dialog" role="dialog" aria-modal="true" aria-labelledby="text-input-modal-title">
      <h3 id="text-input-modal-title" data-role="text-input-dialog-title" class="text-input-modal-title"></h3>
      <p data-role="text-input-dialog-message" class="text-input-modal-message"></p>
      <label for="text-input-modal-field" data-role="text-input-dialog-label" class="text-input-modal-label"></label>
      <input id="text-input-modal-field" data-role="text-input-dialog-field" type="text" class="text-input-modal-field" />
      <div class="text-input-modal-actions">
        <button id="text-input-modal-ok" data-role="text-input-dialog-ok" type="button">OK</button>
        <button id="text-input-modal-cancel" data-role="text-input-dialog-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;
  backdrop.style.display = 'none';
  documentObj.body.appendChild(backdrop);
  return { backdrop, owned: true };
}

function createTextInputDialogComponent({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
} = {}) {
  const ensured = ensureModalElements(documentObj);
  const backdrop = ensured?.backdrop || null;
  const owned = ensured?.owned === true;
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
  let activeCleanup = null;

  const closeActiveModal = (result) => {
    if (typeof activeCleanup === 'function') {
      const cleanup = activeCleanup;
      activeCleanup = null;
      cleanup(result);
    }
  };

  return {
    requestTextInput({
      title = 'Enter Value',
      message = '',
      label = '',
      initialValue = '',
      okLabel = 'OK',
      cancelLabel = 'Cancel',
      inputType = 'text',
      min,
      max,
      step,
    } = {}) {
      closeActiveModal(null);
      if (!backdrop) {
        return Promise.resolve(null);
      }

      const modal = backdrop.querySelector('[data-role="text-input-dialog"]');
      const titleElem = backdrop.querySelector('[data-role="text-input-dialog-title"]');
      const messageElem = backdrop.querySelector('[data-role="text-input-dialog-message"]');
      const labelElem = backdrop.querySelector('[data-role="text-input-dialog-label"]');
      const inputElem = backdrop.querySelector('[data-role="text-input-dialog-field"]');
      const okButton = backdrop.querySelector('[data-role="text-input-dialog-ok"]');
      const cancelButton = backdrop.querySelector('[data-role="text-input-dialog-cancel"]');

      titleElem.textContent = String(title ?? 'Enter Value');
      const messageText = String(message ?? '');
      messageElem.textContent = messageText;
      messageElem.hidden = messageText.length === 0;
      const labelText = String(label ?? '');
      labelElem.textContent = labelText;
      labelElem.hidden = labelText.length === 0;
      inputElem.value = String(initialValue ?? '');
      inputElem.type = String(inputType || 'text');
      if (min === undefined || min === null || min === '') {
        inputElem.removeAttribute('min');
      } else {
        inputElem.setAttribute('min', String(min));
      }
      if (max === undefined || max === null || max === '') {
        inputElem.removeAttribute('max');
      } else {
        inputElem.setAttribute('max', String(max));
      }
      if (step === undefined || step === null || step === '') {
        inputElem.removeAttribute('step');
      } else {
        inputElem.setAttribute('step', String(step));
      }
      okButton.textContent = String(okLabel || 'OK');
      cancelButton.textContent = String(cancelLabel || 'Cancel');
      backdrop.style.display = 'flex';

      return new Promise((resolve) => {
        const onBackdropClick = (event) => {
          if (event.target === backdrop) {
            closeActiveModal(null);
          }
        };
        const onCancel = () => closeActiveModal(null);
        const onOk = () => closeActiveModal(inputElem.value);
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeActiveModal(null);
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            closeActiveModal(inputElem.value);
          }
        };

        activeCleanup = (result) => {
          backdrop.removeEventListener('click', onBackdropClick);
          cancelButton.removeEventListener('click', onCancel);
          okButton.removeEventListener('click', onOk);
          inputElem.removeEventListener('keydown', onKeyDown);
          backdrop.style.display = 'none';
          resolve(result);
        };

        backdrop.addEventListener('click', onBackdropClick);
        cancelButton.addEventListener('click', onCancel);
        okButton.addEventListener('click', onOk);
        inputElem.addEventListener('keydown', onKeyDown);
        const requestAnimationFrameFn = resolvedWindowObj?.requestAnimationFrame?.bind(resolvedWindowObj);
        const setTimeoutFn = resolvedWindowObj?.setTimeout?.bind(resolvedWindowObj) || globalThis.setTimeout;
        const scheduleFocus =
          typeof requestAnimationFrameFn === 'function'
            ? requestAnimationFrameFn
            : (callback) => setTimeoutFn(callback, 0);
        scheduleFocus(() => {
          inputElem.focus();
          inputElem.select();
        });
        modal?.setAttribute('aria-describedby', 'text-input-modal-field');
      });
    },

    destroy() {
      closeActiveModal(null);
      if (owned && backdrop?.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    },
  };
}

export { createTextInputDialogComponent };
