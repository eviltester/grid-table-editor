import { TimedErrorDisplay } from '../timed-error-display.js';

const GRID_ERROR_ELEMENT_ID = 'grid-column-error';
let sharedGridErrorDisplay = null;

function getGridErrorDisplay(documentObj = document) {
  if (!sharedGridErrorDisplay) {
    sharedGridErrorDisplay = new TimedErrorDisplay({
      documentObj,
      elementId: GRID_ERROR_ELEMENT_ID,
      timeoutMs: 5000,
    });
  }
  return sharedGridErrorDisplay;
}

function showGridError(message) {
  const text = String(message ?? '').trim();
  if (!text) {
    return;
  }
  getGridErrorDisplay().show(text, { severity: 'error', timeoutMs: 5000 });
}

export { GRID_ERROR_ELEMENT_ID, getGridErrorDisplay, showGridError };
