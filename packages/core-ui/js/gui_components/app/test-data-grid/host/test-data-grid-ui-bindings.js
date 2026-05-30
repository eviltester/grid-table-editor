/*
 * Responsibilities:
 * - Binds test-data grid panel UI controls (buttons, count input, mode radios).
 * - Binds schema sample launcher click handling.
 * - Keeps DOM event wiring out of the main grid controller.
 */

import { createRowCountControl } from '../../../shared/row-count-control/index.js';

function bindPrimaryActions({ onGenerate, onGeneratePairwise, onRefreshPreview }) {
  const generateButton = document.querySelector('#generatedata');
  generateButton?.addEventListener('click', onGenerate, false);
  document.querySelector('#generateallpairs')?.addEventListener('click', onGeneratePairwise, false);
  document.querySelector('#refreshtestdatapreview')?.addEventListener('click', onRefreshPreview, false);
}

function bindGenerateCountInput({ documentObj = document } = {}) {
  const generateCountRoot = documentObj.getElementById('generateCountControl');
  if (!generateCountRoot) {
    return null;
  }

  return createRowCountControl({
    root: generateCountRoot,
    documentObj,
    props: {
      inputId: 'generateCount',
      label: 'How Many?',
      min: 1,
      step: 1,
      value: 1,
      normalizeOnInput: true,
    },
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
