import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import RandExp from 'randexp';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createTestDataGridControl } from '../../../../js/gui_components/app/test-data-grid/index.js';
import { assertDataTableHasNoErrorIndicators, assertNoErrorIndicators } from './generated-value-quality.js';
import { installDomGlobals, cleanupDomGlobals } from './testing-library-dom-setup.js';

class ImmediateDebouncer {
  debounce(_name, callback) {
    callback();
  }

  clear() {}
}

function createFocusedAppTestDataHarness() {
  const dom = installDomGlobals(
    '<!doctype html><html><body><div id="host"></div><pre id="testDataPreviewCapture"></pre></body></html>'
  );
  const user = userEvent.setup({ document: dom.window.document });
  global.RandExp = RandExp;

  let latestDataTable = null;
  let control = null;
  let selectedSchemaRowIndex = 0;
  const mainGridState = {
    rowCount: 0,
    selectedRowIndexes: [],
  };

  async function setInputValue(element, value) {
    if (!element) {
      throw new Error('Target input element was not found in focused app test-data harness');
    }
    await user.click(element);
    await user.clear(element);
    if (value) {
      if (element.type === 'number' || /[\n\\[\]{}]/.test(value)) {
        element.value = value;
        fireEvent.input(element, { target: { value } });
        fireEvent.change(element, { target: { value } });
      } else {
        await user.type(element, value);
      }
    }
    element.blur();
  }

  function reset() {
    document.getElementById('host').innerHTML = '';
    document.getElementById('testDataPreviewCapture').textContent = '';
    latestDataTable = null;
    selectedSchemaRowIndex = 0;

    const exporter = new Exporter({
      getGridAsGenericDataTable: () => latestDataTable,
      getHeadersFromGrid: () => latestDataTable?.getHeaders?.() || [],
    });

    const importer = {
      setGridFromGenericDataTable(dataTable) {
        latestDataTable = dataTable;
        return Promise.resolve();
      },
      gridExtensions: {
        getGridAsGenericDataTable: () => latestDataTable,
        getHeadersFromGrid: () => latestDataTable?.getHeaders?.() || [],
      },
    };

    const textPreviewRenderer = {
      async renderTextFromGrid() {
        const text = latestDataTable ? exporter.getDataTableAs('csv', latestDataTable) : '';
        document.getElementById('testDataPreviewCapture').textContent = text;
        return text;
      },
    };

    const gridExtras = {
      getRowCount: () => mainGridState.rowCount,
      getSelectedRowIndexes: () => mainGridState.selectedRowIndexes.slice(),
      getGridAsGenericDataTable: () => latestDataTable,
    };

    control = createTestDataGridControl({
      documentObj: document,
      windowObj: window,
      DebouncerClass: ImmediateDebouncer,
    });

    control.enableTestDataGenerationInterface('host', importer, textPreviewRenderer, gridExtras);
  }

  function getGridRow(index = 0) {
    return document.querySelectorAll('#testDataSchemaRows .generator-schema-row')[index];
  }

  async function addColumn() {
    await user.click(document.getElementById('testDataAddSchemaRowButton'));
    await waitFor(() => {
      if (document.querySelectorAll('#testDataSchemaRows .generator-schema-row').length > 0) {
        return;
      }
      throw new Error('Schema row was not rendered');
    });
  }

  async function selectGridRow(index) {
    selectedSchemaRowIndex = index;
    await user.click(getGridRow(index));
  }

  async function deleteSelectedColumns() {
    const row = getGridRow(selectedSchemaRowIndex);
    await user.click(row.querySelector('[data-action="remove"]'));
  }

  async function fillGridRow(index, row) {
    let rowElem = getGridRow(index);
    await setInputValue(rowElem.querySelector('[data-field="name"]'), row.name || '');
    await user.selectOptions(rowElem.querySelector('[data-field="sourceType"]'), row.sourceType || 'regex');
    rowElem = getGridRow(index);

    if (row.sourceType === 'faker' || row.sourceType === 'domain') {
      if (row.command) {
        const commandSelect = rowElem.querySelector('[data-field="command"]');
        if (commandSelect) {
          await user.selectOptions(commandSelect, row.command);
        }
      }
      await setInputValue(getGridRow(index).querySelector('[data-field="params"]'), row.params || '');
      return;
    }

    await setInputValue(getGridRow(index).querySelector('[data-field="value"]'), row.value || '');
  }

  async function setSchemaText(value) {
    await setInputValue(document.getElementById('testDataSchemaText'), value);
  }

  async function clickGenerate({ waitForData = true } = {}) {
    await user.click(within(document.body).getByRole('button', { name: /^generate$/i }));
    if (waitForData) {
      await waitFor(() => expect(latestDataTable).toBeTruthy());
    }
  }

  async function clickRefreshPreview() {
    await user.click(within(document.body).getByRole('button', { name: /refresh text preview/i }));
    await waitFor(() =>
      expect(document.getElementById('testDataPreviewCapture').textContent.length).toBeGreaterThan(0)
    );
  }

  async function clickGeneratePairwise() {
    await user.click(within(document.body).getByRole('button', { name: /generate pairwise/i }));
    await waitFor(() => expect(latestDataTable).toBeTruthy());
  }

  async function setGenerateCount(value) {
    await setInputValue(document.getElementById('generateCount'), String(value));
  }

  async function selectMode(value) {
    await user.click(document.querySelector(`input[name="testDataGenerationMode"][value="${value}"]`));
  }

  async function clickInjectedSampleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'testdata-schema-sample-button';
    button.textContent = 'Load Sample Schema';
    document.body.appendChild(button);
    await user.click(button);
    button.remove();
  }

  function setMainGridState({ rowCount, selectedRowIndexes }) {
    if (Number.isFinite(rowCount)) {
      mainGridState.rowCount = rowCount;
    }
    if (Array.isArray(selectedRowIndexes)) {
      mainGridState.selectedRowIndexes = selectedRowIndexes.slice();
    }
  }

  function getSchemaText() {
    return document.getElementById('testDataSchemaText').value;
  }

  function getSchemaErrorText() {
    return document.getElementById('testdata-schema-error').textContent.trim();
  }

  function getGenerateCount() {
    return document.getElementById('generateCount').value;
  }

  function getPairwiseButton() {
    return document.getElementById('generateallpairs');
  }

  function getPreviewText() {
    return document.getElementById('testDataPreviewCapture').textContent;
  }

  function getLatestDataTable() {
    return latestDataTable;
  }

  function assertSuccessfulGeneration(label = 'app generation') {
    expect(latestDataTable).toBeTruthy();
    expect(latestDataTable.getRowCount()).toBeGreaterThan(0);
    assertDataTableHasNoErrorIndicators(latestDataTable, label);
  }

  function assertSuccessfulPreview(label = 'app preview') {
    expect(getPreviewText().length).toBeGreaterThan(0);
    assertNoErrorIndicators(getPreviewText(), label);
  }

  return {
    reset,
    cleanup: () => cleanupDomGlobals(dom),
    control: () => control,
    addColumn,
    selectGridRow,
    deleteSelectedColumns,
    fillGridRow,
    setSchemaText,
    clickGenerate,
    clickRefreshPreview,
    clickGeneratePairwise,
    setGenerateCount,
    selectMode,
    clickInjectedSampleButton,
    setMainGridState,
    getGridRow,
    getSchemaText,
    getSchemaErrorText,
    getGenerateCount,
    getPairwiseButton,
    getPreviewText,
    getLatestDataTable,
    assertSuccessfulGeneration,
    assertSuccessfulPreview,
  };
}

export { createFocusedAppTestDataHarness };
