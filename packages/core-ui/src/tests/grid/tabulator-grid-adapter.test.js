import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as generatorPreviewTabulatorAdapter from '../../../js/gui_components/generator/preview/tabulator-grid-adapter.js';
import * as tabulatorGridAdapterExports from '../../../js/gui_components/data-grid-editor/tabulator-grid-adapter.js';
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

  test('keeps the shared and generator preview adapter surfaces factory-only', () => {
    expect(typeof tabulatorGridAdapterExports.createTabulatorGridAdapter).toBe('function');
    expect(tabulatorGridAdapterExports.TabulatorGridAdapter).toBeUndefined();
    expect(typeof generatorPreviewTabulatorAdapter.createTabulatorGridAdapter).toBe('function');
    expect(generatorPreviewTabulatorAdapter.TabulatorGridAdapter).toBeUndefined();
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

  test('uses injected scheduling callbacks instead of ambient globals for deferred mount and cancel', async () => {
    const rootElement = document.createElement('div');
    const scheduledCallbacks = [];
    const requestAnimationFrameFn = jest.fn((callback) => {
      scheduledCallbacks.push(callback);
      return 'frame-1';
    });
    const cancelAnimationFrameFn = jest.fn();
    const ambientRequestAnimationFrame = jest.fn();
    const ambientCancelAnimationFrame = jest.fn();
    global.requestAnimationFrame = ambientRequestAnimationFrame;
    global.cancelAnimationFrame = ambientCancelAnimationFrame;

    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      requestAnimationFrameFn,
      cancelAnimationFrameFn,
    });

    expect(requestAnimationFrameFn).toHaveBeenCalledTimes(1);
    expect(ambientRequestAnimationFrame).not.toHaveBeenCalled();
    expect(adapter.getTableApi()).toBeNull();

    adapter.destroy();

    expect(cancelAnimationFrameFn).toHaveBeenCalledWith('frame-1');
    expect(ambientCancelAnimationFrame).not.toHaveBeenCalled();
    expect(scheduledCallbacks).toHaveLength(1);
  });

  test('keeps detached-root retries asynchronous when requestAnimationFrame is unavailable', async () => {
    const rootElement = document.createElement('div');
    const scheduledCallbacks = [];
    const setTimeoutFn = jest.fn((callback) => {
      scheduledCallbacks.push(callback);
      return 'timeout-1';
    });
    const clearTimeoutFn = jest.fn();

    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      windowObj: {},
      setTimeoutFn,
      clearTimeoutFn,
    });

    expect(setTimeoutFn).toHaveBeenCalledTimes(1);
    expect(adapter.getTableApi()).toBeNull();
    expect(scheduledCallbacks).toHaveLength(1);

    document.body.appendChild(rootElement);
    scheduledCallbacks[0]();
    await adapter.whenReady();

    expect(adapter.getTableApi()).toBeInstanceOf(FakeTabulator);
    adapter.destroy();
    expect(clearTimeoutFn).not.toHaveBeenCalled();
  });

  test('cancels timeout-based detached-root retries during destroy', () => {
    const rootElement = document.createElement('div');
    const setTimeoutFn = jest.fn(() => 'timeout-1');
    const clearTimeoutFn = jest.fn();

    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      windowObj: {},
      setTimeoutFn,
      clearTimeoutFn,
    });

    adapter.destroy();

    expect(clearTimeoutFn).toHaveBeenCalledWith('timeout-1');
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
