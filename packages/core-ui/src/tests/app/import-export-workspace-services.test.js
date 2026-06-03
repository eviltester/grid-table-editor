import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { jest } from '@jest/globals';
import {
  createPreviewTextFromDataTable,
  createPreviewTextFromGrid,
  limitDataTableRows,
  normalizePreviewRowLimit,
  previewThenImportToGrid,
} from '../../../js/gui_components/app/import-export-workspace/import-export-workspace-services.js';

function createTable(rowCount = 3) {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['Name']);
  for (let index = 0; index < rowCount; index += 1) {
    dataTable.appendDataRow([`Name ${index + 1}`]);
  }
  return dataTable;
}

describe('import-export workspace services', () => {
  test('normalizes and limits preview row counts', () => {
    expect(normalizePreviewRowLimit(0)).toBe(1);
    expect(normalizePreviewRowLimit(100)).toBe(50);
    expect(normalizePreviewRowLimit('bad', 12)).toBe(12);

    const limited = limitDataTableRows(createTable(4), 2);
    expect(limited.getHeaders()).toEqual(['Name']);
    expect(limited.getRowCount()).toBe(2);
  });

  test('renders preview text from grid or imported data tables', () => {
    const exporter = {
      canExport: () => true,
      getGridAsGenericDataTable: (limit) => createTable(limit),
      getDataTableAs: (type, dataTable) => `${type}:${dataTable.getRowCount()}`,
    };

    expect(createPreviewTextFromGrid({ exporter, type: 'csv', previewRowLimit: 3 })).toBe('csv:3');
    expect(
      createPreviewTextFromDataTable({
        exporter,
        type: 'json',
        dataTable: createTable(5),
        previewRowLimit: 2,
      })
    ).toBe('json:2');
  });

  test('previews imported text before applying the full data table to the grid', async () => {
    const dataTable = createTable(4);
    const importer = {
      toGenericDataTable: jest.fn(() => dataTable),
      setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
    };
    const exporter = {
      getDataTableAs: jest.fn((type, table) => `${type}:${table.getRowCount()}`),
    };
    const setPreviewText = jest.fn();
    const setImportStatus = jest.fn();
    const yieldToUi = jest.fn(async () => {});

    await previewThenImportToGrid({
      importer,
      exporter,
      type: 'csv',
      text: 'Name\nAda',
      previewRowLimit: 2,
      setPreviewText,
      setImportStatus,
      yieldToUi,
    });

    expect(setPreviewText).toHaveBeenCalledWith('csv:2');
    expect(setImportStatus).toHaveBeenCalledWith(
      'Preview loaded (first 2 items). Loading full data into grid...',
      true
    );
    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledWith(dataTable);
    expect(setImportStatus).toHaveBeenLastCalledWith('Import complete.', false);
    expect(yieldToUi).toHaveBeenCalledTimes(2);
  });
});
