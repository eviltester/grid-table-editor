import { SHARED_SCHEMA_ROW_SELECTOR } from './shared-schema-editor-ui.js';

function captureActiveFieldState(documentObj) {
  const activeElement = documentObj?.activeElement;
  const fieldName = activeElement?.getAttribute?.('data-field');
  const rowId = activeElement?.closest?.(SHARED_SCHEMA_ROW_SELECTOR)?.getAttribute?.('data-row-id');
  if (!rowId || !fieldName) {
    return null;
  }
  return {
    rowId,
    fieldName,
    selectionStart: typeof activeElement.selectionStart === 'number' ? activeElement.selectionStart : null,
    selectionEnd: typeof activeElement.selectionEnd === 'number' ? activeElement.selectionEnd : null,
    selectionDirection:
      typeof activeElement.selectionDirection === 'string' ? activeElement.selectionDirection : 'none',
  };
}

function restoreActiveFieldState(documentObj, state) {
  if (!state?.rowId || !state?.fieldName) {
    return;
  }
  const nextField = documentObj?.querySelector?.(
    `.shared-schema-row[data-row-id="${state.rowId}"] [data-field="${state.fieldName}"]`
  );
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
