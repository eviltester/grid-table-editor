import { GridExtension as AgGridExtension } from '../../js/gui_components/data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import { GridExtension as TabulatorGridExtension } from '../../js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '../../js/grid/importer.js';
import { Exporter } from '../../js/grid/exporter.js';
import { GuardedColumnEdits } from '../../js/grid/guarded-column-edits.js';
import Papa from 'papaparse';

function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

class AgGridApiMock {
  constructor() {
    this.columnDefs = [{ headerName: '~rename-me', field: 'column1', colId: 'column1' }];
    this.rowData = [];
    this.selectedIndexes = [];
    this.quickFilterText = null;
    this.filterModel = null;
  }

  _normaliseColumnDefs(defs) {
    this.columnDefs = defs.map((col, index) => {
      return {
        ...col,
        colId: col.colId || col.field || `column${index + 1}`,
      };
    });
  }

  _makeNode(rowIndex) {
    const row = this.rowData[rowIndex];
    return {
      rowIndex,
      data: row,
      setDataValue: (fieldName, value) => {
        row[fieldName] = value;
      },
    };
  }

  setGridOption(option, value) {
    if (option === 'columnDefs') {
      this._normaliseColumnDefs(value);
    }
    if (option === 'rowData') {
      this.rowData = value.map((row) => ({ ...row }));
    }
    if (option === 'quickFilterText') {
      this.quickFilterText = value;
    }
  }

  setFilterModel(value) {
    this.filterModel = value;
  }

  getColumnDefs() {
    return this.columnDefs;
  }

  getColumnState() {
    return this.columnDefs.map((colDef) => ({ colId: colDef.colId }));
  }

  applyColumnState({ state }) {
    const ordered = [];
    state.forEach((entry) => {
      const match = this.columnDefs.find((colDef) => colDef.colId === entry.colId);
      if (match) {
        ordered.push(match);
      }
    });
    this.columnDefs = ordered;
  }

  forEachNode(callback) {
    this.rowData.forEach((_, rowIndex) => callback(this._makeNode(rowIndex)));
  }

  forEachNodeAfterFilterAndSort(callback) {
    this.forEachNode(callback);
  }

  applyTransaction(transaction) {
    if (transaction.remove) {
      const toRemove = new Set(transaction.remove);
      this.rowData = this.rowData.filter((row) => !toRemove.has(row));
      return;
    }

    if (transaction.add) {
      const rowsToAdd = transaction.add.map((row) => ({ ...row }));
      if (typeof transaction.addIndex === 'number') {
        this.rowData.splice(transaction.addIndex, 0, ...rowsToAdd);
        return;
      }
      this.rowData.push(...rowsToAdd);
    }
  }

  getSelectedNodes() {
    return this.selectedIndexes.map((index) => this._makeNode(index));
  }

  getSelectedRows() {
    return this.selectedIndexes.map((index) => this.rowData[index]);
  }

  getDisplayedRowCount() {
    return this.rowData.length;
  }

  getDisplayedRowAtIndex(index) {
    if (index < 0 || index >= this.rowData.length) {
      return undefined;
    }
    return this._makeNode(index);
  }
}

class TabulatorColumnMock {
  constructor(table, definition) {
    this.table = table;
    this.definition = definition;
  }

  getDefinition() {
    return this.definition;
  }

  updateDefinition(update) {
    Object.assign(this.definition, update);
    return Promise.resolve(this);
  }

  delete() {
    this.table.columnDefs = this.table.columnDefs.filter((col) => col !== this.definition);
  }

  move(targetField, moveAfter) {
    const fromIndex = this.table.columnDefs.indexOf(this.definition);
    const targetIndex = this.table.columnDefs.findIndex((col) => col.field === targetField);
    if (fromIndex < 0 || targetIndex < 0) {
      return;
    }
    this.table.columnDefs.splice(fromIndex, 1);
    const insertAt = moveAfter ? targetIndex + 1 : targetIndex;
    this.table.columnDefs.splice(insertAt, 0, this.definition);
  }
}

class TabulatorRowMock {
  constructor(table, data) {
    this.table = table;
    this.data = data;
  }

  getData() {
    return this.data;
  }

  update(patch) {
    Object.assign(this.data, patch);
  }

