import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { initializeDataGeneratorPageHost } from '../../../js/gui_components/generator/host/index.js';

class FakeTabulator {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
}

class FakeGridExtension {
  constructor(table) {
    this.table = table;
  }
}

class FakeExporter {
  constructor(grid) {
    this.grid = grid;
  }
}

describe('generator host coordinator', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('initializes shell, preview grid, exporter, and options panels', () => {
    const page = {
      parentElement: document.getElementById('app'),
      documentObj: document,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      renderSchemaRows: jest.fn(),
      updateSchemaEditModeView: jest.fn(),
      renderOptionsPanelForSelectedFormat: jest.fn(),
      addRowAfter: jest.fn(),
      toggleSchemaEditMode: jest.fn(),
      handleGlobalButtonClick: jest.fn(),
      previewData: jest.fn(),
      generateDataFile: jest.fn(),
      generateAllPairsDataFile: jest.fn(),
      handleRowInputChange: jest.fn(),
      handleRowButtonClick: jest.fn(),
      updateAllPairsButtonVisibility: jest.fn(),
      schemaRows: [{ id: '1' }],
    };

    initializeDataGeneratorPageHost({
      page,
      createOptionsPanelsForParentFn: jest.fn(() => ({ csv: { addToGui: jest.fn() } })),
      populateFormatOptionsFn: jest.fn(() => {
        document.getElementById('generatorOutputFormat').innerHTML = '<option value="csv">CSV</option>';
      }),
    });

    expect(document.getElementById('generatorSchemaRows')).not.toBeNull();
    expect(page.previewTableApi).toBeInstanceOf(FakeTabulator);
    expect(page.previewTableApi.options.columnDefaults.editor).toBeUndefined();
    expect(page.previewTableApi.options.columnDefaults.headerFilter).toBe('input');
    expect(page.previewGrid).toBeInstanceOf(FakeGridExtension);
    expect(page.exporter).toBeInstanceOf(FakeExporter);
    expect(page.renderSchemaRows).toHaveBeenCalled();
    expect(page.updateSchemaEditModeView).toHaveBeenCalled();
    expect(page.renderOptionsPanelForSelectedFormat).toHaveBeenCalled();
  });
});
