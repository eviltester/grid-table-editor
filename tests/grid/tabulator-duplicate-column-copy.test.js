import { GridExtension as GridExtensionTabulator } from '../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

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
    redraw() {},
  };
}

describe('GridExtensionTabulator duplicate column', () => {
  test('copies source column values into duplicate column', () => {
    const tabulator = createTabulatorStub();
    const extension = new GridExtensionTabulator(tabulator);

    const sourceColumn = tabulator.getColumns()[0];
    extension.duplicateColumn(1, sourceColumn, 'Instructions Copy');

    const duplicatedField = tabulator
      .getColumnDefinitions()
      .find((column) => column.title === 'Instructions Copy').field;
    expect(tabulator._rowData[0][duplicatedField]).toBe(tabulator._rowData[0].column1);
    expect(tabulator._rowData[1][duplicatedField]).toBe(tabulator._rowData[1].column1);
  });
});
