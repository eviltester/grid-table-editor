import { jest } from '@jest/globals';
import { GridControl, GridControlsPageMap } from '../../../js/gui_components/data-grid-editor/gridControl.js';
import { JSDOM } from 'jsdom';

describe('GridControl', () => {
  let dom;
  let parent;
  let control;
  let gridExtras;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;

    document.body.innerHTML = '';
    parent = document.createElement('div');
    document.body.appendChild(parent);

    control = new GridControl(new GridControlsPageMap());
    control.addGuiIn(parent);

    gridExtras = {
      addRow: jest.fn(),
      addRowsRelativeToSelection: jest.fn(),
      getNumberOfSelectedRows: jest.fn(() => 1),
      deleteSelectedRows: jest.fn(),
      clearFilters: jest.fn(),
      clearSort: jest.fn(),
      filterText: jest.fn(),
      clearGrid: jest.fn(),
    };
    control.useThisGridFunctionality(gridExtras);
    control.addHooksToPage(parent);

    global.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('wires toolbar buttons to grid actions', () => {
    parent.querySelector('#addRowButton').click();
    parent.querySelector('#addRowsAboveButton').click();
    parent.querySelector('#addRowsBelowButton').click();

    expect(gridExtras.addRow).toHaveBeenCalledTimes(1);
    expect(gridExtras.addRowsRelativeToSelection).toHaveBeenNthCalledWith(1, -1);
    expect(gridExtras.addRowsRelativeToSelection).toHaveBeenNthCalledWith(2, 1);
  });

  test('delete selected rows respects selected count and confirmation', () => {
    gridExtras.getNumberOfSelectedRows.mockReturnValue(0);
    parent.querySelector('#deleteSelectedRowsButton').click();
    expect(gridExtras.deleteSelectedRows).not.toHaveBeenCalled();

    gridExtras.getNumberOfSelectedRows.mockReturnValue(1);
    global.confirm = jest.fn(() => false);
    parent.querySelector('#deleteSelectedRowsButton').click();
    expect(gridExtras.deleteSelectedRows).not.toHaveBeenCalled();

    global.confirm = jest.fn(() => true);
    parent.querySelector('#deleteSelectedRowsButton').click();
    expect(gridExtras.deleteSelectedRows).toHaveBeenCalledTimes(1);
  });

  test('filter textbox input and clear filters are wired', () => {
    const filterInput = parent.querySelector('#filter-text-box');
    filterInput.value = 'alpha';
    filterInput.dispatchEvent(new Event('input'));
    expect(gridExtras.filterText).toHaveBeenCalledWith('alpha');

    parent.querySelector('#clearFiltersButton').click();
    expect(filterInput.value).toBe('');
    expect(gridExtras.clearFilters).toHaveBeenCalledTimes(1);

    parent.querySelector('#clearSortButton').click();
    expect(gridExtras.clearSort).toHaveBeenCalledTimes(1);
  });

  test('clear table honors confirmation', () => {
    global.confirm = jest.fn(() => false);
    parent.querySelector('#clearTableButton').click();
    expect(gridExtras.clearGrid).not.toHaveBeenCalled();

    global.confirm = jest.fn(() => true);
    parent.querySelector('#clearTableButton').click();
    expect(gridExtras.clearGrid).toHaveBeenCalledTimes(1);
  });
});
