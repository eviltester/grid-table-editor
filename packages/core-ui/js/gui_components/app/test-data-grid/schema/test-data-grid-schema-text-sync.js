/*
 * Responsibilities:
 * - Manages schema text parse -> grid sync flow.
 * - Owns timed schema error display wiring.
 * - Binds debounced schema textarea input parsing.
 */

import { createTimedErrorPresenter } from '../../../shared/timed-error-display.js';
import { parseSchemaTextToRows } from '../../../shared/test-data/schema/index.js';

function createSchemaTextSyncState() {
  return {
    schemaTextTokens: [],
    schemaErrorDisplay: null,
  };
}

function showSchemaError(state, message) {
  const text = String(message || '').trim();
  if (!text) {
    return;
  }
  state.schemaErrorDisplay?.show(text);
}

function populateGridFromSchemaText({
  state,
  schemaGridBridge,
  schemaTextToDataRules,
  schemaErrorsToText,
  setTestDataStatus,
  updatePairwiseButtonVisibility,
  mapRuleToRow,
  faker,
  RandExp,
}) {
  if (!schemaGridBridge) {
    return;
  }

  const schemaTextArea = document.getElementById('testDataSchemaText');
  const parseResult = parseSchemaTextToRows({
    schemaTextToDataRules,
    schemaText: schemaTextArea?.value || '',
    faker,
    RandExp,
    mapRuleToRow,
  });
  if (parseResult.errors.length > 0) {
    const errorText = schemaErrorsToText?.(parseResult.errors) || '';
    showSchemaError(state, errorText);
    setTestDataStatus('', false);
    return;
  }

  state.schemaErrorDisplay?.clear?.();
  schemaGridBridge.clearRows();
  state.schemaTextTokens = Array.isArray(parseResult.tokens) ? parseResult.tokens : [];
  schemaGridBridge.addRows(parseResult.rows);
  updatePairwiseButtonVisibility();
}

function bindSchemaTextareaSync({ debouncer, onPopulateRequested }) {
  const inputArea = document.getElementById('testDataSchemaText');
  if (!inputArea) {
    return;
  }
  inputArea.addEventListener(
    'input',
    () => {
      debouncer.debounce('populateTestDataGrid', onPopulateRequested, 1000);
    },
    false
  );
}

function initializeSchemaErrorDisplay(state) {
  state.schemaErrorDisplay = createTimedErrorPresenter({
    documentObj: document,
    elementId: 'testdata-schema-error',
    timeoutMs: 5000,
  });
}

export {
  createSchemaTextSyncState,
  showSchemaError,
  populateGridFromSchemaText,
  bindSchemaTextareaSync,
  initializeSchemaErrorDisplay,
};
