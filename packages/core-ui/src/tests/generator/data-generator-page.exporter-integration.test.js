import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { DataGeneratorPage } from '../../../js/gui_components/generator/index.js';
import { Exporter } from '../../../../core/js/grid/exporter.js';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';

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

  getHeadersFromGrid() {
    return ['FixedValue'];
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

describe('DataGeneratorPage exporter integration', () => {
  let dom;

  function getPreviewButton() {
    return document.querySelector('[data-role="generator-preview-button"]');
  }

  function getOutputPreviewTextArea() {
    return document.querySelector('[data-role="generator-output-preview"]');
  }

  function getOutputFormatSelect() {
    return document.querySelector('[data-role="generator-output-format-select"]');
  }

  function getPreviewRowsInput() {
    return document.querySelector('[data-role="preview-rows-count-control"] input');
  }

  function getGenerateRowsInput() {
    return document.querySelector('[data-role="generate-rows-count-control"] input');
  }

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
    FakeGridExtension.lastInstance = undefined;
    FakeDownload.lastDownload = undefined;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('preview uses real exporter for csv output', () => {
    const page = new DataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: Exporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.init();

    page.schemaRows = [{ id: '1', name: 'FixedValue', sourceType: 'literal', command: '', params: '', value: 'A' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '2';
    getPreviewButton().click();

    const output = getOutputPreviewTextArea().value;
    expect(output).toContain('FixedValue');
    expect(output).toContain('A');
  });

  test('generate data file uses real exporter output and extension', async () => {
    const page = new DataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: Exporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.init();

    page.schemaRows = [{ id: '1', name: 'FixedValue', sourceType: 'literal', command: '', params: '', value: 'A' }];
    page.renderSchemaRows();
    getGenerateRowsInput().value = '2';
    getOutputFormatSelect().value = 'json';

    await page.generateDataFile();

    expect(FakeDownload.lastDownload.filename).toBe('generated-data.json');
    expect(FakeDownload.lastDownload.text).toContain('"FixedValue"');
    expect(FakeDownload.lastDownload.text).toContain('"A"');
  });

  test('applyCurrentTypeOptions updates real exporter options', () => {
    const page = new DataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: Exporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.init();

    page.applyCurrentTypeOptions({
      outputFormat: 'json',
      options: {
        prettyPrint: true,
      },
    });

    expect(page.exporter.getOptionsForType('json').options.prettyPrint).toBe(true);
  });
});
