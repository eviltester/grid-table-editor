import { GenericDataTable } from '../data_formats/generic-data-table.js';

const TEST_DATA_MODES = Object.freeze({
  NEW_TABLE: 'new-table',
  AMEND_TABLE: 'amend-table',
  AMEND_SELECTED: 'amend-selected',
});

function createTableFromGenerator(rowCount, generator) {
  const outputTable = new GenericDataTable();
  outputTable.setHeaders(generator.generateHeadersArray());
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    outputTable.appendDataRow(generator.generateRow());
  }
  return outputTable;
}

function createAmendedTable({ mode, desiredRowCount, generator, currentDataTable, selectedRowIndexes = [] }) {
  const sourceTable = currentDataTable || new GenericDataTable();
  const schemaHeaders = generator.generateHeadersArray();
  const baseHeaders = sourceTable.getHeaders();
  const headers = mergeHeaders(baseHeaders, schemaHeaders);
  const headerIndexMap = indexHeaders(headers);
  const schemaHeaderIndexes = schemaHeaders.map((header) => headerIndexMap[header]);
  const rows = ensureWorkingTableShape(sourceTable, headers);
  const desiredCount = normaliseCount(desiredRowCount);

  if (mode === TEST_DATA_MODES.AMEND_SELECTED) {
    const selectedIndexes = normaliseSelectedIndexes(selectedRowIndexes);
    if (selectedIndexes.length === 0) {
      return {
        dataTable: sourceTable,
        noSelectedRows: true,
      };
    }

    const rowsToAmend = Math.min(desiredCount, selectedIndexes.length);
    for (let amendIndex = 0; amendIndex < rowsToAmend; amendIndex++) {
      const targetRowIndex = selectedIndexes[amendIndex];
      if (targetRowIndex < 0 || targetRowIndex >= rows.length) {
        continue;
      }
      applyGeneratedValuesToRow(rows[targetRowIndex], generator.generateRow(), schemaHeaderIndexes);
    }

    return {
      dataTable: sourceTable,
      noSelectedRows: false,
    };
  }

  // amend-table mode
  for (let rowIndex = 0; rowIndex < desiredCount; rowIndex++) {
    if (rowIndex >= rows.length) {
      rows.push(createBlankRow(headers.length));
    }
    applyGeneratedValuesToRow(rows[rowIndex], generator.generateRow(), schemaHeaderIndexes);
  }

  // keep existing rows untouched when desiredCount < existingRowCount
  return {
    dataTable: sourceTable,
    noSelectedRows: false,
  };
}

function mergeHeaders(baseHeaders, schemaHeaders) {
  const mergedHeaders = [...baseHeaders];
  schemaHeaders.forEach((header) => {
    if (!mergedHeaders.includes(header)) {
      mergedHeaders.push(header);
    }
  });
  return mergedHeaders;
}

function indexHeaders(headers) {
  const indexMap = {};
  headers.forEach((header, index) => {
    indexMap[header] = index;
  });
  return indexMap;
}

function ensureWorkingTableShape(dataTable, headers) {
  dataTable.setHeaders(headers);
  if (!Array.isArray(dataTable.rows)) {
    dataTable.rows = [];
    return dataTable.rows;
  }

  const targetColumnCount = headers.length;
  for (let rowIndex = 0; rowIndex < dataTable.rows.length; rowIndex++) {
    const row = dataTable.rows[rowIndex];
    if (!Array.isArray(row)) {
      dataTable.rows[rowIndex] = createBlankRow(targetColumnCount);
      continue;
    }

    while (row.length < targetColumnCount) {
      row.push('');
    }
  }
  return dataTable.rows;
}

function createBlankRow(columnCount) {
  return new Array(columnCount).fill('');
}

function applyGeneratedValuesToRow(targetRow, generatedRow, schemaHeaderIndexes) {
  schemaHeaderIndexes.forEach((targetIndex, schemaIndex) => {
    const generatedValue = generatedRow[schemaIndex];
    targetRow[targetIndex] = generatedValue === undefined || generatedValue === null ? '' : String(generatedValue);
  });
}

function normaliseSelectedIndexes(selectedRowIndexes) {
  if (!Array.isArray(selectedRowIndexes)) {
    return [];
  }
  return [
    ...new Set(
      selectedRowIndexes
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.floor(value))
        .filter((value) => value >= 0)
    ),
  ].sort((a, b) => a - b);
}

function normaliseCount(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, parsed);
}

export { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount };
