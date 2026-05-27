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

function getAppGridRow(index = 0) {
  return Array.from(document.querySelectorAll('#testDataSchemaRows .generator-schema-row'))[index];
}

function fillAppGridRow(rowIndex, row) {
  let rowElem = getAppGridRow(rowIndex);
  setInputValue(rowElem.querySelector('[data-field="name"]'), row.name || '');

  const typeSelect = rowElem.querySelector('[data-field="sourceType"]');
  const sourceType = row.sourceType || 'regex';
  setInputValue(typeSelect, sourceType);
  rowElem = getAppGridRow(rowIndex);

  if (sourceType === 'faker' || sourceType === 'domain') {
    if (row.command) {
      const commandSelect = rowElem.querySelector('[data-field="command"]');
      if (commandSelect) {
        setInputValue(commandSelect, row.command);
      }
    }
    const fieldValue = row.params || '';
    setInputValue(getAppGridRow(rowIndex).querySelector('[data-field="params"]'), fieldValue);
    return;
  }

  const fieldValue = row.value || '';
  setInputValue(getAppGridRow(rowIndex).querySelector('[data-field="value"]'), fieldValue);
}

function createAppTestDataInteractionHarness() {
  const dom = installDomGlobals(
    '<!doctype html><html><body><div id="host"></div><pre id="testDataPreviewCapture"></pre></body></html>'
  );
  global.RandExp = RandExp;
  let latestDataTable = null;

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

    const control = createTestDataGridControl({
      documentObj: document,
      windowObj: window,
      DebouncerClass: ImmediateDebouncer,
    });
    control.enableTestDataGenerationInterface('host', importer, textPreviewRenderer, gridExtras);
  }

  async function runScenario(scenario) {
    return withDeterministicScenarioSeed(scenario.id, async () => {
      reset();

      for (let index = 0; index < scenario.rows.length; index += 1) {
        while (document.querySelectorAll('#testDataSchemaRows .generator-schema-row').length <= index) {
          clickElement(document.getElementById('testDataAddSchemaRowButton'));
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
      await waitFor(() => {
        if (document.querySelectorAll('#testDataSchemaRows .generator-schema-row').length >= scenario.rows.length) {
          return;
        }
        throw new Error('Schema rows not yet synchronised from text');
      });

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

  return { runScenario, cleanup: () => cleanupDomGlobals(dom) };
}

export { createAppTestDataInteractionHarness };
