/*
 * Responsibilities:
 * - Shared app-page helpers for resolving test-data generation mode and default row counts.
 * - Keeps DOM count/mode behavior unit-testable outside the main test-data panel controller.
 */

function getGenerationMode({ documentObj, defaultMode }) {
  const selectedOption = documentObj?.querySelector('input[name="testDataGenerationMode"]:checked');
  if (!selectedOption) {
    return defaultMode;
  }
  return selectedOption.value;
}

function setGenerateCountToCurrentRows({ documentObj, gridExtras }) {
  if (!gridExtras) {
    return;
  }
  const input = documentObj?.getElementById('generateCount');
  if (!input) {
    return;
  }
  input.value = gridExtras.getRowCount();
}

function setGenerateCountToSelectedRows({ documentObj, gridExtras }) {
  if (!gridExtras) {
    return;
  }
  const input = documentObj?.getElementById('generateCount');
  if (!input) {
    return;
  }
  input.value = gridExtras.getSelectedRowIndexes().length;
}

function applyModeDefaultRowCount({ mode, documentObj, gridExtras, amendTableMode, amendSelectedMode }) {
  if (mode === amendTableMode) {
    setGenerateCountToCurrentRows({ documentObj, gridExtras });
    return;
  }
  if (mode === amendSelectedMode) {
    setGenerateCountToSelectedRows({ documentObj, gridExtras });
  }
}

export { getGenerationMode, setGenerateCountToCurrentRows, setGenerateCountToSelectedRows, applyModeDefaultRowCount };
