import { SHARED_SCHEMA_ROW_SELECTOR } from './shared-schema-editor-ui.js';

function captureActiveFieldState(documentObj) {
  const activeElement = documentObj?.activeElement;
  const fieldName = activeElement?.getAttribute?.('data-field');
  const actionName = activeElement?.getAttribute?.('data-action');
  const rowId = activeElement?.closest?.(SHARED_SCHEMA_ROW_SELECTOR)?.getAttribute?.('data-row-id');
  if (!rowId || (!fieldName && actionName !== 'pick-command')) {
    return null;
  }
  return {
    rowId,
    fieldName,
    actionName: fieldName ? null : actionName,
    selectionStart: typeof activeElement.selectionStart === 'number' ? activeElement.selectionStart : null,
    selectionEnd: typeof activeElement.selectionEnd === 'number' ? activeElement.selectionEnd : null,
    selectionDirection:
      typeof activeElement.selectionDirection === 'string' ? activeElement.selectionDirection : 'none',
  };
}

function restoreActiveFieldState(documentObj, state) {
  if (!state?.rowId || (!state?.fieldName && !state?.actionName)) {
    return;
  }
  const targetSelector = state.fieldName ? `[data-field="${state.fieldName}"]` : `[data-action="${state.actionName}"]`;
  const nextField = documentObj?.querySelector?.(`.shared-schema-row[data-row-id="${state.rowId}"] ${targetSelector}`);
  if (!nextField) {
    return;
  }
  try {
    nextField.focus({ preventScroll: true });
  } catch {
    nextField.focus?.();
  }
  if (
    typeof nextField.setSelectionRange === 'function' &&
    state.selectionStart !== null &&
    state.selectionEnd !== null
  ) {
    nextField.setSelectionRange(state.selectionStart, state.selectionEnd, state.selectionDirection || 'none');
  }
}

export { captureActiveFieldState, restoreActiveFieldState };
