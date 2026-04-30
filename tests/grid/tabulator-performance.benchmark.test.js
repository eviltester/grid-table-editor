import { performance } from 'perf_hooks';
import { GridExtension as TabulatorGridExtension } from '../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

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
    this.redrawBlockDepth = 0;
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

  blockRedraw() {
    this.redrawBlockDepth += 1;
  }

  restoreRedraw() {
    if (this.redrawBlockDepth > 0) {
      this.redrawBlockDepth -= 1;
    }
  }
}

function makeDataTable(rowCount, columnCount) {
  const table = new GenericDataTable();
  const headers = Array.from({ length: columnCount }, (_, idx) => `Col ${idx + 1}`);
  table.setHeaders(headers);

  for (let row = 0; row < rowCount; row++) {
    const values = Array.from({ length: columnCount }, (_, col) => `r${row}-c${col}`);
    table.appendDataRow(values);
  }
  return table;
}

async function flushAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function measureMs(fn) {
  const start = performance.now();
  await fn();
  return performance.now() - start;
}

describe('Tabulator benchmark (large data)', () => {
  jest.setTimeout(120000);

  test('reports timing for key extension operations', async () => {
    const scenarios = [
      { rows: 10000, cols: 12 },
      { rows: 25000, cols: 12 },
    ];

    const measurements = [];

    for (const scenario of scenarios) {
      const api = new TabulatorApiMock();
      const extension = new TabulatorGridExtension(api);
      const sourceTable = makeDataTable(scenario.rows, scenario.cols);

      const importMs = await measureMs(async () => {
        extension.setGridFromGenericDataTable(sourceTable);
        await flushAsync();
        await flushAsync();
      });

      const filterMs = await measureMs(async () => {
        extension.filterText('r9999-c1');
        api.getData('active');
      });

      const createColsMs = await measureMs(async () => {
        extension.createColumns(['A', 'B', 'C', 'D']);
      });

      const duplicateMs = await measureMs(async () => {
        const columnToCopy = api.getColumns()[1];
        extension.duplicateColumn(1, columnToCopy, 'B copy');
      });

      const exportMs = await measureMs(async () => {
        extension.getGridAsGenericDataTable();
      });

      measurements.push({
        rows: scenario.rows,
        cols: scenario.cols,
        importMs: Number(importMs.toFixed(2)),
        filterMs: Number(filterMs.toFixed(2)),
        createColsMs: Number(createColsMs.toFixed(2)),
        duplicateMs: Number(duplicateMs.toFixed(2)),
        exportMs: Number(exportMs.toFixed(2)),
      });
    }

    // eslint-disable-next-line no-console
    console.table(measurements);

    expect(measurements.length).toBe(2);
    measurements.forEach((entry) => {
      expect(entry.importMs).toBeGreaterThan(0);
      expect(entry.filterMs).toBeGreaterThan(0);
      expect(entry.createColsMs).toBeGreaterThan(0);
      expect(entry.duplicateMs).toBeGreaterThan(0);
      expect(entry.exportMs).toBeGreaterThan(0);
    });
  });
});
