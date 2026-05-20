/*
 * Responsibilities:
 * - Manages schema text parse -> grid sync flow.
 * - Owns timed schema error display wiring.
 * - Binds debounced schema textarea input parsing.
 */

import { TimedErrorDisplay } from '../../shared/timed-error-display.js';
import { mapParsedRulesToRows } from '../../shared/test-data/schema-editor-core.js';

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
  defnGridBridge,
  schemaTextToDataRules,
  schemaErrorsToText,
  setTestDataStatus,
  updatePairwiseButtonVisibility,
  mapRuleToRow,
  faker,
  RandExp,
}) {
  if (!defnGridBridge) {
    return;
  }

  const schemaTextArea = document.getElementById('testdatadefntext');
  const parseResult = schemaTextToDataRules({
    schemaText: schemaTextArea?.value || '',
    faker,
    RandExp,
  });
  if (parseResult.errors.length > 0) {
    const errorText = schemaErrorsToText?.(parseResult.errors) || '';
    showSchemaError(state, errorText);
    setTestDataStatus('', false);
    return;
  }

  defnGridBridge.clearRows();
  state.schemaTextTokens = Array.isArray(parseResult.schemaTokens) ? parseResult.schemaTokens : [];
  const rowsToAdd = mapParsedRulesToRows({
    dataRules: parseResult.dataRules,
    schemaTokens: state.schemaTextTokens,
    mapRuleToRow,
  });
  defnGridBridge.addRows(rowsToAdd);
  updatePairwiseButtonVisibility();
}

function bindSchemaTextareaSync({ debouncer, onPopulateRequested }) {
  const inputArea = document.getElementById('testdatadefntext');
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
  state.schemaErrorDisplay = new TimedErrorDisplay({
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
