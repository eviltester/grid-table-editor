import { jest } from '@jest/globals';
import * as gridToolbarExports from '../../../js/gui_components/data-grid-editor/grid-toolbar/index.js';
import { GridToolbarController } from '../../../js/gui_components/data-grid-editor/grid-toolbar/grid-toolbar-controller.js';

describe('GridToolbarController', () => {
  test('public barrel is component-factory-only', () => {
    expect(typeof gridToolbarExports.createGridToolbarComponent).toBe('function');
    expect(gridToolbarExports.GridToolbarController).toBeUndefined();
    expect(gridToolbarExports.GridToolbarView).toBeUndefined();
  });

  test('tracks filter text and unique-column-name state while emitting toolbar intent callbacks', () => {
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

    const controller = new GridToolbarController({
      props: {
        filterText: '',
        uniqueColumnNames: false,
      },
      callbacks,
    });

    controller.triggerAddRow();
    controller.triggerAddRowsAbove();
    controller.triggerAddRowsBelow();
    controller.triggerDeleteSelectedRows();
    controller.triggerClearSort();
    controller.triggerClearTable();
    controller.setFilterText('alpha');
    controller.setUniqueColumnNames(true);
    controller.triggerClearFilters();

    expect(callbacks.onAddRow).toHaveBeenCalledTimes(1);
    expect(callbacks.onAddRowsAbove).toHaveBeenCalledTimes(1);
    expect(callbacks.onAddRowsBelow).toHaveBeenCalledTimes(1);
    expect(callbacks.onDeleteSelectedRows).toHaveBeenCalledTimes(1);
    expect(callbacks.onClearSort).toHaveBeenCalledTimes(1);
    expect(callbacks.onClearTable).toHaveBeenCalledTimes(1);
    expect(callbacks.onFilterTextChange).toHaveBeenCalledWith('alpha');
    expect(callbacks.onUniqueColumnNamesChange).toHaveBeenCalledWith(true);
    expect(callbacks.onClearFilters).toHaveBeenCalledTimes(1);
    expect(controller.getState()).toEqual({
      filterText: '',
      uniqueColumnNames: true,
    });
  });
});
