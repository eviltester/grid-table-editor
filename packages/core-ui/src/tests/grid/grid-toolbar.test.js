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

    root.querySelector('[data-role="add-row-button"]').click();
    root.querySelector('[data-role="add-rows-above-button"]').click();
    root.querySelector('[data-role="add-rows-below-button"]').click();
    root.querySelector('[data-role="delete-selected-rows-button"]').click();
    root.querySelector('[data-role="clear-sort-button"]').click();
    root.querySelector('[data-role="clear-table-button"]').click();

    const filterInput = root.querySelector('[data-role="filter-text-input"]');
    filterInput.value = 'alpha';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    root.querySelector('[data-role="clear-filters-button"]').click();

    const uniqueNamesCheckbox = root.querySelector('[data-role="unique-column-names-checkbox"]');
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
    expect(root.querySelector('[data-role="filter-text-input"]').value).toBe('');
    expect(callbacks.onUniqueColumnNamesChange).toHaveBeenCalledWith(true);

    component.destroy();
  });

  test('renders rooted toolbar hooks while preserving legacy ids as compatibility contracts', () => {
    createGridToolbarComponent({
      root,
      documentObj: document,
    });

    expect(root.querySelector('[data-role="add-row-button"]')?.id).toBe('addRowButton');
    expect(root.querySelector('[data-role="filter-text-input"]')?.id).toBe('filter-text-box');
    expect(root.querySelector('[data-role="unique-column-names-checkbox"]')?.id).toBe('uniqueColumnNamesCheckbox');
  });

  test('private toolbar behavior still works when legacy child ids change', () => {
    const callbacks = {
      onAddRow: jest.fn(),
      onFilterTextChange: jest.fn(),
      onUniqueColumnNamesChange: jest.fn(),
    };

    createGridToolbarComponent({
      root,
      documentObj: document,
      callbacks,
    });

    const addRowButton = root.querySelector('[data-role="add-row-button"]');
    const filterInput = root.querySelector('[data-role="filter-text-input"]');
    const uniqueNamesCheckbox = root.querySelector('[data-role="unique-column-names-checkbox"]');

    addRowButton.id = 'changed-add-row-id';
    filterInput.id = 'changed-filter-id';
    uniqueNamesCheckbox.id = 'changed-unique-id';

    addRowButton.click();
    filterInput.value = 'beta';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    uniqueNamesCheckbox.checked = true;
    uniqueNamesCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(callbacks.onAddRow).toHaveBeenCalledTimes(1);
    expect(callbacks.onFilterTextChange).toHaveBeenCalledWith('beta');
    expect(callbacks.onUniqueColumnNamesChange).toHaveBeenCalledWith(true);
  });
});
