let activeModalCleanup = null;

function ensureModalElements(documentObj = typeof document !== 'undefined' ? document : null) {
  if (!documentObj) {
    return null;
  }
  let backdrop = documentObj.getElementById('text-input-modal-backdrop');
  if (backdrop) {
    return backdrop;
  }

  backdrop = documentObj.createElement('div');
  backdrop.id = 'text-input-modal-backdrop';
  backdrop.className = 'text-input-modal-backdrop';
  backdrop.innerHTML = `
    <div class="text-input-modal" role="dialog" aria-modal="true" aria-labelledby="text-input-modal-title">
      <h3 id="text-input-modal-title" class="text-input-modal-title"></h3>
      <input id="text-input-modal-field" type="text" class="text-input-modal-field" />
      <div class="text-input-modal-actions">
        <button id="text-input-modal-ok" type="button">OK</button>
        <button id="text-input-modal-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;
  backdrop.style.display = 'none';
  documentObj.body.appendChild(backdrop);
  return backdrop;
}

function closeActiveModal(result) {
  if (typeof activeModalCleanup === 'function') {
    const cleanup = activeModalCleanup;
    activeModalCleanup = null;
    cleanup(result);
  }
}

function showTextInputModal({
  documentObj = typeof document !== 'undefined' ? document : null,
  title = 'Enter Value',
  initialValue = '',
  okLabel = 'OK',
  cancelLabel = 'Cancel',
} = {}) {
  closeActiveModal(null);
  const backdrop = ensureModalElements(documentObj);
  if (!backdrop) {
    return Promise.resolve(null);
  }
  const modal = backdrop.querySelector('.text-input-modal');
  const titleElem = backdrop.querySelector('#text-input-modal-title');
  const inputElem = backdrop.querySelector('#text-input-modal-field');
  const okButton = backdrop.querySelector('#text-input-modal-ok');
  const cancelButton = backdrop.querySelector('#text-input-modal-cancel');

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

    activeModalCleanup = (result) => {
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
    const scheduleFocus =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : (callback) => setTimeout(callback, 0);
    scheduleFocus(() => {
      inputElem.focus();
      inputElem.select();
    });
    modal?.setAttribute('aria-describedby', 'text-input-modal-field');
  });
}

export { showTextInputModal };
