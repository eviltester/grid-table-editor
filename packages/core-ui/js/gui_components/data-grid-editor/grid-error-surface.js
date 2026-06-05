import { createTimedStatusPresenter } from '../shared/timed-error-display.js';
import { getDefaultDocumentObj } from '../shared/dom/default-objects.js';

const GRID_ERROR_ELEMENT_ID = 'grid-column-error';
const sharedGridErrorSurfacesByDocument = new WeakMap();
const sharedGridErrorSurfacesByResolver = new WeakMap();
const missingGridErrorSurface = {
  show() {},
  clear() {},
  destroy() {},
  getState() {
    return {};
  },
};

function normalizeGridErrorSurfaceOptions(optionsOrDocument = getDefaultDocumentObj()) {
  if (
    !optionsOrDocument ||
    typeof optionsOrDocument.getElementById === 'function' ||
    typeof optionsOrDocument.createElement === 'function'
  ) {
    return {
      documentObj: optionsOrDocument || null,
      elementId: GRID_ERROR_ELEMENT_ID,
      resolveElement: null,
    };
  }

  return {
    documentObj: optionsOrDocument.documentObj || getDefaultDocumentObj(),
    elementId: optionsOrDocument.elementId || GRID_ERROR_ELEMENT_ID,
    resolveElement: typeof optionsOrDocument.resolveElement === 'function' ? optionsOrDocument.resolveElement : null,
  };
}

function getGridErrorDisplay(optionsOrDocument = getDefaultDocumentObj()) {
  const { documentObj, elementId, resolveElement } = normalizeGridErrorSurfaceOptions(optionsOrDocument);
  if (!documentObj) {
    return missingGridErrorSurface;
  }

  if (resolveElement) {
    const existingScopedDisplay = sharedGridErrorSurfacesByResolver.get(resolveElement);
    if (existingScopedDisplay) {
      return existingScopedDisplay;
    }

    const root = resolveElement();
    if (!root) {
      return missingGridErrorSurface;
    }

    const display = createTimedStatusPresenter({
      documentObj,
      elementId,
      resolveElement,
      timeoutMs: 5000,
    });
    sharedGridErrorSurfacesByResolver.set(resolveElement, display);
    return display;
  }

  const existingDisplay = sharedGridErrorSurfacesByDocument.get(documentObj);
  if (existingDisplay) {
    return existingDisplay;
  }

  const root = documentObj.getElementById(elementId);
  if (!root) {
    return missingGridErrorSurface;
  }

  const display = createTimedStatusPresenter({
    documentObj,
    elementId,
    timeoutMs: 5000,
  });
  sharedGridErrorSurfacesByDocument.set(documentObj, display);
  return display;
}

function showGridError(message, optionsOrDocument = getDefaultDocumentObj()) {
  const text = String(message ?? '').trim();
  if (!text) {
    return;
  }
  getGridErrorDisplay(optionsOrDocument).show(text, { severity: 'error', timeoutMs: 5000 });
}

export { GRID_ERROR_ELEMENT_ID, getGridErrorDisplay, showGridError };
