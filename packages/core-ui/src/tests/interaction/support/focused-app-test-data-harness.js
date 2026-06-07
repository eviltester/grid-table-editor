import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import RandExp from 'randexp';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createTestDataGenerationPanelManager } from '../../../../js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js';
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
  const previewState = {
    mode: 'preview',
    autoPreviewEnabled: true,
  };
  const mainGridState = {
    rowCount: 0,
    selectedRowIndexes: [],
  };

  function getPanelRoot() {
    return document.querySelector('[data-role="data-population-panel-root"]');
  }

  function getPanelQueries() {
    return within(getPanelRoot());
  }

  function getSchemaDefinitionRoot() {
    return getPanelRoot()?.querySelector('[data-role="schema-definition-root"]') || null;
  }

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

  async function setSelectValue(element, value) {
    if (!element) {
      throw new Error('Target select element was not found in focused app test-data harness');
    }
    element.focus();
    element.value = value;
    fireEvent.input(element, { target: { value } });
    fireEvent.change(element, { target: { value } });
    element.blur();
  }

  function reset() {
    document.getElementById('host').innerHTML = '';
    document.getElementById('testDataPreviewCapture').textContent = '';
    latestDataTable = null;
    selectedSchemaRowIndex = 0;
    previewState.mode = 'preview';
    previewState.autoPreviewEnabled = true;

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
      getState() {
        return { ...previewState };
      },
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

    control = createTestDataGenerationPanelManager({
      documentObj: document,
      windowObj: window,
      DebouncerClass: ImmediateDebouncer,
    });

    control.mountTestDataGenerationPanel('host', importer, textPreviewRenderer, gridExtras);
  }

  function getGridRow(index = 0) {
    return document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row')[index];
  }

  async function addColumn() {
    const previousCount = document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row').length;
    await user.click(document.querySelector('[data-role="schema-add-field"]'));
    await waitFor(() => {
      if (document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row').length > previousCount) {
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
    rowElem = getGridRow(index);
    await setSelectValue(rowElem.querySelector('[data-field="sourceType"]'), row.sourceType || 'regex');
    await waitFor(() => {
      rowElem = getGridRow(index);
      const expectsCommandFields = row.sourceType === 'faker' || row.sourceType === 'domain';
      const targetField = expectsCommandFields ? '[data-field="params"]' : '[data-field="value"]';
      if (rowElem?.querySelector(targetField)) {
        return;
      }
      throw new Error('Schema row did not render the expected editor field');
    });

    if (row.sourceType === 'faker' || row.sourceType === 'domain') {
      if (row.command) {
        const commandSelect = rowElem.querySelector('[data-field="command"]');
        if (commandSelect) {
          await setSelectValue(commandSelect, row.command);
        }
      }
      await setInputValue(getGridRow(index).querySelector('[data-field="params"]'), row.params || '');
      return;
    }

    await setInputValue(getGridRow(index).querySelector('[data-field="value"]'), row.value || '');
  }

  async function setSchemaText(value) {
    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    if (toggleButton?.textContent?.trim() === 'Edit as Text') {
      await user.click(toggleButton);
    }
    await setInputValue(document.querySelector('[data-role="schema-textbox"]'), value);
    if (toggleButton?.textContent?.trim() === 'Edit as Schema') {
      await user.click(toggleButton);
    }
  }

  async function clickGenerate({ waitForData = true } = {}) {
    await user.click(within(document.body).getByRole('button', { name: /^generate$/i }));
    if (waitForData) {
      await waitFor(() => expect(latestDataTable).toBeTruthy());
      await waitFor(() =>
        expect(document.getElementById('testDataPreviewCapture').textContent.length).toBeGreaterThan(0)
      );
    }
  }

  async function clickGeneratePairwise() {
    await user.click(within(document.body).getByRole('button', { name: /generate pairwise/i }));
    await waitFor(() => expect(latestDataTable).toBeTruthy());
    await waitFor(() =>
      expect(document.getElementById('testDataPreviewCapture').textContent.length).toBeGreaterThan(0)
    );
  }

  async function setGenerateCount(value) {
    await setInputValue(getPanelQueries().getByRole('spinbutton', { name: 'How Many?' }), String(value));
  }

  async function selectMode(value) {
    await user.click(document.querySelector(`input[name="testDataGenerationMode"][value="${value}"]`));
  }

  async function clickInjectedSampleButton() {
    const schemaDefinitionRoot = getSchemaDefinitionRoot();
    if (!schemaDefinitionRoot) {
      throw new Error('Schema definition root was not found in focused app test-data harness');
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shared-schema-sample-button';
    button.textContent = 'Load Sample Schema';
    schemaDefinitionRoot.appendChild(button);
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
    return document.querySelector('[data-role="schema-textbox"]').value;
  }

  function getSchemaErrorText() {
    return document.querySelector('[data-role="schema-error"]').textContent.trim();
  }

  function getGenerateCount() {
    return getPanelQueries().getByRole('spinbutton', { name: 'How Many?' }).value;
  }

  function getPairwiseButton() {
    return getPanelRoot().querySelector('[data-role="generate-pairwise-button-wrapper"]');
  }

  function getPreviewText() {
    return document.getElementById('testDataPreviewCapture').textContent;
  }

  function getLatestDataTable() {
    return latestDataTable;
  }

  function setPreviewState(nextState = {}) {
    if (Object.prototype.hasOwnProperty.call(nextState, 'mode')) {
      previewState.mode = nextState.mode;
    }
    if (Object.prototype.hasOwnProperty.call(nextState, 'autoPreviewEnabled')) {
      previewState.autoPreviewEnabled = nextState.autoPreviewEnabled === true;
    }
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
    setPreviewState,
    assertSuccessfulGeneration,
    assertSuccessfulPreview,
  };
}

export { createFocusedAppTestDataHarness };
