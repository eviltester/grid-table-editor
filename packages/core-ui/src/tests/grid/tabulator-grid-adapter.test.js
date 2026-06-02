import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTabulatorGridAdapter } from '../../../js/gui_components/data-grid-editor/tabulator-grid-adapter.js';

class FakeTabulator {
  constructor(rootElement, options) {
    this.rootElement = rootElement;
    this.options = options;
    this.destroy = jest.fn();
  }
}

class FakeGridExtension {
  constructor(tableApi) {
    this.tableApi = tableApi;
    this.setGridFromGenericDataTable = jest.fn();
    this.destroy = jest.fn();
  }
}

describe('TabulatorGridAdapter', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>', {
      pretendToBeVisual: true,
    });
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.cancelAnimationFrame = (handle) => clearTimeout(handle);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('creates tabulator and grid-extension APIs and forwards destroy', async () => {
    const rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      tabulatorOptions: {
        columnDefaults: {
          headerFilter: 'input',
        },
      },
    });

    await adapter.whenReady();

    expect(adapter.getTableApi()).toBeInstanceOf(FakeTabulator);
    expect(adapter.getGridApi()).toBeInstanceOf(FakeGridExtension);
    expect(adapter.getTableApi().options.columnDefaults.headerFilter).toBe('input');

    adapter.destroy();

    expect(adapter.getGridApi()).toBeNull();
    expect(adapter.getTableApi()).toBeNull();
  });

  test('waits for a disconnected root to be attached before creating tabulator', async () => {
    const rootElement = document.createElement('div');
    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
    });

    expect(adapter.getTableApi()).toBeNull();

    document.body.appendChild(rootElement);
    await adapter.whenReady();

    expect(adapter.getTableApi()).toBeInstanceOf(FakeTabulator);
    expect(adapter.getGridApi()).toBeInstanceOf(FakeGridExtension);
  });

  test('queues setGridFromGenericDataTable until the grid is mounted', async () => {
    const rootElement = document.createElement('div');
    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
    });
    const dataTable = { rows: [] };

    const setPromise = adapter.setGridFromGenericDataTable(dataTable);
    document.body.appendChild(rootElement);
    await setPromise;

    expect(adapter.getGridApi().setGridFromGenericDataTable).toHaveBeenCalledWith(dataTable);
  });

  test('can be created without a global document when a root ownerDocument is available', async () => {
    const isolatedDom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
      pretendToBeVisual: true,
    });
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const rootElement = isolatedDom.window.document.getElementById('root');
      const adapter = createTabulatorGridAdapter({
        rootElement,
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
      });

      await adapter.whenReady();
      expect(adapter.getTableApi()).toBeInstanceOf(FakeTabulator);
      adapter.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      isolatedDom.window.close();
    }
  });
});