  getPosition() {
    return this.table.rowData.indexOf(this.data);
  }
}

class TabulatorApiMock {
  constructor() {
    this.columnDefs = [{ title: '~rename-me', field: 'column1' }];
    this.rowData = [];
    this.selectedIndexes = [];
    this.filterFn = null;
  }

  clearData() {
    this.rowData = [];
  }

  setColumns(defs) {
    this.columnDefs = defs.map((col) => ({ ...col }));
    return Promise.resolve();
  }

  setData(data) {
    this.rowData = data.map((row) => ({ ...row }));
    return Promise.resolve();
  }

  clearFilter() {
    this.filterFn = null;
  }

  setFilter(filterFn) {
    this.filterFn = filterFn;
  }

  getColumnDefinitions() {
    return this.columnDefs;
  }

  getRows() {
    return this.rowData.map((row) => new TabulatorRowMock(this, row));
  }

  addColumn(columnDef, addToLeft, existingColumn) {
    const newCol = { ...columnDef };
    if (!existingColumn) {
      this.columnDefs.push(newCol);
      return Promise.resolve();
    }

    const existingField = existingColumn.getDefinition().field;
    const existingIndex = this.columnDefs.findIndex((col) => col.field === existingField);
    const insertAt = addToLeft ? existingIndex : existingIndex + 1;
    this.columnDefs.splice(insertAt, 0, newCol);
    return Promise.resolve();
  }

  getSelectedRows() {
    return this.selectedIndexes.map((index) => new TabulatorRowMock(this, this.rowData[index]));
  }

  deleteRow(rows) {
    const selectedData = new Set(rows.map((row) => row.getData()));
    this.rowData = this.rowData.filter((row) => !selectedData.has(row));
  }

  getDataCount() {
    return this.rowData.length;
  }

  addData(rows, addAbove, relativeToRow) {
    const rowsToAdd = rows.map((row) => ({ ...row }));
    if (!relativeToRow) {
      if (addAbove) {
        this.rowData.unshift(...rowsToAdd);
      } else {
        this.rowData.push(...rowsToAdd);
      }
      return;
    }
    const relativeData = relativeToRow.getData();
    const idx = this.rowData.indexOf(relativeData);
    const insertAt = addAbove ? idx : idx + 1;
    this.rowData.splice(insertAt, 0, ...rowsToAdd);
  }

  getData(mode) {
    if (mode === 'active' && this.filterFn) {
      return this.rowData.filter((row) => this.filterFn(row));
    }
    return this.rowData;
  }

  getColumns() {
    return this.columnDefs.map((colDef) => new TabulatorColumnMock(this, colDef));
  }
}

function createGenericDataTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

