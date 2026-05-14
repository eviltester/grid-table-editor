import { TimedErrorDisplay } from '../timed-error-display.js';

const GRID_ERROR_ELEMENT_ID = 'grid-column-error';
const sharedGridErrorDisplaysByDocument = new WeakMap();

function getGridErrorDisplay(documentObj = document) {
  const existingDisplay = sharedGridErrorDisplaysByDocument.get(documentObj);
  if (existingDisplay) {
    return existingDisplay;
  }

  const display = new TimedErrorDisplay({
    documentObj,
    elementId: GRID_ERROR_ELEMENT_ID,
    timeoutMs: 5000,
  });
  sharedGridErrorDisplaysByDocument.set(documentObj, display);
  return display;
}

function showGridError(message, documentObj = document) {
  const text = String(message ?? '').trim();
  if (!text) {
    return;
  }
  getGridErrorDisplay(documentObj).show(text, { severity: 'error', timeoutMs: 5000 });
}

export { GRID_ERROR_ELEMENT_ID, getGridErrorDisplay, showGridError };
