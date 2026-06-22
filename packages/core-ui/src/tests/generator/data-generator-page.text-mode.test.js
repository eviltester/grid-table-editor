import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import RandExp from 'randexp';
import { createDataGeneratorPage } from '../../../js/gui_components/generator/runtime/create-generator-page.js';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';

const STUB_FAKER = {
  word: {
    noun: () => 'x',
  },
};

class FakeTabulator {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
}

class FakeGridExtension {
  constructor() {
    this.setGridFromGenericDataTable = jest.fn();
    FakeGridExtension.lastInstance = this;
  }
}

class FakeExporter {
  constructor() {
    this.options = {
      csv: { options: { header: true, quoteChar: '"' } },
      json: { options: { prettyPrint: false } },
      markdown: { options: { prettyPrint: true } },
    };
    this.getDataTableAsAsync = jest.fn(async (type, dataTable, progressCallback) => {
      progressCallback?.(`Formatting ${type}`);
      return `${type}:async:${dataTable.getRowCount()}`;
    });
    this.getDataTableAs = jest.fn((type, dataTable) => `${type}:sync:${dataTable.getRowCount()}`);
    this.setOptionsForType = jest.fn((type, options) => {
      this.options[type] = options;
    });
    this.getOptionsForType = jest.fn((type) => this.options[type]);
    FakeExporter.lastInstance = this;
  }

  canExport(type) {
    return ['csv', 'json', 'markdown'].includes(type);
  }

  getFileExtensionFor(type) {
    if (type === 'json') {
      return '.json';
    }
    if (type === 'markdown') {
      return '.md';
    }
    return '.csv';
  }
}

class FakeDownload {
  constructor(filename) {
    this.filename = filename;
  }

  downloadFile(text) {
    FakeDownload.lastDownload = { filename: this.filename, text };
  }
}