function defineParityTests(label, createHarness) {
  describe(label, () => {
    test('clearGrid resets to a single default column', async () => {
      const { extension, api, getHeaders } = createHarness();
      extension.setGridFromGenericDataTable(createGenericDataTable(['A', 'B'], [['1', '2']]));
      await flushAsync();

      extension.clearGrid();
      await flushAsync();

      expect(getHeaders(api)).toEqual(['~rename-me']);
      expect(api.rowData.length).toBe(0);
    });

    test('filter API can set and clear text filters', async () => {
      const { extension, api, getFilterState } = createHarness();
      extension.filterText('bob');
      extension.clearFilters();
      await flushAsync();

      expect(getFilterState(api)).toEqual({
        text: null,
        columnFiltersCleared: true,
      });
    });

    test('createColumns creates titled fields and name lookup works', async () => {
      const { extension, api, getHeaders, getFields } = createHarness();
      extension.createColumns(['First', 'Second']);
      await flushAsync();

      expect(getHeaders(api)).toEqual(['First', 'Second']);
      expect(getFields(api)).toEqual(['column2', 'column3']);
      expect(extension.nameAlreadyExists('Second')).toBe(true);
      expect(extension.nameAlreadyExists('Missing')).toBe(false);
    });

    test('addRow adds a blank row with all fields', async () => {
      const { extension, api } = createHarness();
      extension.createColumns(['Only']);
      await flushAsync();
      extension.addRow();
      await flushAsync();

      expect(api.rowData.length).toBe(1);
      expect(Object.keys(api.rowData[0])).toEqual(['column2']);
      expect(api.rowData[0].column2).toBe('');
    });

    test('addRowsRelativeToSelection inserts one row per selected row', async () => {
      const { extension, api, setSelectedIndexes, getFields } = createHarness();
      extension.setGridFromGenericDataTable(createGenericDataTable(['Name'], [['A'], ['B'], ['C']]));
      await flushAsync();
      const firstField = getFields(api)[0];

      setSelectedIndexes(api, [1, 2]);
      extension.addRowsRelativeToSelection(-1);
      await flushAsync();

      expect(api.rowData.length).toBe(5);
      expect(api.rowData[1][firstField]).toBe('');
      expect(api.rowData[2][firstField]).toBe('');
    });

    test('addRowsRelativeToSelection supports no-selection add above and below', async () => {
      const { extension, api, getFields } = createHarness();
      extension.setGridFromGenericDataTable(createGenericDataTable(['Name'], [['A'], ['B']]));
      await flushAsync();
      const firstField = getFields(api)[0];

      extension.addRowsRelativeToSelection(-1);
      await flushAsync();
      expect(api.rowData[0][firstField]).toBe('');

      extension.addRowsRelativeToSelection(1);
      await flushAsync();
      expect(api.rowData[api.rowData.length - 1][firstField]).toBe('');
    });

    test('deleteSelectedRows removes selected rows', async () => {
      const { extension, api, setSelectedIndexes, getFields } = createHarness();
      extension.setGridFromGenericDataTable(createGenericDataTable(['Name'], [['A'], ['B'], ['C']]));
      await flushAsync();
      const firstField = getFields(api)[0];

      setSelectedIndexes(api, [1]);
      extension.deleteSelectedRows();
      await flushAsync();

      expect(api.rowData.map((row) => row[firstField])).toEqual(['A', 'C']);
    });

    test('column operations match expected behavior', async () => {
      const {
        extension,
        api,
        getHeaders,
        getColumnRefByIndex,
        getColumnRefByHeader,
        addNeighbourColumn,
        duplicateColumn,
        renameColumn,
        deleteColumn,
        appendColumn,
        moveColumn,
        getColumnDef,
      } = createHarness();

      extension.setGridFromGenericDataTable(createGenericDataTable(['First', 'Second'], [['A', '1']]));
      await flushAsync();

      const firstRef = getColumnRefByIndex(api, 0);
      addNeighbourColumn(extension, 1, firstRef, 'Third');
      await flushAsync();

      renameColumn(extension, firstRef, 'First Renamed');
      await flushAsync();

      const secondRef = getColumnRefByIndex(api, 1);
      duplicateColumn(extension, 1, secondRef, 'Second Copy');
      await flushAsync();

      const copyRef = getColumnRefByHeader(api, 'Second Copy');
      const movedRef = appendColumn(extension, 'Fourth');
      await flushAsync();
      moveColumn(extension, -1, copyRef, movedRef);
      await flushAsync();

      deleteColumn(extension, movedRef);
      await flushAsync();

      const headers = getHeaders(api);
      expect(headers).toContain('First Renamed');
      expect(headers).toContain('Second Copy');
      expect(headers).not.toContain('Fourth');
      expect(getColumnDef(extension, firstRef)).toBeDefined();
    });

    test('duplicate column copies underlying row values', async () => {
      const { extension, api, getColumnRefByIndex, getColumnRefByHeader, duplicateColumn, getFields } = createHarness();

      extension.setGridFromGenericDataTable(
        createGenericDataTable(
          ['First', 'Second'],
          [
            ['A', '1'],
            ['B', '2'],
          ]
        )
      );
      await flushAsync();

      const secondRef = getColumnRefByIndex(api, 1);
      duplicateColumn(extension, 1, secondRef, 'Second Copy');
      await flushAsync();

      const sourceField = getFields(api)[1];
      const copyRef = getColumnRefByHeader(api, 'Second Copy');
      const copyField =
        typeof copyRef === 'string' ? extension.getColumnDef(copyRef).field : copyRef.getDefinition().field;

      expect(api.rowData[0][copyField]).toBe(api.rowData[0][sourceField]);
      expect(api.rowData[1][copyField]).toBe(api.rowData[1][sourceField]);
    });

    test('add neighbour with blank title is a no-op', async () => {
      const { extension, api, getColumnRefByIndex, addNeighbourColumn, getHeaders } = createHarness();

      extension.setGridFromGenericDataTable(createGenericDataTable(['First'], [['A']]));
      await flushAsync();
      const before = [...getHeaders(api)];
      const firstRef = getColumnRefByIndex(api, 0);

      addNeighbourColumn(extension, 1, firstRef, '');
      await flushAsync();

      expect(getHeaders(api)).toEqual(before);
    });

    test('setGridFromGenericDataTable and export preserve headers and rows', async () => {
      const { extension } = createHarness();
      const input = createGenericDataTable(['Instructions'], [['Reset Table'], ['Click Add Row']]);

      extension.setGridFromGenericDataTable(input);
      await flushAsync();

      expect(extension.getHeadersFromGrid()).toEqual(['Instructions']);
      const exported = extension.getGridAsGenericDataTable();
      expect(exported.getHeaders()).toEqual(['Instructions']);
      expect(exported.getRowCount()).toBe(2);
      expect(exported.getRow(0)).toEqual(['Reset Table']);
      expect(exported.getRow(1)).toEqual(['Click Add Row']);
    });

    test('getNextFieldNumber increments from highest numeric suffix', async () => {
      const { extension, api, setColumns } = createHarness();
      setColumns(api, [
        { title: 'x', headerName: 'x', field: 'column1' },
        { title: 'y', headerName: 'y', field: 'column7' },
      ]);
      await flushAsync();

      expect(extension.getNextFieldNumber()).toBe(8);
    });

    test('selection and column counts are reported', async () => {
      const { extension, api, setSelectedIndexes } = createHarness();
      extension.setGridFromGenericDataTable(
        createGenericDataTable(
          ['ColA', 'ColB'],
          [
            ['1', '2'],
            ['3', '4'],
          ]
        )
      );
      await flushAsync();
      setSelectedIndexes(api, [0, 1]);

      expect(extension.getNumberOfColumns()).toBe(2);
      expect(extension.getNumberOfSelectedRows()).toBe(2);
    });
  });
}

