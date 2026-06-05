import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { jest } from '@jest/globals';
import {
  createDownloadService,
  createPreviewTextFromDataTable,
  createPreviewTextFromGrid,
  createYieldToUi,
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

  test('passes injected browser dependencies through the download service to the Download adapter', () => {
    const documentObj = { body: {} };
    const URLObj = { createObjectURL: jest.fn(), revokeObjectURL: jest.fn() };
    const BlobCtor = jest.fn();
    const downloadFile = jest.fn();
    const DownloadCtor = jest.fn(function MockDownload(filename, options) {
      this.filename = filename;
      this.options = options;
      this.downloadFile = downloadFile;
    });

    const downloadService = createDownloadService({
      DownloadCtor,
      documentObj,
      URLObj,
      BlobCtor,
    });

    downloadService.downloadText('export.csv', 'id,name');

    expect(DownloadCtor).toHaveBeenCalledWith('export.csv', {
      documentObj,
      URLObj,
      BlobCtor,
    });
    expect(downloadFile).toHaveBeenCalledWith('id,name');
  });

  test('prefers injected scheduling callbacks over ambient globals in yield-to-ui', async () => {
    const scheduledAnimationFrames = [];
    const scheduledTimeouts = [];
    const requestAnimationFrameFn = jest.fn((callback) => {
      scheduledAnimationFrames.push(callback);
      return 'frame-1';
    });
    const setTimeoutFn = jest.fn((callback, delayMs) => {
      scheduledTimeouts.push({ callback, delayMs });
      callback();
      return 'timer-1';
    });
    const ambientRequestAnimationFrame = jest.fn();
    const ambientSetTimeout = global.setTimeout;
    global.requestAnimationFrame = ambientRequestAnimationFrame;
    global.setTimeout = jest.fn();

    try {
      const yieldToUi = createYieldToUi({
        requestAnimationFrameFn,
        setTimeoutFn,
      });

      const promise = yieldToUi();
      expect(scheduledAnimationFrames).toHaveLength(1);
      scheduledAnimationFrames[0]();
      await promise;

      expect(requestAnimationFrameFn).toHaveBeenCalledTimes(1);
      expect(setTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 0);
      expect(ambientRequestAnimationFrame).not.toHaveBeenCalled();
      expect(global.setTimeout).not.toHaveBeenCalled();
      expect(scheduledTimeouts).toHaveLength(1);
    } finally {
      delete global.requestAnimationFrame;
      global.setTimeout = ambientSetTimeout;
    }
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

  test('throws when preview import cannot apply the full data table to the grid', async () => {
    const dataTable = createTable(2);
    const importer = {
      toGenericDataTable: jest.fn(() => dataTable),
    };
    const exporter = {
      getDataTableAs: jest.fn((type, table) => `${type}:${table.getRowCount()}`),
    };
    const setPreviewText = jest.fn();
    const setImportStatus = jest.fn();

    await expect(
      previewThenImportToGrid({
        importer,
        exporter,
        type: 'csv',
        text: 'Name\nAda',
        previewRowLimit: 1,
        setPreviewText,
        setImportStatus,
      })
    ).rejects.toThrow('Unable to apply imported data to grid.');

    expect(setPreviewText).toHaveBeenCalledWith('csv:1');
    expect(setImportStatus).not.toHaveBeenCalledWith('Import complete.', false);
  });
});
