import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTabulatorGridAdapter } from '../../../js/gui_components/generator/preview/index.js';

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
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('creates tabulator and grid-extension APIs and forwards destroy', () => {
    const rootElement = document.createElement('div');
    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
    });

    expect(adapter.getTableApi()).toBeInstanceOf(FakeTabulator);
    expect(adapter.getGridApi()).toBeInstanceOf(FakeGridExtension);
    expect(adapter.getTableApi().options.columnDefaults.headerFilter).toBe('input');

    adapter.destroy();

    expect(adapter.getGridApi()).toBeNull();
    expect(adapter.getTableApi()).toBeNull();
  });
});
