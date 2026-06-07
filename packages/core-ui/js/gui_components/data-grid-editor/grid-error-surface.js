import { createTimedStatusPresenter } from '../shared/timed-error-display.js';

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

function normalizeGridErrorSurfaceOptions(options = {}) {
  return {
    documentObj: options.documentObj || null,
    elementId: options.elementId || GRID_ERROR_ELEMENT_ID,
    resolveElement: typeof options.resolveElement === 'function' ? options.resolveElement : null,
  };
}

function getGridErrorDisplay(options = {}) {
  const { documentObj, elementId, resolveElement } = normalizeGridErrorSurfaceOptions(options);
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
    resolveElement: () => documentObj.getElementById(elementId),
    timeoutMs: 5000,
  });
  sharedGridErrorSurfacesByDocument.set(documentObj, display);
  return display;
}

function showGridError(message, options = {}) {
  const text = String(message ?? '').trim();
  if (!text) {
    return;
  }
  getGridErrorDisplay(options).show(text, { severity: 'error', timeoutMs: 5000 });
}

export { GRID_ERROR_ELEMENT_ID, getGridErrorDisplay, showGridError };
