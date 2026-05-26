import { fireEvent, within, waitFor } from '@testing-library/dom';
import RandExp from 'randexp';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createTestDataGridControl } from '../../../../../js/gui_components/app/test-data-grid/index.js';
import { installDomGlobals, cleanupDomGlobals } from '../../support/testing-library-dom-setup.js';
import { applyDeterministicScenarioSeed, withDeterministicScenarioSeed } from './deterministic-scenario-seed.js';
import { assertDataTableHasNoErrorIndicators, assertNoErrorIndicators } from '../../support/generated-value-quality.js';

class ImmediateDebouncer {
  debounce(_name, callback) {
    callback();
  }

  clear() {}
}

function setInputValue(element, value) {
  element.focus();
  element.value = value;
  fireEvent.input(element, { target: { value } });
  fireEvent.change(element, { target: { value } });
  element.blur();
}

function clickElement(element) {
  fireEvent.click(element);
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
        if (value === row.type) option.selected = true;
        typeSelect.appendChild(option);
      });

      rowElem.addEventListener('input', (event) => {
        const field = event.target.getAttribute('data-field');
        if (!field || field === 'selected') return;
        state.rows[index][field] = event.target.value;
        onDraftCellEditChange?.(null);
        convertGridToText();
      });

      rowElem.addEventListener('change', (event) => {
        const field = event.target.getAttribute('data-field');
        if (!field) return;
        if (field === 'selected') {
          if (event.target.checked) state.selectedIndexes.add(index);
          else state.selectedIndexes.delete(index);
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

function getAppGridRow(index = 0) {
  return Array.from(document.querySelectorAll('.test-schema-grid-row'))[index];
}

function fillAppGridRow(rowIndex, row) {
  let rowElem = getAppGridRow(rowIndex);
  setInputValue(rowElem.querySelector('[data-field="columnName"]'), row.name);

  const typeSelect = rowElem.querySelector('[data-field="type"]');
  const typeValue = row.sourceType === 'faker' || row.sourceType === 'domain' ? row.command : row.sourceType;
  setInputValue(typeSelect, typeValue);

  rowElem = getAppGridRow(rowIndex);
  const fieldValue = row.sourceType === 'faker' || row.sourceType === 'domain' ? row.params : row.value;
  setInputValue(rowElem.querySelector('[data-field="value"]'), fieldValue || '');
}

function createAppTestDataInteractionHarness() {
  const dom = installDomGlobals(
    '<!doctype html><html><body><div id="host"></div><pre id="testDataPreviewCapture"></pre></body></html>'
  );
  global.RandExp = RandExp;
  let latestDataTable = null;
  let control = null;

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
      getRowCount: () => latestDataTable?.getRowCount?.() || 0,
      getSelectedRowIndexes: () => [],
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

  async function runScenario(scenario) {
    return withDeterministicScenarioSeed(scenario.id, async () => {
      reset();

      for (let index = 0; index < scenario.rows.length; index += 1) {
        while (document.querySelectorAll('.test-schema-grid-row').length <= index) {
          clickElement(document.querySelector('#testDataSchemaGrid button'));
        }
        fillAppGridRow(index, scenario.rows[index]);
      }

      await waitFor(() =>
        expect(document.getElementById('testDataSchemaText').value).toBe(
          scenario.expectedUiSchemaText || scenario.expectedSchemaText
        )
      );

      const schemaTextArea = document.getElementById('testDataSchemaText');
      setInputValue(schemaTextArea, scenario.expectedSchemaText);
      await waitFor(() => expect(document.querySelectorAll('.test-schema-grid-row').length).toBe(scenario.rows.length));

      if (scenario.pairwiseEligible) {
        expect(document.getElementById('generateallpairs').style.display).not.toBe('none');
      }

      setInputValue(document.getElementById('generateCount'), scenario.pairwiseEligible ? '2' : '1');
      applyDeterministicScenarioSeed(scenario.id);
      clickElement(within(document.body).getByRole('button', { name: /^generate$/i }));
      await waitFor(() => expect(latestDataTable).toBeTruthy());
      expect(latestDataTable.getRowCount()).toBeGreaterThan(0);

      if (scenario.expectStructuredSerialization) {
        expect(String(latestDataTable.getCell(0, 0))).toMatch(/^[[{]/);
      }
      assertDataTableHasNoErrorIndicators(latestDataTable, scenario.id);

      const exporter = new Exporter({
        getGridAsGenericDataTable: () => latestDataTable,
        getHeadersFromGrid: () => latestDataTable?.getHeaders?.() || [],
      });
      const previewHeaders = latestDataTable.getHeaders();
      const previewRowCount = latestDataTable.getRowCount();
      const previewCsv = exporter.getDataTableAs('csv', latestDataTable) || '';
      assertNoErrorIndicators(previewCsv, `${scenario.id} app preview csv`);

      clickElement(within(document.body).getByRole('button', { name: /refresh text preview/i }));
      await waitFor(() =>
        expect(document.getElementById('testDataPreviewCapture').textContent.length).toBeGreaterThan(0)
      );
      const outputPreviewText = document.getElementById('testDataPreviewCapture').textContent;
      assertNoErrorIndicators(outputPreviewText, `${scenario.id} app preview`);

      let pairwiseCsv = '';
      if (scenario.pairwiseEligible) {
        const previousRowCount = latestDataTable.getRowCount();
        applyDeterministicScenarioSeed(scenario.id);
        clickElement(within(document.body).getByRole('button', { name: /generate pairwise/i }));
        await waitFor(() => expect(latestDataTable.getRowCount()).toBeGreaterThan(previousRowCount));
        assertDataTableHasNoErrorIndicators(latestDataTable, `${scenario.id} pairwise`);
        pairwiseCsv = exporter.getDataTableAs('csv', latestDataTable) || '';
        assertNoErrorIndicators(pairwiseCsv, `${scenario.id} app pairwise csv`);
      }

      return {
        scenarioId: scenario.id,
        headers: previewHeaders,
        rowCount: previewRowCount,
        previewCsv,
        outputPreviewText,
        pairwiseCsv,
        schemaText: document.getElementById('testDataSchemaText').value,
      };
    });
  }

  return {
    runScenario,
    cleanup: () => cleanupDomGlobals(dom),
  };
}

export { createAppTestDataInteractionHarness };