describe('generator page runtime text mode flows', () => {
  let dom;
  let alertFn;

  function createMountedPage(overrides = {}) {
    return createDataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: STUB_FAKER,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
      ...overrides,
    });
  }

  function getSchemaModeToggleButton() {
    return document.querySelector('[data-role="schema-mode-toggle"]');
  }

  function getSchemaModeHelpIcon() {
    return document.querySelector('[data-role="schema-mode-help"]');
  }

  function getSchemaDefinitionRoot() {
    return document.querySelector('[data-role="generator-schema-definition-root"]');
  }

  function getSchemaRowsContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-rows-region"]');
  }

  function getSchemaTextContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-text-region"]');
  }

  function getSchemaTextArea() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-textbox"]');
  }

  function getSchemaErrorStatus() {
    return document.querySelector('[data-role="generator-schema-definition-root"] [data-role="schema-error"]');
  }

  function getGenerationStatus() {
    return document.querySelector('[data-role="generator-status-text"]');
  }

  function getGenerateRowsInput() {
    return document.querySelector('[data-role="generate-rows-count-control"] input');
  }

  function getPreviewRowsInput() {
    return document.querySelector('[data-role="preview-rows-count-control"] input');
  }

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
    alertFn = jest.fn();
    FakeDownload.lastDownload = undefined;
    FakeGridExtension.lastInstance = undefined;
    FakeExporter.lastInstance = undefined;
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
  });

  test('default validation errors surface inline and do not throw', () => {
    const page = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });
    page.schemaRows = [{ id: '1', name: '', sourceType: 'regex', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    expect(() => page.previewData()).not.toThrow();
    expect(getSchemaErrorStatus().textContent).toBe('Row 1: column name is required.\nRow 1: regex value is required.');
  });

  test('toggles between schema controls and text editing with round trip', () => {
    const page = createMountedPage();
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'faker', command: 'word.noun', params: '()', value: '' }];
    page.renderSchemaRows();

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    expect(getSchemaTextContainer().style.display).toBe('block');
    expect(getSchemaRowsContainer().style.display).toBe('none');
    expect(toggle.textContent).toBe('Edit as Schema');
    expect(textArea.value).toContain('Name');
    expect(textArea.value).toContain('word.noun()');

    textArea.value = 'City\n[A-Z]{4}';
    toggle.click();

    expect(getSchemaTextContainer().style.display).toBe('none');
    expect(getSchemaRowsContainer().style.display).toBe('flex');
    expect(toggle.textContent).toBe('Edit as Text');
    expect(page.schemaRows[0].name).toBe('City');
    expect(page.schemaRows[0].value).toBe('[A-Z]{4}');
    expect(page.schemaRows[0].sourceType).toBe('regex');
  });

  test('text to schema to text preserves literal type as literal(...)', () => {
    createMountedPage();

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = 'dfffs\nt';
    toggle.click();

    const sourceSelect = document.querySelector('[data-field="sourceType"]');
    const valueInput = document.querySelector('[data-field="value"]');
    sourceSelect.value = 'literal';
    sourceSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    const refreshedValueInput = document.querySelector('[data-field="value"]');
    refreshedValueInput.value = valueInput?.value || 't';
    refreshedValueInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    toggle.click();
    expect(getSchemaTextArea().value).toBe('dfffs\nliteral(t)');
  });

  test('row mode to text mode preserves in-progress faker row with empty command', () => {
    const page = createMountedPage();

    page.schemaRows = [{ id: '1', name: 'User Name', sourceType: 'faker', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    getSchemaModeToggleButton().click();
    expect(getSchemaTextArea().value).toBe('User Name\n');
  });

  test('row action buttons work immediately after switching from text mode to schema mode', () => {
    const page = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = 'A\none\nB\ntwo';
    toggle.click();

    expect(page.schemaRows).toHaveLength(2);
    const removeButtons = document.querySelectorAll('[data-action="remove"]');
    removeButtons[1].click();
    expect(page.schemaRows).toHaveLength(1);
  });

  test('semantic validation rerender preserves params caret position while editing', () => {
    const page = createMountedPage();

    page.schemaRows = [
      { id: '1', name: 'Name', sourceType: 'domain', command: 'person.fullName', params: '(10)', value: '' },
    ];
    page.renderSchemaRows();

    const paramsInput = document.querySelector('input[data-field="params"]');
    paramsInput.focus();
    paramsInput.setSelectionRange(2, 2);

    page.schemaDefinition.applySemanticValidationForRow('1');

    const refreshedParamsInput = document.querySelector('input[data-field="params"]');
    expect(document.activeElement).toBe(refreshedParamsInput);
    expect(refreshedParamsInput.selectionStart).toBe(2);
    expect(refreshedParamsInput.selectionEnd).toBe(2);
    expect(refreshedParamsInput.value).toBe('(10)');
  });

  test('toggle clears visible help tooltips before switching schema mode', () => {
    const hideAll = jest.fn();
    window.tippy = { hideAll };

    createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const hideInstance = jest.fn();
    getSchemaModeHelpIcon()._tippy = { hide: hideInstance };
    getSchemaModeToggleButton().click();

    expect(hideInstance).toHaveBeenCalledTimes(1);
    expect(hideAll).toHaveBeenCalledWith({ duration: 0 });
  });

  test('schema mode help shows docs link only for Edit as Text and keeps sample button at end', () => {
    createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const helpIcon = getSchemaModeHelpIcon();
    const editAsTextHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsTextHtml).toContain('Generate To File docs');
    expect(editAsTextHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);

    getSchemaModeToggleButton().click();
    const editAsSchemaHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsSchemaHtml).not.toContain('Generate To File docs');
    expect(editAsSchemaHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);
  });

  test('text mode preserves previous typed method rows when command text becomes invalid', () => {
    const page = createMountedPage();

    page.schemaRows = [
      { id: '1', name: 'Name', sourceType: 'domain', command: 'person.fullName', params: '', value: '' },
    ];
    page.renderSchemaRows();

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = 'Name\nperson.fullNam';
    toggle.click();

    expect(page.schemaRows).toHaveLength(1);
    expect(page.schemaRows[0].sourceType).toBe('domain');
    expect(page.schemaRows[0].command).toBe('person.fullNam');
    expect(page.schemaRows[0].params).toBe('');
    expect(page.schemaRows[0].value).toBe('');

    getPreviewRowsInput().value = '1';
    page.previewData();
    expect(getSchemaErrorStatus().textContent).toContain('Row 1: unknown domain command "person.fullNam".');
  });

  test('shared schema definition parser can be used directly when mounted on the page', () => {
    const page = createMountedPage();

    page.schemaDefinition = {
      parseTextToRows: jest.fn(() => ({
        rows: [{ name: 'Element', sourceType: 'domain', command: 'chemicalElement.name', params: '' }],
        errors: [],
        tokens: [],
      })),
    };

    const parsed = page.schemaDefinition.parseTextToRows('Element\nscience.chemicalElement.name');

    expect(page.schemaDefinition.parseTextToRows).toHaveBeenCalledWith('Element\nscience.chemicalElement.name');
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].command).toBe('chemicalElement.name');
  });

  test('can generate directly from text mode without toggling back to schema mode', async () => {
    const page = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = 'City\nLondon';
    getGenerateRowsInput().value = '2';

    await page.generateDataFile();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.csv',
      text: 'csv:async:2',
    });
  });

  test('invalid text schema shows inline missing-definition error for 5 seconds when toggling to schema mode', () => {
    jest.useFakeTimers();
    try {
      createMountedPage({
        faker: STUB_FAKER,
        RandExp,
      });

      const toggle = getSchemaModeToggleButton();
      toggle.click();

      const textArea = getSchemaTextArea();
      textArea.value = 't1\n';
      toggle.click();

      const schemaErrorStatus = getSchemaErrorStatus();
      expect(schemaErrorStatus.textContent).toBe(
        'column t1 requires a data definition, use \'literal("")\' for blank data'
      );
      expect(getGenerationStatus().textContent).toBe('');
      expect(alertFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(4999);
      expect(schemaErrorStatus.textContent).toBe(
        'column t1 requires a data definition, use \'literal("")\' for blank data'
      );

      jest.advanceTimersByTime(1);
      expect(schemaErrorStatus.textContent).toBe('');
    } finally {
      jest.useRealTimers();
    }
  });

  test('schema mode toggle routes schema error and clear callbacks through the schema runtime bridge', () => {
    const page = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    page.generatorSchemaRuntime = {
      ...page.generatorSchemaRuntime,
      showSchemaErrorStatus,
      clearSchemaErrorStatus,
    };

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = 't1\n';
    toggle.click();

    expect(showSchemaErrorStatus).toHaveBeenCalledWith(
      'column t1 requires a data definition, use \'literal("")\' for blank data'
    );

    textArea.value = 'City\nliteral(London)';
    toggle.click();
    toggle.click();

    expect(clearSchemaErrorStatus).toHaveBeenCalled();
  });

  test('destroy allows remounting a clean generator page in the same root', () => {
    const firstPage = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    firstPage.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'first' }];
    firstPage.renderSchemaRows();
    getSchemaModeToggleButton().click();
    expect(getSchemaTextArea().value).toContain('Name');

    firstPage.destroy();
    document.getElementById('app').replaceChildren();

    FakeGridExtension.lastInstance = undefined;
    const secondPage = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    expect(document.querySelectorAll('[data-role="generator-schema-definition-root"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-role="schema-mode-toggle"]')).toHaveLength(1);

    secondPage.schemaRows = [
      { id: '2', name: 'Status', sourceType: 'literal', command: '', params: '', value: 'active' },
    ];
    secondPage.renderSchemaRows();

    getPreviewRowsInput().value = '2';
    secondPage.previewData();

    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(getSchemaErrorStatus().textContent).toBe('');
    expect(document.querySelector('[data-role="generator-output-preview"]').value).toBe('csv:sync:2');
  });

  test('empty text mode schema keeps zero rows and shows add-row validation', async () => {
    const page = createMountedPage({
      faker: STUB_FAKER,
      RandExp,
    });

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = '';

    await page.generateDataFile();

    expect(getSchemaErrorStatus().textContent).toBe('Add at least one schema row.');
    expect(page.schemaRows).toEqual([]);
  });
});
