import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGridToolbarComponent } from '../../../js/gui_components/data-grid-editor/grid-toolbar/index.js';

describe('GridToolbar', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.Event = dom.window.Event;
    root = document.createElement('section');
    document.body.appendChild(root);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders toolbar controls and emits user-like interactions through callbacks', () => {
    const callbacks = {
      onAddRow: jest.fn(),
      onAddRowsAbove: jest.fn(),
      onAddRowsBelow: jest.fn(),
      onDeleteSelectedRows: jest.fn(),
      onClearFilters: jest.fn(),
      onClearSort: jest.fn(),
      onClearTable: jest.fn(),
      onFilterTextChange: jest.fn(),
      onUniqueColumnNamesChange: jest.fn(),
    };

    const component = createGridToolbarComponent({
      root,
      documentObj: document,
      callbacks,
    });

    root.querySelector('#addRowButton').click();
    root.querySelector('#addRowsAboveButton').click();
    root.querySelector('#addRowsBelowButton').click();
    root.querySelector('#deleteSelectedRowsButton').click();
    root.querySelector('#clearSortButton').click();
    root.querySelector('#clearTableButton').click();

    const filterInput = root.querySelector('#filter-text-box');
    filterInput.value = 'alpha';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    root.querySelector('#clearFiltersButton').click();

    const uniqueNamesCheckbox = root.querySelector('#uniqueColumnNamesCheckbox');
    uniqueNamesCheckbox.checked = true;
    uniqueNamesCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(callbacks.onAddRow).toHaveBeenCalledTimes(1);
    expect(callbacks.onAddRowsAbove).toHaveBeenCalledTimes(1);
    expect(callbacks.onAddRowsBelow).toHaveBeenCalledTimes(1);
    expect(callbacks.onDeleteSelectedRows).toHaveBeenCalledTimes(1);
    expect(callbacks.onClearSort).toHaveBeenCalledTimes(1);
    expect(callbacks.onClearTable).toHaveBeenCalledTimes(1);
    expect(callbacks.onFilterTextChange).toHaveBeenCalledWith('alpha');
    expect(callbacks.onClearFilters).toHaveBeenCalledTimes(1);
    expect(root.querySelector('#filter-text-box').value).toBe('');
    expect(callbacks.onUniqueColumnNamesChange).toHaveBeenCalledWith(true);

    component.destroy();
  });
});
