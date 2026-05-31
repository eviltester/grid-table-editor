import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { DataGeneratorPage } from '../../../../js/gui_components/generator/index.js';
import { assertDataTableHasNoErrorIndicators, assertNoErrorIndicators } from './generated-value-quality.js';
import { installDomGlobals, cleanupDomGlobals } from './testing-library-dom-setup.js';

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

  getGridAsGenericDataTable() {
    return this.lastDataTable;
  }

  getHeadersFromGrid() {
    return this.lastDataTable?.getHeaders?.() || [];
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

function createFocusedGeneratorHarness() {
  const dom = installDomGlobals('<!doctype html><html><body><div id="app"></div></body></html>');
  const user = userEvent.setup({ document: dom.window.document });
  let page = null;

  function getRow(index = 0) {
    return document.querySelectorAll('.generator-schema-row')[index];
  }

  function getRowScope(index = 0) {
    return within(getRow(index));
  }

  async function setInputValue(element, value) {
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
    document.getElementById('app').innerHTML = '';
    CapturingDownload.reset();
    page = new DataGeneratorPage({
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
    page.init();
  }

  async function addField() {
    await user.click(within(document.body).getByRole('button', { name: /add field/i }));
  }

  async function clickRowAction(index, action) {
    const titleByAction = {
      add: 'Add field',
      remove: 'Remove field',
      up: 'Move up',
      down: 'Move down',
    };
    await user.click(within(getRow(index)).getByTitle(titleByAction[action]));
  }

  async function fillRow(index, row) {
    const rowScope = getRowScope(index);
    await setInputValue(rowScope.getByPlaceholderText('Column Name'), row.name || '');

    const sourceTypeSelect = getRow(index).querySelector('[data-field="sourceType"]');
    await user.selectOptions(sourceTypeSelect, row.sourceType);
    await waitFor(() => expect(getRow(index)).toBeTruthy());

    if (row.sourceType === 'faker' || row.sourceType === 'domain') {
      const commandSelect = getRow(index).querySelector('[data-field="command"]');
      await user.selectOptions(commandSelect, row.command);
      const paramsInput = within(getRow(index)).getByPlaceholderText('Params e.g. (10)');
      await setInputValue(paramsInput, row.params || '');
      return;
    }

    const valueInput = within(getRow(index)).getByPlaceholderText('Value / Regex');
    await setInputValue(valueInput, row.value || '');
  }

  async function toggleToTextMode() {
    await user.click(within(document.body).getByRole('button', { name: /edit as text/i }));
  }

  async function toggleToSchemaMode() {
    await user.click(within(document.body).getByRole('button', { name: /edit as schema/i }));
  }

  async function setSchemaText(value) {
    const textArea = document.getElementById('generatorSchemaText');
    await setInputValue(textArea, value);
  }

  async function clickPreview() {
    await user.click(within(document.body).getByRole('button', { name: /^preview$/i }));
  }

  async function clickGenerateData() {
    await user.click(within(document.body).getByRole('button', { name: /generate data/i }));
    await waitFor(() => expect(CapturingDownload.lastDownload).toBeTruthy());
  }

  async function clickGeneratePairwise() {
    await user.click(within(document.body).getByRole('button', { name: /generate pairwise/i }));
    await waitFor(() => expect(CapturingDownload.lastDownload?.filename).toMatch(/all-pairs-data/));
  }

  async function setPreviewCount(value) {
    await setInputValue(document.getElementById('previewRowsCount'), String(value));
  }

  async function setGenerateCount(value) {
    await setInputValue(document.getElementById('generateRowsCount'), String(value));
  }

  async function selectOutputFormat(value) {
    await user.selectOptions(document.getElementById('generatorOutputFormat'), value);
  }

  async function clickInjectedSampleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shared-schema-sample-button';
    button.textContent = 'Insert Example Schema';
    document.getElementById('generatorSchemaDefinition').appendChild(button);
    await user.click(button);
    button.remove();
  }

  function getHelpLink(index = 0) {
    return getRow(index)?.querySelector('[data-field="faker-doc-link"]');
  }

  function getPairwiseWrapper() {
    return document.getElementById('generateAllPairsButtonWrapper');
  }

  function getOutputPreviewText() {
    return document.getElementById('generatorOutputPreview').value;
  }

  function getSchemaText() {
    return document.getElementById('generatorSchemaText').value;
  }

  function getSchemaErrorText() {
    return document.getElementById('generatorSchemaErrorText').textContent.trim();
  }

  function getPreviewDataTable() {
    return page.previewGrid.lastDataTable;
  }

  function getLastDownload() {
    return CapturingDownload.lastDownload;
  }

  function assertSuccessfulPreview(label = 'generator preview') {
    const dataTable = getPreviewDataTable();
    expect(dataTable).toBeTruthy();
    expect(dataTable.getRowCount()).toBeGreaterThan(0);
    assertDataTableHasNoErrorIndicators(dataTable, label);
    assertNoErrorIndicators(getOutputPreviewText(), `${label} output preview`);
  }

  function assertSuccessfulDownload(label = 'generator download') {
    expect(getLastDownload()).toBeTruthy();
    expect(getLastDownload().text.length).toBeGreaterThan(0);
    assertNoErrorIndicators(getLastDownload().text, label);
  }

  return {
    reset,
    cleanup: () => cleanupDomGlobals(dom),
    page: () => page,
    addField,
    clickRowAction,
    fillRow,
    toggleToTextMode,
    toggleToSchemaMode,
    setSchemaText,
    clickPreview,
    clickGenerateData,
    clickGeneratePairwise,
    setPreviewCount,
    setGenerateCount,
    selectOutputFormat,
    clickInjectedSampleButton,
    getRow,
    getHelpLink,
    getPairwiseWrapper,
    getOutputPreviewText,
    getSchemaText,
    getSchemaErrorText,
    getPreviewDataTable,
    getLastDownload,
    assertSuccessfulPreview,
    assertSuccessfulDownload,
  };
}

export { createFocusedGeneratorHarness };
