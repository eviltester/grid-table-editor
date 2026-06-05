import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from './dom/default-objects.js';

const LEGACY_TEXT_INPUT_COMPONENTS = new WeakMap();

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
    <div class="text-input-modal" role="dialog" aria-modal="true" aria-labelledby="text-input-modal-title">
      <h3 id="text-input-modal-title" data-role="text-input-dialog-title" class="text-input-modal-title"></h3>
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
    requestTextInput({ title = 'Enter Value', initialValue = '', okLabel = 'OK', cancelLabel = 'Cancel' } = {}) {
      closeActiveModal(null);
      if (!backdrop) {
        return Promise.resolve(null);
      }

      const modal = backdrop.querySelector('.text-input-modal');
      const titleElem = backdrop.querySelector('[data-role="text-input-dialog-title"]');
      const inputElem = backdrop.querySelector('[data-role="text-input-dialog-field"]');
      const okButton = backdrop.querySelector('[data-role="text-input-dialog-ok"]');
      const cancelButton = backdrop.querySelector('[data-role="text-input-dialog-cancel"]');

      titleElem.textContent = String(title || 'Enter Value');
      inputElem.value = String(initialValue ?? '');
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

function getLegacyTextInputComponent(documentObj = getDefaultDocumentObj(), windowObj = getDefaultWindowObj()) {
  if (!documentObj) {
    return createTextInputDialogComponent({ documentObj: null, windowObj });
  }
  if (LEGACY_TEXT_INPUT_COMPONENTS.has(documentObj)) {
    return LEGACY_TEXT_INPUT_COMPONENTS.get(documentObj);
  }
  const component = createTextInputDialogComponent({ documentObj, windowObj });
  LEGACY_TEXT_INPUT_COMPONENTS.set(documentObj, component);
  return component;
}

function showTextInputModal({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  ...options
} = {}) {
  return getLegacyTextInputComponent(documentObj, windowObj).requestTextInput(options);
}

export { createTextInputDialogComponent, showTextInputModal };
