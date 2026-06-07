import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Download } from '../../shared/download.js';
import { resolveWindowObj } from '../../shared/dom/default-objects.js';
import { scheduleTimeout } from '../../shared/unref-timeout.js';

const DEFAULT_PREVIEW_ROW_LIMIT = 10;
const MIN_PREVIEW_ROW_LIMIT = 1;
const MAX_PREVIEW_ROW_LIMIT = 50;

function normalizePreviewRowLimit(previewRowLimit, fallback = DEFAULT_PREVIEW_ROW_LIMIT) {
  const parsed = Number.parseInt(previewRowLimit, 10);
  const fallbackParsed = Number.parseInt(fallback, 10);
  const fallbackValue = Number.isFinite(fallbackParsed) ? fallbackParsed : DEFAULT_PREVIEW_ROW_LIMIT;
  const value = Number.isFinite(parsed) ? parsed : fallbackValue;
  return Math.min(Math.max(value, MIN_PREVIEW_ROW_LIMIT), MAX_PREVIEW_ROW_LIMIT);
}

function limitDataTableRows(dataTable, maxRows) {
  const limited = new GenericDataTable();
  if (!dataTable) {
    return limited;
  }

  limited.setHeaders(dataTable.getHeaders?.() || []);
  const rowCount = dataTable.getRowCount?.() || 0;
  const limit = Math.min(Math.max(Number.parseInt(maxRows, 10) || 0, 0), rowCount);
  for (let rowIndex = 0; rowIndex < limit; rowIndex += 1) {
    limited.appendDataRow(dataTable.getRow(rowIndex));
  }
  return limited;
}

function createPreviewTextFromGrid({ exporter, type, previewRowLimit }) {
  if (!exporter?.canExport?.(type)) {
    return '';
  }
  if (typeof exporter.getGridAsGenericDataTable === 'function') {
    const previewDataTable = exporter.getGridAsGenericDataTable(previewRowLimit);
    return exporter.getDataTableAs(type, previewDataTable);
  }
  return exporter.getGridAs?.(type) || '';
}

function createFullTextFromGrid({ exporter, type }) {
  if (!exporter?.canExport?.(type)) {
    return '';
  }
  return exporter.getGridAs?.(type) || '';
}

function normalizeImportedTextContent(text) {
  const rawText = typeof text === 'string' ? text : String(text ?? '');
  return rawText.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function createPreviewTextFromDataTable({ exporter, type, dataTable, previewRowLimit }) {
  const limitedDataTable = limitDataTableRows(dataTable, previewRowLimit);
  return exporter?.getDataTableAs?.(type, limitedDataTable) || '';
}

function createClipboardService({ documentObj, windowObj } = {}) {
  const getClipboard = () =>
    resolveWindowObj(windowObj, documentObj)?.navigator?.clipboard || globalThis.navigator?.clipboard;

  return {
    copyFromTextArea(textArea) {
      if (!textArea) {
        return;
      }

      textArea.select();
      textArea.setSelectionRange(0, 99999);
      documentObj?.execCommand?.('copy');
    },
    canReadText() {
      return typeof getClipboard()?.readText === 'function';
    },
    async readText() {
      const clipboard = getClipboard();
      if (typeof clipboard?.readText !== 'function') {
        throw new Error('Clipboard read is not available in this browser.');
      }
      return clipboard.readText();
    },
  };
}

function createDownloadService({ DownloadCtor = Download, documentObj, URLObj, BlobCtor } = {}) {
  return {
    downloadText(filename, text) {
      new DownloadCtor(filename, { documentObj, URLObj, BlobCtor }).downloadFile(text);
    },
  };
}

function createYieldToUi({ documentObj, windowObj, requestAnimationFrameFn, setTimeoutFn } = {}) {
  return () =>
    new Promise((resolve) => {
      const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
      const resolvedRequestAnimationFrameFn =
        requestAnimationFrameFn || resolvedWindowObj?.requestAnimationFrame?.bind(resolvedWindowObj);
      const resolvedSetTimeoutFn =
        setTimeoutFn || resolvedWindowObj?.setTimeout?.bind(resolvedWindowObj) || globalThis.setTimeout;
      if (typeof resolvedRequestAnimationFrameFn !== 'function') {
        resolvedSetTimeoutFn(resolve, 0);
        return;
      }
      resolvedRequestAnimationFrameFn(() => {
        resolvedSetTimeoutFn(resolve, 0);
      });
    });
}

async function previewThenImportToGrid({
  importer,
  exporter,
  type,
  text,
  previewRowLimit,
  setPreviewText,
  setImportStatus,
  yieldToUi = async () => {},
}) {
  const dataTable = importer?.toGenericDataTable?.(type, text);
  if (!dataTable) {
    throw new Error('Unable to parse input into data table.');
  }

  setPreviewText?.(createPreviewTextFromDataTable({ exporter, type, dataTable, previewRowLimit }));
  setImportStatus?.(`Preview loaded (first ${previewRowLimit} items). Loading full data into grid...`, true);
  await yieldToUi();
  setImportStatus?.('Importing full data into grid...', true);
  await yieldToUi();

  if (typeof importer?.setGridFromGenericDataTable !== 'function') {
    throw new Error('Unable to apply imported data to grid.');
  }

  await Promise.resolve(importer.setGridFromGenericDataTable(dataTable));
  setImportStatus?.('Import complete.', false);
  return dataTable;
}

export {
  DEFAULT_PREVIEW_ROW_LIMIT,
  MAX_PREVIEW_ROW_LIMIT,
  MIN_PREVIEW_ROW_LIMIT,
  createClipboardService,
  createDownloadService,
  createFullTextFromGrid,
  createPreviewTextFromDataTable,
  createPreviewTextFromGrid,
  createYieldToUi,
  limitDataTableRows,
  normalizeImportedTextContent,
  normalizePreviewRowLimit,
  previewThenImportToGrid,
  scheduleTimeout,
};
