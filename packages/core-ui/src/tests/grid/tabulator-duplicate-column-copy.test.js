import { jest } from '@jest/globals';
import { GridExtension as GridExtensionTabulator } from '../../../js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';
import { TabulatorHelper } from '../../../js/gui_components/data-grid-editor/tabulator/tabulator-helpers.js';

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

function createGenericDataTable({ headers, rows }) {
  return {
    getColumnCount: () => headers.length,
    getHeaders: () => headers,
    getRowCount: () => rows.length,
    getRowAsObjectUsingHeadings: (rowIndex, fieldNames) =>
      Object.fromEntries(fieldNames.map((fieldName, index) => [fieldName, rows[rowIndex][index]])),
  };
}

function addFilterSupport(tabulator) {
  tabulator._filterPredicate = null;
  tabulator._activeRows = tabulator._rowData;
  tabulator.setFilter = jest.fn((predicate) => {
    tabulator._filterPredicate = predicate;
    tabulator.refreshFilter();
  });
  tabulator.clearFilter = jest.fn(() => {
    tabulator._filterPredicate = null;
    tabulator._activeRows = tabulator._rowData;
  });
  tabulator.refreshFilter = jest.fn(() => {
    tabulator._activeRows =
      typeof tabulator._filterPredicate === 'function'
        ? tabulator._rowData.filter((row) => tabulator._filterPredicate(row))
        : tabulator._rowData;
  });
  tabulator.getData = jest.fn((mode) => {
    if (mode === 'active') {
      return tabulator._activeRows;
    }
    return tabulator._rowData.map((row) => ({ ...row }));
  });
  tabulator.getDataCount = jest.fn((mode) => {
    if (mode === 'active') {
      return tabulator._activeRows.length;
    }
    return tabulator._rowData.length;
  });
}

describe('GridExtensionTabulator duplicate column', () => {
  test('tabulator helper returns the underlying addData result for row insertion helpers', () => {
    const addDataResult = Promise.resolve('row-added');
    const tabulator = {
      addData: jest.fn(() => addDataResult),
    };
    const helper = new TabulatorHelper(tabulator);
    const rowToAdd = { column1: 'Alpha' };

    expect(helper.addRowToBottom(rowToAdd)).toBe(addDataResult);
    expect(helper.addRowToTop(rowToAdd)).toBe(addDataResult);
    expect(tabulator.addData).toHaveBeenNthCalledWith(1, [rowToAdd], false);
    expect(tabulator.addData).toHaveBeenNthCalledWith(2, [rowToAdd], true);
  });

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

  test('addRow waits for async row insertion before notifying grid change listeners', async () => {
    let resolveAddData;
    const addDataPromise = new Promise((resolve) => {
      resolveAddData = resolve;
    });
    const tabulator = {
      getColumnDefinitions() {
        return [{ title: 'Instructions', field: 'column1' }];
      },
      addData: jest.fn(() => addDataPromise),
      on: jest.fn(),
      off: jest.fn(),
    };
    const extension = new GridExtensionTabulator(tabulator);
    const gridChanged = jest.fn();
    extension.onGridChanged(gridChanged);

    const addRowPromise = extension.addRow();

    expect(gridChanged).not.toHaveBeenCalled();

    resolveAddData();
    await addRowPromise;

    expect(gridChanged).toHaveBeenCalledTimes(1);
  });

  test('setGridFromGenericDataTable refreshes active filters after replacing data', async () => {
    const tabulator = createTabulatorStub();
    tabulator.setColumns = jest.fn((columns) => {
      tabulator._columnDefinitions = columns;
    });
    tabulator.setData = jest.fn((rows) => {
      tabulator._rowData = rows;
    });
    addFilterSupport(tabulator);
    tabulator.getColumn = jest.fn(() => createColumnComponent(tabulator._columnDefinitions[0]));
    const extension = new GridExtensionTabulator(tabulator);

    extension.filterText('200');
    expect(tabulator.getData('active')).toEqual([]);

    await extension.setGridFromGenericDataTable(
      createGenericDataTable({
        headers: ['CaseId'],
        rows: [['100'], ['200']],
      })
    );

    expect(tabulator.refreshFilter).toHaveBeenCalledTimes(2);
    expect(tabulator.getData('active')).toEqual([{ column1: '200' }]);
  });

  test('applyGeneratedSchemaAmend refreshes active filters after mutating visible rows', async () => {
    const tabulator = createTabulatorStub();
    tabulator._columnDefinitions = [{ title: 'CaseId', field: 'column1' }];
    tabulator._rowData = [{ column1: '2' }, { column1: '3' }];
    tabulator.refreshData = jest.fn();
    addFilterSupport(tabulator);
    const extension = new GridExtensionTabulator(tabulator);

    extension.filterText('2');
    expect(tabulator.getData('active')).toEqual([{ column1: '2' }]);

    await extension.applyGeneratedSchemaAmend({
      mode: 'amend-table',
      desiredRowCount: 1,
      schemaHeaders: ['CaseId'],
      generateRow: () => ['100'],
    });

    expect(tabulator._rowData).toEqual([{ column1: '100' }, { column1: '3' }]);
    expect(tabulator.getData('active')).toEqual([]);
    expect(tabulator.refreshData).toHaveBeenCalledTimes(1);
    expect(tabulator.refreshFilter).toHaveBeenCalledTimes(2);
  });
});
