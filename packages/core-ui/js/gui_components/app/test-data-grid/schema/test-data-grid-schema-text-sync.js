/*
 * Responsibilities:
 * - Manages schema text parse -> grid sync flow.
 * - Owns timed schema error display wiring.
 * - Binds debounced schema textarea input parsing.
 */

import { createTimedStatusPresenter } from '../../../shared/timed-error-display.js';
import { parseSchemaTextToRows } from '../../../shared/test-data/schema/schema-controller.js';
import { getDefaultDocumentObj } from '../../../shared/dom/default-objects.js';

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

function resolveSchemaTextElement({ getSchemaTextElement, documentObj }) {
  if (typeof getSchemaTextElement === 'function') {
    return getSchemaTextElement() || null;
  }
  return documentObj?.querySelector?.('[data-role="schema-textbox"]') || null;
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
  documentObj = getDefaultDocumentObj(),
  getSchemaTextValue,
  getSchemaTextElement,
}) {
  if (!schemaGridBridge) {
    return;
  }

  const schemaTextArea = resolveSchemaTextElement({ getSchemaTextElement, documentObj });
  const schemaText =
    typeof getSchemaTextValue === 'function' ? String(getSchemaTextValue() || '') : schemaTextArea?.value || '';
  const parseResult = parseSchemaTextToRows({
    schemaTextToDataRules,
    schemaText,
    faker,
    RandExp,
    mapRuleToRow,
  });
  if (parseResult.errors.length > 0) {
    const errorText = schemaErrorsToText?.(parseResult.errors) || '';
    showSchemaError(state, errorText);
    setTestDataStatus('');
    return;
  }

  state.schemaErrorDisplay?.clear?.();
  schemaGridBridge.clearRows();
  state.schemaTextTokens = Array.isArray(parseResult.tokens) ? parseResult.tokens : [];
  schemaGridBridge.addRows(parseResult.rows);
  updatePairwiseButtonVisibility();
}

function bindSchemaTextareaSync({
  debouncer,
  onPopulateRequested,
  documentObj = getDefaultDocumentObj(),
  getSchemaTextElement,
}) {
  const inputArea = resolveSchemaTextElement({ getSchemaTextElement, documentObj });
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

function initializeSchemaErrorDisplay(state, { documentObj = getDefaultDocumentObj(), getSchemaErrorElement } = {}) {
  state.schemaErrorDisplay = createTimedStatusPresenter({
    documentObj,
    resolveElement: () => getSchemaErrorElement?.() || null,
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
