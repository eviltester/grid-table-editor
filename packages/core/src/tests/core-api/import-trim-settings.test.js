import {
  applyImportTrimSettingsToDataTable,
  normalizeImportTrimSettings,
} from '../../../js/grid/import-trim-settings.js';

test('ignores non-string trimInputFieldsCsv values', () => {
  expect(normalizeImportTrimSettings({ trimInputFieldsCsv: false })).toEqual({
    trimInput: false,
    trimInputFields: [],
  });

  expect(normalizeImportTrimSettings({ trimInputFieldsCsv: 123 })).toEqual({
    trimInput: false,
    trimInputFields: [],
  });

  expect(normalizeImportTrimSettings({ trimInputFieldsCsv: ['Name'] })).toEqual({
    trimInput: false,
    trimInputFields: [],
  });
});

test('does not extend short rows while trimming imported values', () => {
  const dataTable = {
    headers: ['Name', 'Role'],
    rows: [['  Alice  ']],
    getHeaders() {
      return this.headers;
    },
    getRowCount() {
      return this.rows.length;
    },
  };

  applyImportTrimSettingsToDataTable(dataTable, { trimInput: true });

  expect(dataTable.rows).toEqual([['Alice']]);
});
