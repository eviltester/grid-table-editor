import { jest } from '@jest/globals';
import { DataGridComponentController } from '../../../js/gui_components/data-grid-editor/data-grid-component-controller.js';

describe('DataGridComponentController', () => {
  test('proxies toolbar actions to grid extras and keeps filter state in sync', async () => {
    const gridExtras = {
      addRow: jest.fn(),
      addRowsRelativeToSelection: jest.fn(),
      getNumberOfSelectedRows: jest.fn(() => 1),
      deleteSelectedRows: jest.fn(),
      clearFilters: jest.fn(),
      clearSort: jest.fn(),
      filterText: jest.fn(),
      clearGrid: jest.fn(),
    };

    const controller = new DataGridComponentController({
      services: {
        getGridExtras: () => gridExtras,
        requestConfirm: jest.fn(async () => true),
      },
    });

    controller.addRow();
    controller.addRows(-1);
    controller.addRows(1);
    controller.setFilterText('alpha');
    controller.clearFilters();
    controller.clearSort();
    await controller.deleteSelectedRows();
    await controller.clearTable();

    expect(gridExtras.addRow).toHaveBeenCalledTimes(1);
    expect(gridExtras.addRowsRelativeToSelection).toHaveBeenNthCalledWith(1, -1);
    expect(gridExtras.addRowsRelativeToSelection).toHaveBeenNthCalledWith(2, 1);
    expect(gridExtras.filterText).toHaveBeenCalledWith('alpha');
    expect(gridExtras.clearFilters).toHaveBeenCalledTimes(1);
    expect(gridExtras.clearSort).toHaveBeenCalledTimes(1);
    expect(gridExtras.deleteSelectedRows).toHaveBeenCalledTimes(1);
    expect(gridExtras.clearGrid).toHaveBeenCalledTimes(1);
    expect(controller.getState().filterText).toBe('');
  });

  test('skips delete when no rows are selected', async () => {
    const gridExtras = {
      getNumberOfSelectedRows: jest.fn(() => 0),
      deleteSelectedRows: jest.fn(),
    };

    const controller = new DataGridComponentController({
      services: {
        getGridExtras: () => gridExtras,
        requestConfirm: jest.fn(async () => true),
      },
    });

    await controller.deleteSelectedRows();
    expect(gridExtras.deleteSelectedRows).not.toHaveBeenCalled();
  });
});
