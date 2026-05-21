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

function createDomBackedSchemaGridEditor({
  tableDiv,
  convertGridToText,
  onDraftCellEditChange,
  getAgGridCommandEditorValues,
}) {
  const state = { rows: [], selectedIndexes: new Set() };

  function cloneRow(row) {
    return {
      columnName: String(row?.columnName || ''),
      type: String(row?.type || 'regex'),
      value: String(row?.value ?? ''),
      comments: String(row?.comments ?? ''),
      leadingTextLines: Array.isArray(row?.leadingTextLines) ? row.leadingTextLines.slice() : [],
    };
  }

  function renderRows() {
    tableDiv.innerHTML = '';
    state.rows.forEach((row, index) => {
      const rowElem = document.createElement('div');
      rowElem.className = 'test-schema-grid-row';
      rowElem.setAttribute('data-row-index', String(index));
      rowElem.innerHTML = `
        <label>Select Row <input type="checkbox" data-field="selected" ${state.selectedIndexes.has(index) ? 'checked' : ''} /></label>
        <label>Column Name <input type="text" data-field="columnName" value="${row.columnName.replace(/"/g, '&quot;')}" /></label>
        <label>Type <select data-field="type"></select></label>
        <label>Value <input type="text" data-field="value" value="${row.value.replace(/"/g, '&quot;')}" /></label>
      `;

      const typeSelect = rowElem.querySelector('[data-field="type"]');
      getAgGridCommandEditorValues(row.type).forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        if (value === row.type) {
          option.selected = true;
        }
        typeSelect.appendChild(option);
      });

      rowElem.addEventListener('input', (event) => {
        const field = event.target.getAttribute('data-field');
        if (!field || field === 'selected') {
          return;
        }
        state.rows[index][field] = event.target.value;
        onDraftCellEditChange?.(null);
        convertGridToText();
      });

      rowElem.addEventListener('change', (event) => {
        const field = event.target.getAttribute('data-field');
        if (!field) {
          return;
        }
        if (field === 'selected') {
          if (event.target.checked) {
            state.selectedIndexes.add(index);
          } else {
            state.selectedIndexes.delete(index);
          }
          return;
        }
        state.rows[index][field] = event.target.value;
        onDraftCellEditChange?.(null);
        renderRows();
        convertGridToText();
      });

      tableDiv.appendChild(rowElem);
    });
  }

  return {
    schemaGridApi: {},
    schemaGridExtras: {
      deleteSelectedRows() {
        state.rows = state.rows.filter((_, index) => !state.selectedIndexes.has(index));
        state.selectedIndexes.clear();
        renderRows();
      },
    },
    schemaGridBridge: {
      getRows: () => state.rows.map((row) => cloneRow(row)),
      addRows(rows) {
        state.rows.push(...rows.map((row) => cloneRow(row)));
        renderRows();
      },
      clearRows() {
        state.rows = [];
        state.selectedIndexes.clear();
        renderRows();
      },
    },
  };
}

function createFocusedAppTestDataHarness() {
  const dom = installDomGlobals(
    '<!doctype html><html><body><div id="host"></div><pre id="testDataPreviewCapture"></pre></body></html>'
  );
  const user = userEvent.setup({ document: dom.window.document });
  global.RandExp = RandExp;

  let latestDataTable = null;
  let control = null;
  const mainGridState = {
    rowCount: 0,
    selectedRowIndexes: [],
  };

  async function setInputValue(element, value) {
    await user.click(element);
    await user.clear(element);
    if (value) {
      if (/[\n\\[\]{}]/.test(value)) {
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
      setupSchemaGridEditorFn: createDomBackedSchemaGridEditor,
    });

    control.enableTestDataGenerationInterface('host', importer, textPreviewRenderer, gridExtras);
  }

  function getGridRow(index = 0) {
    return document.querySelectorAll('.test-schema-grid-row')[index];
  }

  async function addColumn() {
    await user.click(document.querySelectorAll('#testDataSchemaGrid button')[0]);
  }

  async function fillGridRow(index, row) {
    const rowElem = getGridRow(index);
    await setInputValue(rowElem.querySelector('[data-field="columnName"]'), row.name || '');

    const typeValue = row.sourceType === 'faker' || row.sourceType === 'domain' ? row.command : row.sourceType;
    await user.selectOptions(rowElem.querySelector('[data-field="type"]'), typeValue);

    const fieldValue = row.sourceType === 'faker' || row.sourceType === 'domain' ? row.params : row.value;
    await setInputValue(getGridRow(index).querySelector('[data-field="value"]'), fieldValue || '');
  }

  async function setSchemaText(value) {
    await setInputValue(document.getElementById('testDataSchemaText'), value);
  }

  async function clickGenerate() {
    await user.click(within(document.body).getByRole('button', { name: /^generate$/i }));
    await waitFor(() => expect(latestDataTable).toBeTruthy());
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
