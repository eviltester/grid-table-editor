import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createDataGridComponent } from '../../../js/gui_components/data-grid-editor/index.js';

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
    this.addRow = jest.fn();
    this.addRowsRelativeToSelection = jest.fn();
    this.getNumberOfSelectedRows = jest.fn(() => 0);
    this.deleteSelectedRows = jest.fn();
    this.clearFilters = jest.fn();
    this.clearSort = jest.fn();
    this.filterText = jest.fn();
    this.clearGrid = jest.fn();
    this.destroy = jest.fn();
  }
}

describe('DataGridComponent view', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>', {
      pretendToBeVisual: true,
    });
    global.document = dom.window.document;
    global.window = dom.window;
    global.Event = dom.window.Event;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.cancelAnimationFrame = (handle) => clearTimeout(handle);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders toolbar and grid host, and mounts tabulator when connected', async () => {
    const root = document.createElement('section');
    document.body.appendChild(root);
    const component = createDataGridComponent({
      root,
      documentObj: document,
      services: {
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
        requestConfirm: jest.fn(async () => true),
      },
    });

    await component.whenReady();

    expect(root.querySelector('[data-role="add-row-button"]')).toBeTruthy();
    expect(root.querySelector('#myGrid')).toBeTruthy();
    expect(root.querySelector('[data-role="grid-error-status"]')?.id).toBe('grid-column-error');
    expect(component.getTableApi()).toBeInstanceOf(FakeTabulator);
    expect(component.getGridExtras()).toBeInstanceOf(FakeGridExtension);
    const headerHtml = component.getTableApi().options.columnDefaults.titleFormatter({
      getValue: () => 'Column 1',
    });
    const headerHost = document.createElement('div');
    headerHost.innerHTML = headerHtml;
    const filterButton = headerHost.querySelector('[data-action="filter"]');
    expect(filterButton.tagName).toBe('BUTTON');
    expect(filterButton.getAttribute('type')).toBe('button');
    expect(filterButton.getAttribute('title')).toBe('Filter column');
    expect(filterButton.getAttribute('aria-label')).toBe('Filter column');
    expect(filterButton.querySelector('svg.header-action-icon')).not.toBeNull();
    for (const action of ['sort-desc', 'sort-asc', 'sort-none']) {
      const sortButton = headerHost.querySelector(`[data-action="${action}"]`);
      expect(sortButton.tagName).toBe('BUTTON');
      expect(sortButton.getAttribute('type')).toBe('button');
    }
    const addLeftButton = headerHost.querySelector('[data-action="add-left"]');
    expect(addLeftButton.tagName).toBe('BUTTON');
    expect(addLeftButton.getAttribute('title')).toBe('Add column left');
    expect(addLeftButton.getAttribute('aria-label')).toBe('Add column left');
    expect(addLeftButton.querySelector('svg.header-action-icon')).not.toBeNull();
    expect(headerHost.querySelector('[data-action="sort-none"]').getAttribute('aria-label')).toBe('Clear sort');

    root.querySelector('[data-role="add-row-button"]').click();
    expect(component.getGridExtras().addRow).toHaveBeenCalledTimes(1);

    component.destroy();
  });

  test('prefers the root owner window Tabulator when no service override is supplied', async () => {
    const originalTabulator = globalThis.Tabulator;
    const root = document.createElement('section');
    document.body.appendChild(root);
    dom.window.Tabulator = FakeTabulator;
    delete globalThis.Tabulator;

    try {
      const component = createDataGridComponent({
        root,
        documentObj: document,
        services: {
          GridExtensionClass: FakeGridExtension,
          requestConfirm: jest.fn(async () => true),
        },
      });

      await component.whenReady();

      expect(component.getTableApi()).toBeInstanceOf(FakeTabulator);
      component.destroy();
    } finally {
      if (typeof originalTabulator === 'undefined') {
        delete globalThis.Tabulator;
      } else {
        globalThis.Tabulator = originalTabulator;
      }
      delete dom.window.Tabulator;
    }
  });
});
