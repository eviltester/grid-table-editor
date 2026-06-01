import { jest } from '@jest/globals';
import { ExtendedDataGrid } from '../../../js/gui_components/data-grid-editor/tabulator/main-display-grid.js';
import { JSDOM } from 'jsdom';

describe('Tabulator main display grid', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`, {
      pretendToBeVisual: true,
    });
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('createChildGrid delegates to the componentized data-grid factory', () => {
    const fakeComponent = {
      getGridExtras: jest.fn(() => ({ grid: true })),
      getTableApi: jest.fn(() => ({ table: true })),
      whenReady: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(),
    };
    const createDataGridComponentFn = jest.fn(() => fakeComponent);
    const grid = new ExtendedDataGrid({
      documentObj: document,
      createDataGridComponentFn,
      TabulatorCtor: class {},
      GridExtensionClass: class {},
    });

    const host = document.getElementById('host');
    const component = grid.createChildGrid(host);

    expect(component).toBe(fakeComponent);
    expect(createDataGridComponentFn).toHaveBeenCalledWith({
      root: host,
      documentObj: document,
      services: {
        TabulatorCtor: expect.any(Function),
        GridExtensionClass: expect.any(Function),
      },
    });
    expect(grid.getGridExtras()).toEqual({ grid: true });
    expect(grid.getTableApi()).toEqual({ table: true });
  });
});
