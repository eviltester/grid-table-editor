import { fireEvent, within, waitFor } from '@testing-library/dom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createDataGeneratorPage } from '../../../../../js/gui_components/generator/runtime/create-generator-page.js';
import { getFakerCommandHelp } from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';
import { getDomainCommandHelp } from '../../../../../js/gui_components/shared/domain-command-help-metadata.js';
import { resolveFakerDocsUrl } from '../../../../../js/gui_components/shared/test-data/help/help-model-builder.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
} from '../../../../../js/gui_components/shared/schema-row-rule-mapper.js';
import { assertScenarioDataQuality } from '../../support/generated-value-quality.js';
import { installDomGlobals, cleanupDomGlobals } from '../../support/testing-library-dom-setup.js';
import { applyDeterministicScenarioSeed, withDeterministicScenarioSeed } from './deterministic-scenario-seed.js';

class TestTabulator {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
}

class TestPreviewGrid {
  constructor() {
    this.lastDataTable = null;
  }

  setGridFromGenericDataTable(dataTable) {
    this.lastDataTable = dataTable;
  }

  getHeadersFromGrid() {
    return this.lastDataTable?.getHeaders?.() || [];
  }

  getGridAsGenericDataTable() {
    return this.lastDataTable;
  }
}

class CapturingDownload {
  static reset() {
    CapturingDownload.lastDownload = null;
  }

  constructor(filename) {
    this.filename = filename;
  }

  downloadFile(text) {
    CapturingDownload.lastDownload = { filename: this.filename, text };
  }
}

function setInputValue(element, value) {
  element.focus();
  element.value = value;
  fireEvent.input(element, { target: { value } });
  fireEvent.change(element, { target: { value } });
  element.blur();
}

function setSelectValue(element, value) {
  element.focus();
  element.value = value;
  fireEvent.input(element, { target: { value } });
  fireEvent.change(element, { target: { value } });
  element.blur();
}

function clickElement(element) {
  fireEvent.click(element);
}

function getGeneratorRow(index = 0) {
  return document.querySelectorAll('.shared-schema-row')[index];
}

function getSchemaTextArea() {
  return document.querySelector('[data-role="generator-schema-definition-root"] [data-role="schema-textbox"]');
}

function getOutputPreviewTextArea() {
  return document.querySelector('[data-role="generator-output-preview"]');
}

function getGeneratePairwiseButton() {
  return document.querySelector('[data-role="generator-generate-pairwise-button"]');
}

async function getGenerateCombinationsDialog() {
  return within(document.body).findByRole('dialog', { name: /generate combinations/i });
}

function getGeneratePairwiseButtonWrapper() {
  return document.querySelector('[data-role="generator-pairwise-button-wrapper"]');
}

function getPreviewRowsInput() {
  return document.querySelector('[data-role="preview-rows-count-control"] input');
}

function getGenerateRowsInput() {
  return document.querySelector('[data-role="generate-rows-count-control"] input');
}

function fillGeneratorRow(rowIndex, row) {
  let rowElement = getGeneratorRow(rowIndex);
  let rowScope = within(rowElement);

  setInputValue(rowScope.getByPlaceholderText('Column Name'), row.name);
  rowElement = getGeneratorRow(rowIndex);
  rowScope = within(rowElement);

  const sourceSelect = rowElement.querySelector('[data-field="sourceType"]');
  setSelectValue(sourceSelect, row.sourceType);

  rowElement = getGeneratorRow(rowIndex);
  rowScope = within(rowElement);

  if (row.sourceType === 'faker' || row.sourceType === 'domain') {
    const commandSelect = rowElement.querySelector('[data-field="command"]');
    setSelectValue(commandSelect, row.command);

    rowElement = getGeneratorRow(rowIndex);
    rowScope = within(rowElement);
    setInputValue(rowScope.getByPlaceholderText('Params e.g. (10)'), row.params);
    return;
  }

  setInputValue(rowScope.getByPlaceholderText('Value / Regex'), row.value || '');
}

function resolveExpectedDocsUrl(row) {
  if (row?.sourceType === SOURCE_TYPE_FAKER) {
    return resolveFakerDocsUrl(row.command, getFakerCommandHelp(row.command)?.docsUrl || '');
  }
  if (row?.sourceType === SOURCE_TYPE_DOMAIN) {
    return String(getDomainCommandHelp(row.command)?.docsUrl || '').trim();
  }
  return '';
}

