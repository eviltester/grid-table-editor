import { GridExtension as GridExtensionTabulator } from '../../../js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

function createColumnComponent(definition) {
  return {
    getDefinition: () => definition,
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

    expect(tabulator.on).toHaveBeenCalledTimes(3);
    expect(tabulator.on).toHaveBeenNthCalledWith(1, 'cellEdited', expect.any(Function));
    expect(tabulator.on).toHaveBeenNthCalledWith(2, 'rowMoved', expect.any(Function));
    expect(tabulator.on).toHaveBeenNthCalledWith(3, 'columnMoved', expect.any(Function));
  });

  test('destroy unregisters shared tabulator grid-change listeners', () => {
    const tabulator = createTabulatorStub();
    const extension = new GridExtensionTabulator(tabulator);

    extension.destroy();

    expect(tabulator.off).toHaveBeenCalledTimes(3);
    expect(tabulator.off).toHaveBeenNthCalledWith(1, 'cellEdited', expect.any(Function));
    expect(tabulator.off).toHaveBeenNthCalledWith(2, 'rowMoved', expect.any(Function));
    expect(tabulator.off).toHaveBeenNthCalledWith(3, 'columnMoved', expect.any(Function));
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
});