beforeAll(() => {
  global.Papa = Papa;
});

defineParityTests('AG Grid extension parity contract', () => {
  const api = new AgGridApiMock();
  const extension = new AgGridExtension(api);

  return {
    extension,
    api,
    getHeaders: (gridApi) => gridApi.getColumnDefs().map((col) => col.headerName),
    getFields: (gridApi) => gridApi.getColumnDefs().map((col) => col.field),
    getFilterState: (gridApi) => {
      return {
        text: gridApi.quickFilterText,
        columnFiltersCleared: gridApi.filterModel === null,
      };
    },
    setSelectedIndexes: (gridApi, indexes) => {
      gridApi.selectedIndexes = indexes;
    },
    setColumns: (gridApi, columns) => {
      const defs = columns.map((col, index) => ({
        headerName: col.headerName || col.title,
        field: col.field,
        colId: col.colId || col.field || `column${index + 1}`,
      }));
      gridApi.setGridOption('columnDefs', defs);
    },
    getColumnRefByIndex: (gridApi, index) => gridApi.getColumnDefs()[index].colId,
    getColumnRefByField: (gridApi, fieldName) => {
      const col = gridApi.getColumnDefs().find((def) => def.field === fieldName);
      return col?.colId;
    },
    getColumnRefByHeader: (gridApi, headerName) => {
      const col = gridApi.getColumnDefs().find((def) => def.headerName === headerName);
      return col?.colId;
    },
    addNeighbourColumn: (extension, position, columnRef, colTitle) => {
      extension.addNeighbourColumnId(position, columnRef, colTitle);
    },
    duplicateColumn: (extension, position, columnRef, colTitle) => {
      extension.duplicateColumn(position, columnRef, colTitle);
    },
    renameColumn: (extension, columnRef, newName) => {
      extension.renameColId(columnRef, newName);
    },
    deleteColumn: (extension, columnRef) => {
      extension.deleteColumnId(columnRef);
    },
    appendColumn: (extension, colTitle) => {
      const colDef = extension.appendColumnToGrid(colTitle);
      return colDef.colId || colDef.field;
    },
    moveColumn: (extension, position, id, columnToMoveRef) => {
      const colDef = extension.getColumnDef(columnToMoveRef);
      extension.moveColumnTo(position, id, colDef);
    },
    getColumnDef: (extension, columnRef) => {
      return extension.getColumnDef(columnRef);
    },
  };
});

