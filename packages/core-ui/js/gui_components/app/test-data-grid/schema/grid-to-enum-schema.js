import { SOURCE_TYPE_ENUM } from '../../../shared/schema-row-rule-mapper.js';

const DEFAULT_ENUM_LIMIT = 256;

function normaliseEnumLimit(limit, { defaultLimit = DEFAULT_ENUM_LIMIT } = {}) {
  const parsed = Number.parseInt(limit, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultLimit;
  }
  return parsed;
}

function normaliseGridCellValue(value) {
  return String(value ?? '').trim();
}

function serialiseEnumSchemaValue(value) {
  const normalised = normaliseGridCellValue(value);
  if (!/[,"\r\n]/.test(normalised)) {
    return normalised;
  }
  return `"${normalised.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function buildGridEnumSchemaSummary({ dataTable, maxEnumValues = DEFAULT_ENUM_LIMIT } = {}) {
  const headers = Array.isArray(dataTable?.getHeaders?.()) ? dataTable.getHeaders() : [];
  const rowCount = Number.parseInt(dataTable?.getRowCount?.() ?? 0, 10) || 0;
  const safeLimit = normaliseEnumLimit(maxEnumValues);

  const columns = headers.map((header, headerIndex) => {
    const uniqueValues = [];
    const seenValues = new Set();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const cellValue = normaliseGridCellValue(dataTable?.getCell?.(rowIndex, headerIndex));
      if (!cellValue || seenValues.has(cellValue)) {
        continue;
      }
      seenValues.add(cellValue);
      uniqueValues.push(cellValue);
    }

    const keptValues = uniqueValues.slice(0, safeLimit);

    return {
      header: String(header ?? '').trim(),
      uniqueValues,
      uniqueValueCount: uniqueValues.length,
      truncated: uniqueValues.length > keptValues.length,
      keptValues,
    };
  });

  const usableColumns = columns.filter((column) => column.header.length > 0 && column.uniqueValueCount > 0);
  const maxUniqueValueCount = usableColumns.reduce((largest, column) => Math.max(largest, column.uniqueValueCount), 0);
  const truncatedColumnCount = usableColumns.filter((column) => column.truncated).length;

  return {
    maxEnumValues: safeLimit,
    maxUniqueValueCount,
    truncatedColumnCount,
    columns,
    usableColumns,
  };
}

function createEnumSchemaRowsFromGrid({ dataTable, maxEnumValues = DEFAULT_ENUM_LIMIT, createBlankRow } = {}) {
  const summary = buildGridEnumSchemaSummary({ dataTable, maxEnumValues });
  const rows = summary.usableColumns.map((column) => ({
    ...(typeof createBlankRow === 'function' ? createBlankRow() : {}),
    name: column.header,
    sourceType: SOURCE_TYPE_ENUM,
    command: '',
    params: '',
    value: column.keptValues.map(serialiseEnumSchemaValue).join(','),
    comments: '',
    leadingTextLines: [],
  }));

  return {
    ...summary,
    rows,
  };
}

export { DEFAULT_ENUM_LIMIT, buildGridEnumSchemaSummary, createEnumSchemaRowsFromGrid, normaliseEnumLimit };
