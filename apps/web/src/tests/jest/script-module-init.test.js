import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('script module initialization', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    delete global.document;
    delete global.window;
  });

  test('can be imported when document is undefined', async () => {
    const originalDocument = global.document;
    delete global.document;

    const importScriptModule = async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../../../../../packages/core-ui/js/script.js');
      });
    };

    await expect(importScriptModule()).resolves.not.toThrow();

    global.document = originalDocument;
  });

  test('registers DOMContentLoaded handler that bootstraps the app with default dependencies', async () => {
    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="main-grid-view"></div>
      <div id="import-export-controls"></div>
      <div id="tabbedTextArea"></div>
      <div id="testDataGeneratorContainer"></div>
    </body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;

    const addEventListenerSpy = jest.spyOn(global.document, 'addEventListener');
    const ensureGridLibraryLoaded = jest.fn(() => Promise.resolve());
    const renderTextFromGrid = jest.fn();
    const setFileFormatType = jest.fn();
    const setOptionsViewForFormatType = jest.fn();
    const setExporter = jest.fn();
    const setImporter = jest.fn();
    const addHTMLtoGui = jest.fn();
    const enableTestDataGenerationInterface = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation(() => 0);
    const gridExtras = {
      clearGrid: jest.fn(),
      setGridFromGenericDataTable: jest.fn(),
      getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
      getHeadersFromGrid: jest.fn(() => []),
    };

    jest.unstable_mockModule('@anywaydata/core/grid/importer.js', () => ({
      Importer: class Importer {
        constructor(extras) {
          this.extras = extras;
        }
      },
    }));
    jest.unstable_mockModule('@anywaydata/core/grid/exporter.js', () => ({
      Exporter: class Exporter {
        constructor(extras) {
          this.extras = extras;
        }
      },
    }));
    jest.unstable_mockModule(
      '../../../../../packages/core-ui/js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js',
      () => ({
        enableTestDataGenerationInterface,
      })
    );
    jest.unstable_mockModule(
      '../../../../../packages/core-ui/js/gui_components/data-grid-editor/main-display-grid.js',
      () => ({
        activeGridEngine: 'tabulator',
        ExtendedDataGrid: class ExtendedDataGrid {
          createChildGrid() {}
          getGridExtras() {
            return gridExtras;
          }
          sizeColumnsToFit() {}
        },
      })
    );
    jest.unstable_mockModule(
      '../../../../../packages/core-ui/js/gui_components/data-grid-editor/grid-library-loader.js',
      () => ({
        ensureGridLibraryLoaded,
      })
    );
    jest.unstable_mockModule('../../../../../packages/core-ui/js/gui_components/app/tabbed-text-control.js', () => ({
      TabbedTextControl: class TabbedTextControl {
        addToGui() {}
      },
    }));
    jest.unstable_mockModule('../../../../../packages/core-ui/js/gui_components/app/import-export-controls.js', () => ({
      ImportExportControls: class ImportExportControls {
        addHTMLtoGui = addHTMLtoGui;
        setExporter = setExporter;
        setImporter = setImporter;
        renderTextFromGrid = renderTextFromGrid;
        setFileFormatType = setFileFormatType;
        setOptionsViewForFormatType = setOptionsViewForFormatType;
      },
    }));

    let domContentLoadedHandler;
    addEventListenerSpy.mockImplementation((eventName, handler) => {
      if (eventName === 'DOMContentLoaded') {
        domContentLoadedHandler = handler;
      }
    });

    await jest.isolateModulesAsync(async () => {
      await import('../../../../../packages/core-ui/js/script.js');
    });

    if (domContentLoadedHandler) {
      await domContentLoadedHandler();
    }

    expect(ensureGridLibraryLoaded).toHaveBeenCalledWith({ engine: 'tabulator' });
    expect(addHTMLtoGui).toHaveBeenCalledWith(global.document.getElementById('import-export-controls'));
    expect(setExporter).toHaveBeenCalledTimes(1);
    expect(setImporter).toHaveBeenCalledTimes(1);
    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(setFileFormatType).toHaveBeenCalledTimes(1);
    expect(setOptionsViewForFormatType).toHaveBeenCalledTimes(1);
    expect(enableTestDataGenerationInterface).toHaveBeenCalledWith(
      'testDataGeneratorContainer',
      expect.any(Object),
      expect.any(Object),
      gridExtras
    );
    expect(setTimeoutSpy).not.toHaveBeenCalledWith(expect.any(Function), 3000);

    dom.window.close();
  });
});
