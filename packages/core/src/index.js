import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import Papa from 'papaparse';
import { TestDataGenerator } from '../../../js/data_generation/testDataGenerator.js';
import { GenericDataTable } from '../../../js/data_formats/generic-data-table.js';
import { Exporter } from '../../../js/grid/exporter.js';

const DEFAULT_FORMAT = 'json';
const SUPPORTED_FORMATS = [
  'csv',
  'dsv',
  'markdown',
  'json',
  'jsonl',
  'javascript',
  'python',
  'java',
  'typescript',
  'xml',
  'sql',
  'gherkin',
  'html',
  'asciitable',
];

function createExporter() {
  return new Exporter({
    getGridAsGenericDataTable: () => new GenericDataTable(),
    getHeadersFromGrid: () => [],
  });
}

function tableToRows(dataTable) {
  const headers = dataTable.getHeaders();
  const rows = [];
  for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
    rows.push(dataTable.getRow(rowIndex));
  }
  return { headers, rows };
}

export function generateFromTextSpec({ textSpec, rowCount, outputFormat = DEFAULT_FORMAT, options = {}, seed } = {}) {
  const errors = [];
  if (typeof textSpec !== 'string' || textSpec.trim().length === 0) {
    errors.push('textSpec is required and must be a non-empty string.');
  }

  const safeRowCount = Number.parseInt(rowCount, 10);
  if (!Number.isInteger(safeRowCount) || safeRowCount < 0) {
    errors.push('rowCount is required and must be an integer greater than or equal to zero.');
  }

  if (!SUPPORTED_FORMATS.includes(outputFormat)) {
    errors.push(`outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`);
  }

  if (errors.length > 0) {
    return { ok: false, errors, diagnostics: { supportedFormats: SUPPORTED_FORMATS } };
  }

  if (typeof seed === 'number') {
    faker.seed(seed);
  }

  const generator = new TestDataGenerator(faker, RandExp);
  generator.importSpec(textSpec);
  generator.compile();

  if (!generator.isValid()) {
    return {
      ok: false,
      errors: generator.errors(),
      diagnostics: {
        report: generator.compilationReport(),
      },
    };
  }

  const dataTable = new GenericDataTable();
  dataTable.setHeaders(generator.generateHeadersArray());
  for (let index = 0; index < safeRowCount; index += 1) {
    dataTable.appendDataRow(generator.generateRow());
  }

  const exporter = createExporter();
  if (options && Object.keys(options).length > 0) {
    exporter.setOptionsForType(outputFormat, options);
  }

  let rendered = '';
  if (outputFormat === 'csv') {
    rendered = Papa.unparse(
      [dataTable.getHeaders(), ...Array.from({ length: dataTable.getRowCount() }, (_, idx) => dataTable.getRow(idx))],
      {
        quoteChar: '"',
        quotes: true,
        header: false,
      }
    );
  } else {
    rendered = exporter.getDataTableAs(outputFormat, dataTable) || '';
  }

  const { headers, rows } = tableToRows(dataTable);
  return {
    ok: true,
    errors: [],
    headers,
    rows,
    rendered,
    format: outputFormat,
    diagnostics: {
      report: generator.compilationReport(),
      rowCount: safeRowCount,
    },
  };
}

export { SUPPORTED_FORMATS };
