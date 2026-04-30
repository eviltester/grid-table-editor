import { JSDOM } from 'jsdom';
import { bootstrapApp } from '../packages/core-ui/js/script.js';

describe('script bootstrap', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
            <div id="main-grid-view"></div>
            <div id="import-export-controls"></div>
            <div id="tabbedTextArea"></div>
            <div id="testDataGeneratorContainer"></div>
            <div class="instructions"><details><ul><li>One</li></ul></details></div>
        </body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('awaits grid library loader before creating grid', async () => {
    const calls = [];

    const ensureGridLibraryLoadedFn = jest.fn(() => {
      calls.push('ensureGridLibraryLoaded');
      return Promise.resolve();
    });

    class ImportExportControlsClass {
      addHTMLtoGui() {}
      setExporter() {}
      setImporter() {}
      renderTextFromGrid() {}
      setFileFormatType() {}
      setOptionsViewForFormatType() {}
      getExportControls() {
        return {};
      }
    }
    class TabbedTextControlClass {
      addToGui() {}
    }
    class ExporterClass {}
    class ImporterClass {}

    class ExtendedDataGridClass {
      createChildGrid() {
        calls.push('createChildGrid');
      }
      getGridExtras() {
        return {
          clearGrid: jest.fn(),
          setGridFromGenericDataTable: jest.fn(),
          getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
          getHeadersFromGrid: jest.fn(() => []),
        };
      }
      sizeColumnsToFit() {}
    }

    await bootstrapApp({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      activeGridEngineName: 'tabulator',
      ExtendedDataGridClass,
      ImportExportControlsClass,
      TabbedTextControlClass,
      ExporterClass,
      ImporterClass,
      enableTestDataGenerationInterfaceFn: () => {},
      scheduleInitialInstructions: false,
    });

    expect(calls[0]).toBe('ensureGridLibraryLoaded');
    expect(calls[1]).toBe('createChildGrid');
  });

  test('returns early when grid library fails to load', async () => {
    const calls = [];
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const ensureGridLibraryLoadedFn = jest.fn(() => Promise.reject(new Error('load failed')));

    class ExtendedDataGridClass {
      createChildGrid() {
        calls.push('createChildGrid');
      }
      getGridExtras() {
        return {};
      }
    }

    await bootstrapApp({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      activeGridEngineName: 'tabulator',
      ExtendedDataGridClass,
      ImportExportControlsClass: class {},
      TabbedTextControlClass: class {},
      ExporterClass: class {},
      ImporterClass: class {},
      enableTestDataGenerationInterfaceFn: () => {},
      scheduleInitialInstructions: false,
    });

    expect(calls).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('wires controller, test data integration, and schedules initial instructions by default', async () => {
    const setTimeoutFn = jest.fn();
    const enableTestDataGenerationInterfaceFn = jest.fn();
    const gridExtras = {
      clearGrid: jest.fn(),
      setGridFromGenericDataTable: jest.fn(),
      getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
      getHeadersFromGrid: jest.fn(() => []),
    };
    const renderTextFromGrid = jest.fn();
    const setFileFormatType = jest.fn();
    const setOptionsViewForFormatType = jest.fn();
    const addHTMLtoGui = jest.fn();
    const setExporter = jest.fn();
    const setImporter = jest.fn();
    const tabbedAddToGui = jest.fn();
    let importerInstance;

    class ImportExportControlsClass {
      addHTMLtoGui = addHTMLtoGui;
      setExporter = setExporter;
      setImporter = setImporter;
      renderTextFromGrid = renderTextFromGrid;
      setFileFormatType = setFileFormatType;
      setOptionsViewForFormatType = setOptionsViewForFormatType;
    }

    class TabbedTextControlClass {
      constructor(host, controller) {
        this.host = host;
        this.controller = controller;
      }
      addToGui() {
        tabbedAddToGui(this.host, this.controller);
      }
    }

    class ExporterClass {
      constructor(extras) {
        this.extras = extras;
      }
    }

    class ImporterClass {
      constructor(extras) {
        this.extras = extras;
        importerInstance = this;
      }
    }

    class ExtendedDataGridClass {
      createChildGrid() {}
      getGridExtras() {
        return gridExtras;
      }
    }

    await bootstrapApp({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
      activeGridEngineName: 'tabulator',
      ExtendedDataGridClass,
      ImportExportControlsClass,
      TabbedTextControlClass,
      ExporterClass,
      ImporterClass,
      enableTestDataGenerationInterfaceFn,
      setTimeoutFn,
    });

    expect(addHTMLtoGui).toHaveBeenCalledWith(dom.window.document.getElementById('import-export-controls'));
    expect(tabbedAddToGui).toHaveBeenCalledWith(
      dom.window.document.getElementById('tabbedTextArea'),
      expect.any(ImportExportControlsClass)
    );
    expect(setExporter.mock.calls[0][0]).toBeInstanceOf(ExporterClass);
    expect(setExporter.mock.calls[0][0].extras).toBe(gridExtras);
    expect(setImporter.mock.calls[0][0]).toBe(importerInstance);
    expect(importerInstance.extras).toBe(gridExtras);
    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(setFileFormatType).toHaveBeenCalledTimes(1);
    expect(setOptionsViewForFormatType).toHaveBeenCalledTimes(1);
    expect(enableTestDataGenerationInterfaceFn).toHaveBeenCalledWith(
      'testDataGeneratorContainer',
      importerInstance,
      expect.any(ImportExportControlsClass),
      gridExtras
    );
    expect(setTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  test('scheduled instructions callback clears grid, imports instructions, and sizes columns', async () => {
    const clearGrid = jest.fn();
    const sizeColumnsToFit = jest.fn();
    const setGridFromGenericDataTable = jest.fn();
    let scheduledCallback;

    class ExtendedDataGridClass {
      createChildGrid() {}
      getGridExtras() {
        return {
          clearGrid,
          setGridFromGenericDataTable,
          getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
          getHeadersFromGrid: jest.fn(() => []),
        };
      }
      sizeColumnsToFit() {
        sizeColumnsToFit();
      }
    }

    class ImportExportControlsClass {
      addHTMLtoGui() {}
      setExporter() {}
      setImporter() {}
      renderTextFromGrid() {}
      setFileFormatType() {}
      setOptionsViewForFormatType() {}
    }

    let importerInstance;
    class ImporterClass {
      constructor() {
        importerInstance = this;
      }
      setGridFromGenericDataTable = jest.fn();
    }

    await bootstrapApp({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
      activeGridEngineName: 'tabulator',
      ExtendedDataGridClass,
      ImportExportControlsClass,
      TabbedTextControlClass: class {
        addToGui() {}
      },
      ExporterClass: class {},
      ImporterClass,
      enableTestDataGenerationInterfaceFn: () => {},
      setTimeoutFn: (callback) => {
        scheduledCallback = callback;
      },
    });

    scheduledCallback();

    expect(clearGrid).toHaveBeenCalledTimes(1);
    expect(importerInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const dataTable = importerInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(dataTable.getHeaders()).toEqual(['Instructions']);
    expect(dataTable.getRowCount()).toBe(1);
    expect(dataTable.getRow(0)).toEqual(['One']);
    expect(sizeColumnsToFit).toHaveBeenCalledTimes(1);
  });
});