defineParityTests('Tabulator extension parity contract', () => {
  const api = new TabulatorApiMock();
  const extension = new TabulatorGridExtension(api);

  return {
    extension,
    api,
    getHeaders: (tabulator) => tabulator.getColumnDefinitions().map((col) => col.title),
    getFields: (tabulator) => tabulator.getColumnDefinitions().map((col) => col.field),
    getFilterState: (tabulator) => {
      return {
        text: null,
        columnFiltersCleared: tabulator.filterFn === null,
      };
    },
    setSelectedIndexes: (tabulator, indexes) => {
      tabulator.selectedIndexes = indexes;
    },
    setColumns: (tabulator, columns) => {
      const defs = columns.map((col, index) => ({
        title: col.title || col.headerName,
        field: col.field || `column${index + 1}`,
      }));
      tabulator.setColumns(defs);
    },
    getColumnRefByIndex: (tabulator, index) => tabulator.getColumns()[index],
    getColumnRefByField: (tabulator, fieldName) => {
      return tabulator.getColumns().find((column) => {
        return column.getDefinition().field === fieldName;
      });
    },
    getColumnRefByHeader: (tabulator, headerName) => {
      return tabulator.getColumns().find((column) => {
        return column.getDefinition().title === headerName;
      });
    },
    addNeighbourColumn: (extension, position, columnRef, colTitle) => {
      extension.addNeighbourColumn(position, columnRef, colTitle);
    },
    duplicateColumn: (extension, position, columnRef, colTitle) => {
      extension.duplicateColumn(position, columnRef, colTitle);
    },
    renameColumn: (extension, columnRef, newName) => {
      extension.renameColumn(columnRef, newName);
    },
    deleteColumn: (extension, columnRef) => {
      extension.deleteColumn(columnRef);
    },
    appendColumn: (extension, colTitle) => {
      const colDef = extension.appendColumnToGrid(colTitle);
      return extension.tabulator.getColumns().find((column) => {
        return column.getDefinition().field === colDef.field;
      });
    },
    moveColumn: (extension, position, id, columnToMoveRef) => {
      const targetId = typeof id === 'string' ? id : id.getDefinition().field;
      extension.moveColumnTo(position, targetId, columnToMoveRef);
    },
    getColumnDef: (extension, columnRef) => {
      const definition = columnRef?.getDefinition?.();
      return extension.getColumnDef(definition?.field);
    },
  };
});

