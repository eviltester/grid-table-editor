import { createTimedStatusPresenter } from '../shared/timed-error-display.js';
import { getDefaultDocumentObj } from '../shared/dom/default-objects.js';

const GRID_ERROR_ELEMENT_ID = 'grid-column-error';
const sharedGridErrorSurfacesByDocument = new WeakMap();
const missingGridErrorSurface = {
  show() {},
  clear() {},
  destroy() {},
  getState() {
    return {};
  },
};

function getGridErrorDisplay(documentObj = getDefaultDocumentObj()) {
  if (!documentObj) {
    return missingGridErrorSurface;
  }
  const existingDisplay = sharedGridErrorSurfacesByDocument.get(documentObj);
  if (existingDisplay) {
    return existingDisplay;
  }

  const root = documentObj.getElementById(GRID_ERROR_ELEMENT_ID);
  if (!root) {
    return missingGridErrorSurface;
  }

  const display = createTimedStatusPresenter({
    documentObj,
    elementId: GRID_ERROR_ELEMENT_ID,
    timeoutMs: 5000,
  });
  sharedGridErrorSurfacesByDocument.set(documentObj, display);
  return display;
}

function showGridError(message, documentObj = getDefaultDocumentObj()) {
  const text = String(message ?? '').trim();
  if (!text) {
    return;
  }
  getGridErrorDisplay(documentObj).show(text, { severity: 'error', timeoutMs: 5000 });
}

export { GRID_ERROR_ELEMENT_ID, getGridErrorDisplay, showGridError };
