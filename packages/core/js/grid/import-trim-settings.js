function normalizeImportTrimSettings({ trimInput = false, trimInputFieldsCsv = '' } = {}) {
  const trimInputFields = String(trimInputFieldsCsv ?? '')
    .split(',')
    .map((fieldName) => fieldName.trim())
    .filter((fieldName) => fieldName.length > 0);

  return {
    trimInput: trimInput === true,
    trimInputFields: [...new Set(trimInputFields)],
  };
}

function shouldTrimColumn(settings = {}, header) {
  if (settings.trimInput === true) {
    return true;
  }
  return settings.trimInputFields.includes(header);
}

function trimImportedCellValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function applyImportTrimSettingsToDataTable(dataTable, settings = {}) {
  if (!dataTable || typeof dataTable.getHeaders !== 'function' || typeof dataTable.getRowCount !== 'function') {
    return dataTable;
  }

  const normalizedSettings = normalizeImportTrimSettings(settings);
  if (normalizedSettings.trimInput !== true && normalizedSettings.trimInputFields.length === 0) {
    return dataTable;
  }

  const headers = dataTable.getHeaders();
  const columnsToTrim = headers.map((header) => shouldTrimColumn(normalizedSettings, header));
  if (!columnsToTrim.includes(true)) {
    return dataTable;
  }

  for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
    const row = Array.isArray(dataTable.rows) ? dataTable.rows[rowIndex] : null;
    if (!Array.isArray(row)) {
      continue;
    }
    for (let columnIndex = 0; columnIndex < columnsToTrim.length; columnIndex += 1) {
      if (columnsToTrim[columnIndex] !== true) {
        continue;
      }
      row[columnIndex] = trimImportedCellValue(row[columnIndex]);
    }
  }

  return dataTable;
}

export { applyImportTrimSettingsToDataTable, normalizeImportTrimSettings };
