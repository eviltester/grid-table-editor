import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createDataGeneratorPage } from '../../../../js/gui_components/generator/runtime/data-generator-page-runtime.js';
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
    return document.querySelectorAll('.shared-schema-row')[index];
  }

  function getSchemaDefinitionRoot() {
    return document.querySelector('[data-role="generator-schema-definition-root"]');
  }

  function getSchemaRowsContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-rows-region"]') || null;
  }

  function getSchemaTextContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-text-region"]') || null;
  }

  function getSchemaTextArea() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-textbox"]') || null;
  }

  function getOutputPreviewTextArea() {
    return document.querySelector('[data-role="generator-output-preview"]');
  }

  function getOutputFormatSelect() {
    return document.querySelector('[data-role="generator-output-format-select"]');
  }

  function getPairwiseWrapper() {
    return document.querySelector('[data-role="generator-pairwise-button-wrapper"]');
  }

  function getPreviewRowsInput() {
    return document.querySelector('[data-role="preview-rows-count-control"] input');
  }

  function getGenerateRowsInput() {
    return document.querySelector('[data-role="generate-rows-count-control"] input');
  }

  function getRowScope(index = 0) {
    return within(getRow(index));
  }

  async function setInputValue(element, value) {
    element.focus();
    element.value = value || '';
    fireEvent.input(element, { target: { value: element.value } });
    fireEvent.change(element, { target: { value: element.value } });
    element.blur();
  }

  function reset() {
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
    const textArea = getSchemaTextArea();
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
    await setInputValue(getPreviewRowsInput(), String(value));
  }

  async function setGenerateCount(value) {
    await setInputValue(getGenerateRowsInput(), String(value));
  }

  async function selectOutputFormat(value) {
    await user.selectOptions(getOutputFormatSelect(), value);
  }

  async function clickInjectedSampleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shared-schema-sample-button';
    button.textContent = 'Insert Example Schema';
    getSchemaDefinitionRoot().appendChild(button);
    await user.click(button);
    button.remove();
  }

  function getHelpLink(index = 0) {
    return getRow(index)?.querySelector('[data-field="faker-doc-link"]');
  }

  function getOutputPreviewText() {
    return getOutputPreviewTextArea()?.value || '';
  }

  function getSchemaText() {
    return getSchemaTextArea()?.value || '';
  }

  function getSchemaErrorText() {
    return (
      document
        .querySelector('[data-role="generator-schema-definition-root"] [data-role="schema-error"]')
        ?.textContent?.trim() || ''
    );
  }

  function getPreviewDataTable() {
    return page.generatorPreview?.getPreviewDataTable?.() || null;
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
    getSchemaRowsContainer,
    getSchemaTextContainer,
    getSchemaTextArea,
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