describe('Shared grid interface contract (both implementations)', () => {
  const harnessFactories = [
    [
      'ag-grid',
      () => {
        const api = new AgGridApiMock();
        const extension = new AgGridExtension(api);
        return { api, extension };
      },
    ],
    [
      'tabulator',
      () => {
        const api = new TabulatorApiMock();
        const extension = new TabulatorGridExtension(api);
        return { api, extension };
      },
    ],
  ];

  const requiredMethods = [
    'clearGrid',
    'clearFilters',
    'filterText',
    'createColumns',
    'getNumberOfColumns',
    'getNumberOfSelectedRows',
    'getRowCount',
    'getSelectedRowIndexes',
    'addRow',
    'addRowsRelativeToSelection',
    'deleteSelectedRows',
    'getGridAsGenericDataTable',
    'getHeadersFromGrid',
    'setGridFromGenericDataTable',
    'applyGeneratedSchemaAmend',
  ];

  const agStyleIdMethods = ['addNeighbourColumnId', 'renameColId', 'deleteColumnId', 'getColumnDef'];

  test.each(harnessFactories)('%s exposes shared interface methods', async (_name, createHarness) => {
    const { extension } = createHarness();
    requiredMethods.forEach((methodName) => {
      expect(typeof extension[methodName]).toBe('function');
    });
    agStyleIdMethods.forEach((methodName) => {
      expect(typeof extension[methodName]).toBe('function');
    });
  });

  test.each(['markdown', 'csv', 'json'])(
    'import/export round trip for %s matches between implementations',
    async (dataType) => {
      const markdownInput = `| Instructions |\n|---|\n| Reset Table |\n| Add Row |`;

      const runFlow = async (createHarness) => {
        const { extension } = createHarness();
        const importer = new Importer(extension);
        const exporter = new Exporter(extension);

        importer.importText('markdown', markdownInput);
        await flushAsync();
        await flushAsync();

        return exporter.getGridAs(dataType);
      };

      const agOutput = await runFlow(harnessFactories[0][1]);
      const tabOutput = await runFlow(harnessFactories[1][1]);

      expect(tabOutput).toBe(agOutput);
    }
  );

  test.each(harnessFactories)(
    '%s supports AG-style guarded id operations through shared interface',
    async (_name, createHarness) => {
      const { api, extension } = createHarness();
      const guarded = new GuardedColumnEdits(extension);

      extension.setGridFromGenericDataTable(createGenericDataTable(['First', 'Second'], [['A', '1']]));
      await flushAsync();
      await flushAsync();

      const firstCol = extension.getGridAsGenericDataTable().getHeaders()[0];
      expect(firstCol).toBe('First');

      const firstColId =
        extension.getColumnDef('column1')?.colId || extension.getColumnDef('column2')?.colId || 'column1';

      global.prompt = jest
        .fn()
        .mockReturnValueOnce('Neighbour')
        .mockReturnValueOnce('Renamed First')
        .mockReturnValueOnce('Second Copy');
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();

      guarded.addNeighbourColumnId(1, firstColId);
      await flushAsync();
      guarded.renameColId(firstColId);
      await flushAsync();
      guarded.duplicateColumnId(1, firstColId);
      await flushAsync();

      const headers = extension.getHeadersFromGrid();
      expect(headers).toContain('Renamed First');
      expect(headers).toContain('Neighbour');
      expect(headers).toContain('Second Copy');

      expect(extension.getNumberOfColumns()).toBeGreaterThanOrEqual(4);
      expect(api.rowData.length).toBe(1);
    }
  );

  test.each(harnessFactories)(
    '%s exposes row count and selected indexes for test-data amend modes',
    async (_name, createHarness) => {
      const { api, extension } = createHarness();
      extension.setGridFromGenericDataTable(createGenericDataTable(['A'], [['r0'], ['r1'], ['r2']]));
      await flushAsync();
      await flushAsync();

      api.selectedIndexes = [2, 0];
      expect(extension.getRowCount()).toBe(3);
      expect(extension.getSelectedRowIndexes()).toEqual([0, 2]);
    }
  );

  test.each(harnessFactories)(
    '%s applies direct schema amend without replacing untouched columns',
    async (_name, createHarness) => {
      const { api, extension } = createHarness();
      extension.setGridFromGenericDataTable(
        createGenericDataTable(
          ['keep', 'name'],
          [
            ['k0', 'old0'],
            ['k1', 'old1'],
          ]
        )
      );
      await flushAsync();
      await flushAsync();

      const rows = [
        ['new0', 'extra0'],
        ['new1', 'extra1'],
      ];
      let cursor = 0;
      const result = await extension.applyGeneratedSchemaAmend({
        mode: 'amend-table',
        desiredRowCount: 2,
        schemaHeaders: ['name', 'extra'],
        generateRow: () => rows[cursor++],
      });

      expect(result.noSelectedRows).toBe(false);
      const fields = Array.isArray(api.getColumnDefs?.())
        ? api.getColumnDefs().map((definition) => definition.field)
        : api.getColumnDefinitions().map((definition) => definition.field);
      const keepField = fields[0];
      const nameField = fields[1];
      const extraField = fields[2];
      expect(api.rowData[0][keepField]).toBe('k0');
      expect(api.rowData[0][nameField]).toBe('new0');
      expect(api.rowData[0][extraField]).toBe('extra0');
      expect(api.rowData[1][keepField]).toBe('k1');
      expect(api.rowData[1][nameField]).toBe('new1');
      expect(api.rowData[1][extraField]).toBe('extra1');
    }
  );
});
