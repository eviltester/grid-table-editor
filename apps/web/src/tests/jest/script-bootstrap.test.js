import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { bootstrapApp } from '../../../../../packages/core-ui/js/script.js';

describe('script bootstrap', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
            <p id="initial-load" class="import-progress-status startup-loading-status">Please Wait, Loading Libraries...</p>
            <div id="main-grid-view"></div>
            <div id="import-export-controls"></div>
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
      const loadingMessage = dom.window.document.getElementById('initial-load');
      expect(loadingMessage).not.toBeNull();
      expect(loadingMessage.textContent).toContain('Please Wait, Loading Libraries...');
      expect(loadingMessage.classList.contains('is-loading')).toBe(true);
      expect(loadingMessage.querySelector('[data-role="loading-indicator"]')).not.toBeNull();
      return Promise.resolve();
    });

    const workspaceApi = {
      setExporter() {},
      setImporter() {},
      renderTextFromGrid() {},
      setFileFormatType() {},
      setOptionsViewForFormatType() {},
    };
    const createImportExportWorkspaceComponentFn = jest.fn(() => workspaceApi);
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
      createImportExportWorkspaceComponentFn,
      ExporterClass,
      ImporterClass,
      enableTestDataGenerationInterfaceFn: () => {},
    });

    expect(calls[0]).toBe('ensureGridLibraryLoaded');
    expect(calls[1]).toBe('createChildGrid');
    expect(dom.window.document.getElementById('initial-load')).toBeNull();
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
      createImportExportWorkspaceComponentFn: () => ({
        setExporter() {},
        setImporter() {},
        renderTextFromGrid() {},
        setFileFormatType() {},
        setOptionsViewForFormatType() {},
      }),
      ExporterClass: class {},
      ImporterClass: class {},
      enableTestDataGenerationInterfaceFn: () => {},
    });

    expect(calls).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    const loadingMessage = dom.window.document.getElementById('initial-load');
    expect(loadingMessage).not.toBeNull();
    expect(loadingMessage.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(loadingMessage.classList.contains('is-loading')).toBe(false);
  });

  test('wires controller and test data integration without scheduling instructions import', async () => {
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
    const setExporter = jest.fn();
    const setImporter = jest.fn();
    let importerInstance;
    const createImportExportWorkspaceComponentFn = jest.fn(() => ({
      setExporter,
      setImporter,
      renderTextFromGrid,
      setFileFormatType,
      setOptionsViewForFormatType,
    }));

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
      createImportExportWorkspaceComponentFn,
      ExporterClass,
      ImporterClass,
      enableTestDataGenerationInterfaceFn,
    });

    expect(createImportExportWorkspaceComponentFn).toHaveBeenCalledWith({
      root: dom.window.document.getElementById('import-export-controls'),
      documentObj: dom.window.document,
    });
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
      expect.objectContaining({
        setExporter: expect.any(Function),
        setImporter: expect.any(Function),
        renderTextFromGrid: expect.any(Function),
      }),
      gridExtras
    );
  });

  test('instructions tooltip sample button loads sample data table', async () => {
    const clearGrid = jest.fn();
    const sizeColumnsToFit = jest.fn();

    class ExtendedDataGridClass {
      createChildGrid() {}
      getGridExtras() {
        return {
          clearGrid,
          getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
          getHeadersFromGrid: jest.fn(() => []),
        };
      }
      sizeColumnsToFit() {
        sizeColumnsToFit();
      }
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
      createImportExportWorkspaceComponentFn: () => ({
        setExporter() {},
        setImporter() {},
        renderTextFromGrid() {},
        setFileFormatType() {},
        setOptionsViewForFormatType() {},
      }),
      ExporterClass: class {},
      ImporterClass,
      enableTestDataGenerationInterfaceFn: () => {},
    });

    const button = dom.window.document.createElement('button');
    button.className = 'instructions-sample-data-button';
    dom.window.document.body.appendChild(button);
    button.click();

    expect(clearGrid).toHaveBeenCalledTimes(1);
    expect(importerInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const dataTable = importerInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(dataTable.getHeaders()).toEqual(['First Name', 'Last Name', 'Department', 'Role', 'Status']);
    expect(dataTable.getRowCount()).toBe(4);
    expect(sizeColumnsToFit).toHaveBeenCalledTimes(1);
  });

  test('instructions details button copies instructions list into grid', async () => {
    const clearGrid = jest.fn();
    const sizeColumnsToFit = jest.fn();

    class ExtendedDataGridClass {
      createChildGrid() {}
      getGridExtras() {
        return {
          clearGrid,
          getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
          getHeadersFromGrid: jest.fn(() => []),
        };
      }
      sizeColumnsToFit() {
        sizeColumnsToFit();
      }
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
      createImportExportWorkspaceComponentFn: () => ({
        setExporter() {},
        setImporter() {},
        renderTextFromGrid() {},
        setFileFormatType() {},
        setOptionsViewForFormatType() {},
      }),
      ExporterClass: class {},
      ImporterClass,
      enableTestDataGenerationInterfaceFn: () => {},
    });

    const button = dom.window.document.createElement('button');
    button.className = 'instructions-copy-to-grid-button';
    dom.window.document.body.appendChild(button);
    button.click();

    expect(clearGrid).toHaveBeenCalledTimes(1);
    expect(importerInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const dataTable = importerInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(dataTable.getHeaders()).toEqual(['Instructions']);
    expect(dataTable.getRowCount()).toBe(1);
    expect(dataTable.getRow(0)).toEqual(['One']);
    expect(sizeColumnsToFit).toHaveBeenCalledTimes(1);
  });
});
