import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from '../../dom/default-objects.js';
import { createMethodPickerDialog } from '../../method-picker-dialog/index.js';
import { createMethodPickerRecentStore } from '../../method-picker-dialog/method-picker-dialog-utils.js';

const STYLE_ID = 'method-picker-modal-styles-link';
const CRITICAL_STYLE_ID = 'method-picker-modal-critical-styles';
const SCROLL_LOCK_COUNT_ATTR = 'data-method-picker-scroll-lock-count';
const BODY_PREVIOUS_OVERFLOW_ATTR = 'data-method-picker-previous-body-overflow';
const ROOT_PREVIOUS_OVERFLOW_ATTR = 'data-method-picker-previous-root-overflow';

function ensureCriticalStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(CRITICAL_STYLE_ID)) {
    return;
  }
  const style = documentObj.createElement('style');
  style.id = CRITICAL_STYLE_ID;
  style.textContent = `
    .method-picker-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 6000;
      background: rgba(15, 23, 42, 0.45);
    }

    .method-picker-modal {
      width: min(1200px, 100%);
      max-height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 12px;
      background: #ffffff;
      color: #121620;
      border: 1px solid #d6dce8;
    }

    .method-picker-header,
    .method-picker-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
    }

    .method-picker-toolbar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr);
      gap: 10px;
      padding: 12px 16px;
    }

    .method-picker-content {
      display: grid;
      grid-template-columns: minmax(260px, 1.1fr) minmax(280px, 1fr);
      flex: 1;
      min-height: 0;
    }

    .method-picker-list,
    .method-picker-detail {
      min-height: 0;
      overflow: auto;
      padding: 12px;
    }

    @media (max-width: 980px) {
      .method-picker-content {
        grid-template-columns: 1fr;
      }
    }
  `;
  documentObj.head.appendChild(style);
}

function ensureStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(STYLE_ID)) {
    return;
  }
  const link = documentObj.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = new URL('./method-picker-modal.css', import.meta.url).href;
  documentObj.head.appendChild(link);
}

function restoreFocus(documentObj, previouslyFocusedElement) {
  if (
    previouslyFocusedElement &&
    previouslyFocusedElement !== documentObj.body &&
    documentObj.contains?.(previouslyFocusedElement)
  ) {
    previouslyFocusedElement.focus?.();
  }
}

function lockDocumentScroll(documentObj) {
  const body = documentObj?.body;
  const root = documentObj?.documentElement;
  if (!body?.style) {
    return () => {};
  }

  const currentLockCount = Number.parseInt(body.getAttribute(SCROLL_LOCK_COUNT_ATTR) || '0', 10) || 0;
  if (currentLockCount === 0) {
    body.setAttribute(BODY_PREVIOUS_OVERFLOW_ATTR, body.style.overflow || '');
    if (root?.style) {
      body.setAttribute(ROOT_PREVIOUS_OVERFLOW_ATTR, root.style.overflow || '');
      root.style.overflow = 'hidden';
    }
    body.style.overflow = 'hidden';
  }

  body.setAttribute(SCROLL_LOCK_COUNT_ATTR, String(currentLockCount + 1));

  return () => restoreDocumentScrollLock(documentObj);
}

function restoreDocumentScrollLock(documentObj, { force = false } = {}) {
  const body = documentObj?.body;
  const root = documentObj?.documentElement;
  if (!body?.style || !body.hasAttribute(SCROLL_LOCK_COUNT_ATTR)) {
    return;
  }

  const nextLockCount = force
    ? 0
    : Math.max(0, (Number.parseInt(body.getAttribute(SCROLL_LOCK_COUNT_ATTR) || '1', 10) || 1) - 1);
  if (nextLockCount > 0) {
    body.setAttribute(SCROLL_LOCK_COUNT_ATTR, String(nextLockCount));
    return;
  }

  body.style.overflow = body.getAttribute(BODY_PREVIOUS_OVERFLOW_ATTR) || '';
  if (root?.style) {
    root.style.overflow = body.getAttribute(ROOT_PREVIOUS_OVERFLOW_ATTR) || '';
  }
  body.removeAttribute(SCROLL_LOCK_COUNT_ATTR);
  body.removeAttribute(BODY_PREVIOUS_OVERFLOW_ATTR);
  body.removeAttribute(ROOT_PREVIOUS_OVERFLOW_ATTR);
}

function restoreMethodPickerDocumentScrollLock(documentObj = getDefaultDocumentObj()) {
  restoreDocumentScrollLock(documentObj, { force: true });
}

function openMethodPickerModal({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  options = [],
  currentCommand = '',
  initialTab = '',
  title = 'Choose Method',
} = {}) {
  if (!documentObj?.body || typeof documentObj.createElement !== 'function') {
    return Promise.resolve(null);
  }

  const resolvedWindow = resolveWindowObj(windowObj, documentObj);
  ensureCriticalStyles(documentObj);
  ensureStyles(documentObj);

  const previouslyFocusedElement = documentObj.activeElement;
  const overlay = documentObj.createElement('div');
  const restoreScrollLock = lockDocumentScroll(documentObj);
  documentObj.body.appendChild(overlay);

  return new Promise((resolve) => {
    let resolved = false;
    let component = null;

    function close(result) {
      if (resolved) {
        return;
      }
      resolved = true;
      component?.destroy?.();
      overlay.remove();
      restoreScrollLock();
      restoreFocus(documentObj, previouslyFocusedElement);
      resolve(result || null);
    }

    component = createMethodPickerDialog({
      root: overlay,
      documentObj,
      props: {
        title,
        options,
        currentCommand,
        initialTab,
      },
      services: {
        recentStore: createMethodPickerRecentStore(resolvedWindow),
      },
      callbacks: {
        onApply: (selection) => close(selection),
        onCancel: () => close(null),
      },
    });

    component.focusSearch();
  });
}

export { openMethodPickerModal, restoreMethodPickerDocumentScrollLock };
