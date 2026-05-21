/*
 * Responsibilities:
 * - Binds test-data grid panel UI controls (buttons, count input, mode radios).
 * - Binds schema sample launcher click handling.
 * - Keeps DOM event wiring out of the main grid controller.
 */

function bindPrimaryActions({ onGenerate, onGeneratePairwise, onRefreshPreview }) {
  const generateButton = document.querySelector('#generatedata');
  generateButton?.addEventListener('click', onGenerate, false);
  document.querySelector('#generateallpairs')?.addEventListener('click', onGeneratePairwise, false);
  document.querySelector('#refreshtestdatapreview')?.addEventListener('click', onRefreshPreview, false);
}

function bindGenerateCountInput() {
  const generateCountInput = document.getElementById('generateCount');
  if (!generateCountInput) {
    return;
  }
  generateCountInput.value = '1';
  generateCountInput.setAttribute('min', '1');
  generateCountInput.setAttribute('step', '1');
  generateCountInput.addEventListener('input', () => {
    const parsedCount = Number.parseInt(generateCountInput.value, 10);
    if (!Number.isFinite(parsedCount) || parsedCount < 1) {
      generateCountInput.value = '1';
    }
  });
}

function bindModeRadios({ parentElem, applyModeDefaultRowCount }) {
  parentElem.querySelectorAll('input[name="testDataGenerationMode"]').forEach((modeRadio) => {
    modeRadio.addEventListener('change', () => {
      if (!modeRadio.checked) {
        return;
      }
      applyModeDefaultRowCount(modeRadio.value);
    });
  });
}

function bindSchemaSampleShortcut({ currentHandler, onSampleRequested }) {
  if (currentHandler) {
    document.removeEventListener('click', currentHandler);
  }

  const nextHandler = (event) => {
    if (!event.target.closest('.testdata-schema-sample-button')) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onSampleRequested();
  };
  document.addEventListener('click', nextHandler);
  return nextHandler;
}

export { bindPrimaryActions, bindGenerateCountInput, bindModeRadios, bindSchemaSampleShortcut };