function createGeneratorInteractionHarness() {
  const dom = installDomGlobals('<!doctype html><html><body><div id="app"></div></body></html>');
  let page = null;

  function reset() {
    page?.destroy?.();
    document.getElementById('app').innerHTML = '';
    CapturingDownload.reset();
    page = createDataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker,
      RandExp,
      TabulatorCtor: TestTabulator,
      GridExtensionClass: TestPreviewGrid,
      ExporterClass: Exporter,
      DownloadClass: CapturingDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
  }

  async function runScenario(scenario) {
    return withDeterministicScenarioSeed(scenario.id, async () => {
      reset();

      for (let index = 1; index < scenario.rows.length; index += 1) {
        clickElement(within(document.body).getByRole('button', { name: /add field/i }));
      }
      scenario.rows.forEach((row, index) => {
        fillGeneratorRow(index, row);
      });

      const helpLink =
        scenario.sourceType === 'faker' || scenario.sourceType === 'domain'
          ? getGeneratorRow(0)?.querySelector('[data-field="faker-doc-link"]')
          : null;
      const expectedDocsUrl = resolveExpectedDocsUrl(scenario.rows[0]);
      if (helpLink && expectedDocsUrl) {
        expect(helpLink.hidden).toBe(false);
        expect(helpLink.getAttribute('href')).toBe(expectedDocsUrl);
      }

      clickElement(within(document.body).getByRole('button', { name: /edit as text/i }));
      const schemaTextArea = getSchemaTextArea();
      expect(schemaTextArea.value).toBe(scenario.expectedUiSchemaText || scenario.expectedSchemaText);

      clickElement(within(document.body).getByRole('button', { name: /edit as schema/i }));
      expect(document.querySelectorAll('.shared-schema-row').length).toBe(scenario.rows.length);

      setInputValue(getPreviewRowsInput(), scenario.pairwiseEligible ? '2' : '1');
      applyDeterministicScenarioSeed(scenario.id);
      clickElement(within(document.body).getByRole('button', { name: /^preview$/i }));

      const previewTable = page.generatorPreview?.getPreviewDataTable?.() || null;
      expect(previewTable).toBeTruthy();
      expect(previewTable.getRowCount()).toBeGreaterThan(0);
      const outputPreviewText = getOutputPreviewTextArea().value;
      expect(outputPreviewText.length).toBeGreaterThan(0);

      if (scenario.expectStructuredSerialization) {
        expect(String(previewTable.getCell(0, 0))).toMatch(/^[[{]/);
      }
      assertScenarioDataQuality({
        scenario,
        dataTable: previewTable,
        outputPreviewText,
      });

      const previewExporter = new Exporter({
        getGridAsGenericDataTable: () => previewTable,
        getHeadersFromGrid: () => previewTable.getHeaders(),
      });
      const previewCsv = previewExporter.getDataTableAs('csv', previewTable) || '';

      setInputValue(getGenerateRowsInput(), scenario.pairwiseEligible ? '2' : '1');
      applyDeterministicScenarioSeed(scenario.id);
      clickElement(within(document.body).getByRole('button', { name: /generate data/i }));
      await waitFor(() => expect(CapturingDownload.lastDownload).toBeTruthy());
      expect(CapturingDownload.lastDownload.filename.endsWith(scenario.expectedFileExtension)).toBe(true);
      expect(CapturingDownload.lastDownload.text.length).toBeGreaterThan(0);
      expect(CapturingDownload.lastDownload.text).not.toContain('**ERROR**');

      let pairwiseCsv = '';
      if (scenario.pairwiseEligible) {
        expect(getGeneratePairwiseButtonWrapper().style.display).toBe('inline-flex');
        CapturingDownload.reset();
        applyDeterministicScenarioSeed(scenario.id);
        clickElement(getGeneratePairwiseButton());
        clickElement(within(await getGenerateCombinationsDialog()).getByRole('button', { name: /^generate$/i }));
        await waitFor(() => expect(CapturingDownload.lastDownload?.filename).toMatch(/n-wise-combinations-data/));
        pairwiseCsv = CapturingDownload.lastDownload?.text || '';
      }

      return {
        scenarioId: scenario.id,
        headers: previewTable.getHeaders(),
        rowCount: previewTable.getRowCount(),
        previewCsv,
        outputPreviewText,
        downloadText: CapturingDownload.lastDownload?.text || '',
        downloadFilename: CapturingDownload.lastDownload?.filename || '',
        pairwiseCsv,
        schemaText: schemaTextArea.value,
      };
    });
  }

  return {
    runScenario,
    cleanup: () => {
      page?.destroy?.();
      cleanupDomGlobals(dom);
    },
  };
}

export { createGeneratorInteractionHarness };
