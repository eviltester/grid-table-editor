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

    expect(root.querySelector('#addRowButton')).toBeTruthy();
    expect(root.querySelector('#myGrid')).toBeTruthy();
    expect(component.getTableApi()).toBeInstanceOf(FakeTabulator);
    expect(component.getGridExtras()).toBeInstanceOf(FakeGridExtension);

    root.querySelector('#addRowButton').click();
    expect(component.getGridExtras().addRow).toHaveBeenCalledTimes(1);

    component.destroy();
  });
});
