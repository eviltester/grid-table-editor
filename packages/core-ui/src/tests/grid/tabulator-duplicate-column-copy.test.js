import { jest } from '@jest/globals';
import { GridExtension as GridExtensionTabulator } from '../../../js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

function createColumnComponent(definition) {
  return {
    getDefinition: () => definition,
    setWidth: jest.fn(),
  };
}

function createTabulatorStub() {
  const columnDefinitions = [
    { title: 'Instructions', field: 'column1' },
    { title: 'Other', field: 'column2' },
  ];
  const rowData = [
    { column1: 'Alpha', column2: 'X' },
    { column1: 'Beta', column2: 'Y' },
  ];

  return {
    _rowData: rowData,
    _columnDefinitions: columnDefinitions,
    getColumnDefinitions() {
      return this._columnDefinitions;
    },
    getColumns() {
      return this._columnDefinitions.map((definition) => createColumnComponent(definition));
    },
    addColumn(column, addToLeft, existingColumn) {
      const existingField = existingColumn.getDefinition().field;
      const existingIndex = this._columnDefinitions.findIndex((definition) => definition.field === existingField);
      const insertIndex = addToLeft ? existingIndex : existingIndex + 1;
      this._columnDefinitions.splice(insertIndex, 0, column);
    },
    getData() {
      return this._rowData.map((row) => ({ ...row }));
    },
    setData(rows) {
      this._rowData = rows.map((row) => ({ ...row }));
    },
    on: jest.fn(),
    off: jest.fn(),
    redraw() {},
  };
}

describe('GridExtensionTabulator duplicate column', () => {
  test('binds tabulator change listeners only once per table across wrapper instances', () => {
    const tabulator = createTabulatorStub();
    new GridExtensionTabulator(tabulator);
    new GridExtensionTabulator(tabulator);

    expect(tabulator.on).toHaveBeenCalledTimes(4);
    expect(tabulator.on).toHaveBeenNthCalledWith(1, 'cellEdited', expect.any(Function));
    expect(tabulator.on).toHaveBeenNthCalledWith(2, 'rowMoved', expect.any(Function));
    expect(tabulator.on).toHaveBeenNthCalledWith(3, 'columnMoved', expect.any(Function));
    expect(tabulator.on).toHaveBeenNthCalledWith(4, 'dataFiltered', expect.any(Function));
  });

  test('destroy unregisters shared tabulator grid-change listeners', () => {
    const tabulator = createTabulatorStub();
    const extension = new GridExtensionTabulator(tabulator);
    const cellEditedCall = tabulator.on.mock.calls.find((call) => call[0] === 'cellEdited');
    const rowMovedCall = tabulator.on.mock.calls.find((call) => call[0] === 'rowMoved');
    const columnMovedCall = tabulator.on.mock.calls.find((call) => call[0] === 'columnMoved');
    const dataFilteredCall = tabulator.on.mock.calls.find((call) => call[0] === 'dataFiltered');
    expect(cellEditedCall).toBeDefined();
    expect(rowMovedCall).toBeDefined();
    expect(columnMovedCall).toBeDefined();
    expect(dataFilteredCall).toBeDefined();
    const cellEditedHandler = cellEditedCall[1];
    const rowMovedHandler = rowMovedCall[1];
    const columnMovedHandler = columnMovedCall[1];
    const dataFilteredHandler = dataFilteredCall[1];

    extension.destroy();

    expect(tabulator.off).toHaveBeenCalledTimes(4);
    expect(tabulator.off).toHaveBeenNthCalledWith(1, 'cellEdited', cellEditedHandler);
    expect(tabulator.off).toHaveBeenNthCalledWith(2, 'rowMoved', rowMovedHandler);
    expect(tabulator.off).toHaveBeenNthCalledWith(3, 'columnMoved', columnMovedHandler);
    expect(tabulator.off).toHaveBeenNthCalledWith(4, 'dataFiltered', dataFilteredHandler);
  });

  test('copies source column values into duplicate column', async () => {
    const tabulator = createTabulatorStub();
    const extension = new GridExtensionTabulator(tabulator);

    const sourceColumn = tabulator.getColumns()[0];
    await extension.duplicateColumn(1, sourceColumn, 'Instructions Copy');

    const duplicatedField = tabulator
      .getColumnDefinitions()
      .find((column) => column.title === 'Instructions Copy').field;
    expect(tabulator._rowData[0][duplicatedField]).toBe(tabulator._rowData[0].column1);
    expect(tabulator._rowData[1][duplicatedField]).toBe(tabulator._rowData[1].column1);
  });

  test('sizeColumnsToFit samples active rows instead of scanning the full data set', () => {
    const columnDefinitions = [{ title: 'Instructions', field: 'column1' }];
    const sampledRows = Array.from({ length: 500 }, (_, index) => ({
      column1: index === 499 ? '1234567890' : 'short',
    }));
    const ignoredLongRow = { column1: 'x'.repeat(200) };
    const rowData = [...sampledRows, ignoredLongRow];
    const columnComponent = createColumnComponent(columnDefinitions[0]);
    const tabulator = {
      _rowData: rowData,
      getColumnDefinitions() {
        return columnDefinitions;
      },
      getColumns() {
        return [columnComponent];
      },
      getRows(mode) {
        if (mode !== 'active') {
          return [];
        }
        return this._rowData.map((row) => ({
          getData: () => row,
        }));
      },
      getData: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      redraw() {},
    };
    const extension = new GridExtensionTabulator(tabulator);

    extension.sizeColumnsToFit();

    expect(columnComponent.setWidth).toHaveBeenCalledWith(128);
    expect(tabulator.getData).not.toHaveBeenCalled();
  });
});
