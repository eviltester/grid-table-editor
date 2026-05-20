import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { DataGeneratorPage } from '../../../js/gui_components/generator/data-generator-page.js';
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
    document.getElementById('previewRowsCount').value = '2';
    document.getElementById('previewDataButton').click();

    const output = document.getElementById('generatorOutputPreview').value;
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
    document.getElementById('generateRowsCount').value = '2';
    document.getElementById('generatorOutputFormat').value = 'json';

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
