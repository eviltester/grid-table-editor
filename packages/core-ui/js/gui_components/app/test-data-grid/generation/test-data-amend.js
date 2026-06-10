/*
 * Responsibilities:
 * - Core table amend/new-table operations for test-data generation modes.
 * - Converts generator row output into normalized grid row values.
 * - Applies amend behavior for full-table and selected-row scenarios.
 */

import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { CONSTRAINT_FAILURE_BATCH_SIZE } from '@anywaydata/core';
import {
  getGeneratorGenerationErrors,
  normaliseGeneratedCellValue,
  normaliseGeneratedRow as normaliseGeneratedRowValues,
  createTableFromGenerator as createTableFromGeneratorShared,
  parseNonNegativeCount,
} from '../../../shared/test-data/generation/generation-runtime.js';

const TEST_DATA_MODES = Object.freeze({
  NEW_TABLE: 'new-table',
  AMEND_TABLE: 'amend-table',
  AMEND_SELECTED: 'amend-selected',
});

function createTableFromGenerator(rowCount, generator) {
  return createTableFromGeneratorShared({
    rowCount,
    generator,
    GenericDataTableClass: GenericDataTable,
  });
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
  const result = {
    dataTable: sourceTable,
    noSelectedRows: false,
    generationErrors: [],
    generationStats: { generatedRows: 0, failedRows: 0, failedAttempts: 0 },
  };

  if (mode === TEST_DATA_MODES.AMEND_SELECTED) {
    const selectedIndexes = normaliseSelectedIndexes(selectedRowIndexes);
    if (selectedIndexes.length === 0) {
      result.noSelectedRows = true;
      return result;
    }

    const rowsToAmend = Math.min(desiredCount, selectedIndexes.length);
    for (let amendIndex = 0; amendIndex < rowsToAmend; amendIndex++) {
      const targetRowIndex = selectedIndexes[amendIndex];
      if (targetRowIndex < 0 || targetRowIndex >= rows.length) {
        continue;
      }
      const generatedRow = generator.generateRow();
      const generationErrors = getGeneratorGenerationErrors(generator);
      if (generationErrors.length > 0) {
        result.generationErrors = generationErrors;
        result.generationStats.failedRows += 1;
        result.generationStats.failedAttempts += generationErrors.some(
          (error) => error?.code === 'constraint_generation_failed'
        )
          ? CONSTRAINT_FAILURE_BATCH_SIZE
          : 1;
        return result;
      }
      applyGeneratedValuesToRow(rows[targetRowIndex], normaliseGeneratedRowValues(generatedRow), schemaHeaderIndexes);
      result.generationStats.generatedRows += 1;
    }

    return result;
  }

  // amend-table mode
  for (let rowIndex = 0; rowIndex < desiredCount; rowIndex++) {
    if (rowIndex >= rows.length) {
      rows.push(createBlankRow(headers.length));
    }
    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorGenerationErrors(generator);
    if (generationErrors.length > 0) {
      result.generationErrors = generationErrors;
      result.generationStats.failedRows += 1;
      result.generationStats.failedAttempts += generationErrors.some(
        (error) => error?.code === 'constraint_generation_failed'
      )
        ? CONSTRAINT_FAILURE_BATCH_SIZE
        : 1;
      return result;
    }
    applyGeneratedValuesToRow(rows[rowIndex], normaliseGeneratedRowValues(generatedRow), schemaHeaderIndexes);
    result.generationStats.generatedRows += 1;
  }

  // keep existing rows untouched when desiredCount < existingRowCount
  return result;
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
    targetRow[targetIndex] = normaliseGeneratedCellValue(generatedValue);
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
  return parseNonNegativeCount(value, { min: 0 }).value;
}

export { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount };
