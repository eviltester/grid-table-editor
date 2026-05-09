import { Faker, faker } from '@faker-js/faker';
import RandExp from 'randexp';
import Papa from 'papaparse';
import { TestDataGenerator } from '../js/data_generation/testDataGenerator.js';
import { GenericDataTable } from '../js/data_formats/generic-data-table.js';
import { Exporter } from '../js/grid/exporter.js';
import { Importer } from '../js/grid/importer.js';
import { KNOWN_FAKER_COMMANDS } from '../js/faker/faker-commands.js';
import { PairwiseTestDataGenerator } from '../js/data_generation/all-pairs/pairwiseTestDataGenerator.js';

if (typeof globalThis.Papa === 'undefined') {
  globalThis.Papa = Papa;
}

const DEFAULT_FORMAT = 'json';
const SUPPORTED_FORMATS = [
  'csv',
  'dsv',
  'markdown',
  'json',
  'jsonl',
  'csharp',
  'javascript',
  'python',
  'php',
  'kotlin',
  'perl',
  'ruby',
  'java',
  'typescript',
  'junit4',
  'junit5',
  'junit6',
  'testng',
  'pytest',
  'unittest',
  'nose2',
  'jest',
  'vitest',
  'mocha',
  'xunit',
  'nunit',
  'mstest',
  'rspec',
  'minitest',
  'phpunit',
  'pest',
  'kotest',
  'junit5-kotlin',
  'spek',
  'test-more',
  'test2-suite',
  'xml',
  'sql',
  'gherkin',
  'html',
  'asciitable',
];

function extractRuleLines(textSpec) {
  if (typeof textSpec !== 'string') {
    return [];
  }
  const lines = textSpec.split(/\r?\n/);
  const ruleLines = [];
  for (let i = 1; i < lines.length; i += 2) {
    ruleLines.push(lines[i].trim());
  }
  return ruleLines;
}

function looksLikeFakerRule(ruleLine) {
  return /^(faker\.)?[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+/.test(ruleLine);
}

function getFakerCommandFromRule(ruleLine) {
  const trimmed = String(ruleLine || '').trim();
  const commandMatch = trimmed.match(/^((?:faker\.)?[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+)/);
  if (!commandMatch) {
    return '';
  }
  return commandMatch[1].replace(/^faker\./, '');
}

function hasDisallowedFakerSyntax(ruleLine) {
  return /=>|\bfunction\b|\bthis\b|;|`|\?\?|\bnew\b|process|globalThis|constructor|__proto__|prototype/.test(ruleLine);
}

function hasSafeFakerArguments(ruleLine) {
  const openParen = ruleLine.indexOf('(');
  if (openParen === -1) {
    return true;
  }

  if (!ruleLine.endsWith(')')) {
    return false;
  }

  const argsBody = ruleLine.slice(openParen + 1, -1).trim();
  if (argsBody.length === 0) {
    return true;
  }

  const literalTokenPattern = String.raw`(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|true|false|null)`;
  const argsListPattern = new RegExp(`^\\s*${literalTokenPattern}(\\s*,\\s*${literalTokenPattern})*\\s*$`);
  return argsListPattern.test(argsBody);
}

export function validateSafeFakerRules(textSpec) {
  const ruleLines = extractRuleLines(textSpec);
  const knownCommandSet = new Set(KNOWN_FAKER_COMMANDS.filter((command) => command !== 'RegEx'));

  for (const ruleLine of ruleLines) {
    if (!looksLikeFakerRule(ruleLine)) {
      continue;
    }

    const fakerCommand = getFakerCommandFromRule(ruleLine);
    if (!knownCommandSet.has(fakerCommand)) {
      return {
        ok: false,
        error: `Unknown faker command in safe mode: ${fakerCommand}. Use --unsafe-faker-expressions to opt in.`,
      };
    }

    if (hasDisallowedFakerSyntax(ruleLine) || !hasSafeFakerArguments(ruleLine)) {
      return {
        ok: false,
        error:
          'Unsafe faker rule syntax detected. Accepted syntax is faker commands with no args or literal args (string/number/boolean/null). Use --unsafe-faker-expressions to opt in.',
      };
    }
  }

  return { ok: true };
}

function createExporter() {
  return new Exporter({
    getGridAsGenericDataTable: () => new GenericDataTable(),
    getHeadersFromGrid: () => [],
  });
}

function createImporter() {
  return new Importer({
    setGridFromGenericDataTable: (dataTable) => dataTable,
  });
}

function createScopedFaker(seed) {
  const scopedFaker = new Faker({ locale: faker.rawDefinitions });
  if (typeof seed === 'number') {
    scopedFaker.seed(seed);
  }
  return scopedFaker;
}

export function createExporterForDefaults() {
  return createExporter();
}

function createBlankRow(columnCount) {
  return new Array(columnCount).fill('');
}

function normaliseAmendCount(value, fallbackCount) {
  if (value === undefined || value === null || value === '') {
    return fallbackCount;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }
  return parsed;
}

function toRowsWithHeaderMap(dataTable) {
  const headers = dataTable.getHeaders();
  const rows = [];
  for (let index = 0; index < dataTable.getRowCount(); index += 1) {
    const row = dataTable.getRow(index);
    while (row.length < headers.length) {
      row.push('');
    }
    rows.push(row);
  }
  return { headers, rows };
}

function tableToRows(dataTable) {
  const headers = dataTable.getHeaders();
  const rows = [];
  for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
    rows.push(dataTable.getRow(rowIndex));
  }
  return { headers, rows };
}

export function generateFromTextSpec({
  textSpec,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
  options = {},
  seed,
  pairwise = false,
  unsafeFakerExpressions = false,
} = {}) {
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

  const scopedFaker = createScopedFaker(seed);
  const generator = new TestDataGenerator(scopedFaker, RandExp, { unsafeFakerExpressions });
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
  let effectiveRowCount = safeRowCount;
  const diagnosticsWarnings = [];

  if (pairwise) {
    if (rowCount !== undefined && rowCount !== null) {
      diagnosticsWarnings.push('rowCount is ignored when pairwise generation is enabled.');
    }
    const pairwiseGenerator = new PairwiseTestDataGenerator(scopedFaker, RandExp);
    const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules());
    if (initResult?.isError) {
      return {
        ok: false,
        errors: [initResult.errorMessage || 'Failed to initialize pairwise generation.'],
        diagnostics: {
          report: generator.compilationReport(),
        },
      };
    }

    const rowsResult = pairwiseGenerator.generateAllDataRecordsAsRows();
    if (rowsResult?.isError) {
      return {
        ok: false,
        errors: [rowsResult.errorMessage || 'Failed to generate pairwise rows.'],
        diagnostics: {
          report: generator.compilationReport(),
        },
      };
    }

    const generatedRows = rowsResult?.data?.data || [];
    const generatedHeaders = Array.isArray(generatedRows[0]) ? generatedRows[0] : [];
    const originalHeaders = generator.generateHeadersArray();
    const generatedHeaderIndexes = new Map(generatedHeaders.map((header, index) => [header, index]));
    dataTable.setHeaders(originalHeaders);
    for (let rowIndex = 1; rowIndex < generatedRows.length; rowIndex += 1) {
      const generatedRow = Array.isArray(generatedRows[rowIndex]) ? generatedRows[rowIndex] : [];
      const reorderedRow = originalHeaders.map((header) => {
        const generatedIndex = generatedHeaderIndexes.get(header);
        return generatedIndex === undefined ? '' : generatedRow[generatedIndex];
      });
      dataTable.appendDataRow(reorderedRow);
    }
    effectiveRowCount = Math.max(generatedRows.length - 1, 0);
  } else {
    dataTable.setHeaders(generator.generateHeadersArray());
    for (let index = 0; index < safeRowCount; index += 1) {
      dataTable.appendDataRow(generator.generateRow());
    }
  }

  const exporter = createExporter();
  if (options && Object.keys(options).length > 0) {
    exporter.setOptionsForType(outputFormat, options);
  }

  let rendered = '';
  rendered = exporter.getDataTableAs(outputFormat, dataTable) || '';

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
      rowCount: effectiveRowCount,
      pairwise,
      warnings: diagnosticsWarnings,
    },
  };
}

export function amendFromTextSpecAndData({
  textSpec,
  inputData,
  inputFormat,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
  options = {},
  seed,
  unsafeFakerExpressions = false,
  stream = false,
} = {}) {
  const errors = [];
  const diagnosticsWarnings = [];

  if (typeof textSpec !== 'string' || textSpec.trim().length === 0) {
    errors.push('textSpec is required and must be a non-empty string.');
  }
  if (typeof inputData !== 'string' || inputData.length === 0) {
    errors.push('inputData is required and must be a non-empty string.');
  }
  if (typeof inputFormat !== 'string' || inputFormat.trim().length === 0) {
    errors.push('inputFormat is required and must be a non-empty string.');
  }
  if (!SUPPORTED_FORMATS.includes(outputFormat)) {
    errors.push(`outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  if (errors.length > 0) {
    return { ok: false, errors, diagnostics: { supportedFormats: SUPPORTED_FORMATS } };
  }

  const normalisedInputFormat = String(inputFormat).toLowerCase();
  const importer = createImporter();
  if (!importer.canImport(normalisedInputFormat)) {
    return {
      ok: false,
      errors: [`inputFormat must be one of: ${Object.keys(importer.convertors).sort().join(', ')}`],
      diagnostics: {},
    };
  }

  let sourceTable;
  try {
    sourceTable = importer.toGenericDataTable(normalisedInputFormat, inputData);
  } catch (error) {
    return {
      ok: false,
      errors: [`Unable to parse inputData using inputFormat "${normalisedInputFormat}".`],
      diagnostics: { message: error?.message || 'Input parsing failed.' },
    };
  }
  if (!sourceTable || !Array.isArray(sourceTable.rows)) {
    return {
      ok: false,
      errors: [`Unable to parse inputData using inputFormat "${normalisedInputFormat}".`],
      diagnostics: {},
    };
  }

  const importedRowCount = sourceTable.getRowCount();
  const amendCount = normaliseAmendCount(rowCount, importedRowCount);
  if (amendCount === undefined) {
    return {
      ok: false,
      errors: ['rowCount must be an integer greater than or equal to zero when provided.'],
      diagnostics: {},
    };
  }
  if (amendCount > importedRowCount) {
    return {
      ok: false,
      errors: [`rowCount must be less than or equal to imported row count (${importedRowCount}).`],
      diagnostics: { importedRowCount },
    };
  }

  const scopedFaker = createScopedFaker(seed);
  const generator = new TestDataGenerator(scopedFaker, RandExp, { unsafeFakerExpressions });
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

  if (stream === true || stream === 'true') {
    diagnosticsWarnings.push('stream is ignored for amend operations and buffered mode is always used.');
  }

  const schemaHeaders = generator.generateHeadersArray();
  const baseHeaders = sourceTable.getHeaders();
  const mergedHeaders = [...baseHeaders];
  for (const header of schemaHeaders) {
    if (!mergedHeaders.includes(header)) {
      mergedHeaders.push(header);
    }
  }

  const headerIndexMap = new Map(mergedHeaders.map((header, index) => [header, index]));
  const schemaHeaderIndexes = schemaHeaders.map((header) => headerIndexMap.get(header));
  const { rows } = toRowsWithHeaderMap(sourceTable);
  for (const row of rows) {
    while (row.length < mergedHeaders.length) {
      row.push('');
    }
  }

  for (let rowIndex = 0; rowIndex < amendCount; rowIndex += 1) {
    const targetRow = rows[rowIndex] || createBlankRow(mergedHeaders.length);
    while (targetRow.length < mergedHeaders.length) {
      targetRow.push('');
    }
    const generatedRow = generator.generateRow();
    for (let schemaIndex = 0; schemaIndex < schemaHeaderIndexes.length; schemaIndex += 1) {
      const targetIndex = schemaHeaderIndexes[schemaIndex];
      const generatedValue = generatedRow[schemaIndex];
      targetRow[targetIndex] = generatedValue === undefined || generatedValue === null ? '' : String(generatedValue);
    }
    rows[rowIndex] = targetRow;
  }

  const outputTable = new GenericDataTable();
  outputTable.setHeaders(mergedHeaders);
  outputTable.rows = rows;

  const exporter = createExporter();
  if (options && Object.keys(options).length > 0) {
    exporter.setOptionsForType(outputFormat, options);
  }
  const rendered = exporter.getDataTableAs(outputFormat, outputTable) || '';
  const { headers, rows: resultRows } = tableToRows(outputTable);

  return {
    ok: true,
    errors: [],
    headers,
    rows: resultRows,
    rendered,
    format: outputFormat,
    diagnostics: {
      report: generator.compilationReport(),
      rowCount: amendCount,
      importedRowCount,
      warnings: diagnosticsWarnings,
    },
  };
}

function createAndValidateGenerator({
  textSpec,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
  unsafeFakerExpressions = false,
  seed,
} = {}) {
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

  const scopedFaker = createScopedFaker(seed);
  const generator = new TestDataGenerator(scopedFaker, RandExp, { unsafeFakerExpressions });
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

  return { ok: true, generator, safeRowCount };
}

function getCsvStreamSettings(options = {}) {
  const quoteChar = typeof options.quoteChar === 'string' && options.quoteChar.length > 0 ? options.quoteChar : '"';
  const escapeChar =
    typeof options.escapeChar === 'string' && options.escapeChar.length > 0 ? options.escapeChar : quoteChar;
  const includeHeader = options.header !== false;
  return { quoteChar, escapeChar, includeHeader };
}

function quoteCsvValue(value, { quoteChar, escapeChar }) {
  const text = String(value ?? '');
  const escapedQuote = `${escapeChar}${quoteChar}`;
  const escaped = text.split(quoteChar).join(escapedQuote);
  return `${quoteChar}${escaped}${quoteChar}`;
}

function rowToCsv(headers, row, csvSettings) {
  return headers.map((header) => quoteCsvValue(row[header], csvSettings)).join(',');
}

function rowToJsonLine(row) {
  return JSON.stringify(row);
}

export async function streamFromTextSpec({
  textSpec,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
  options = {},
  seed,
  pairwise = false,
  unsafeFakerExpressions = false,
  onChunk,
  collectRows = false,
} = {}) {
  if (typeof onChunk !== 'function') {
    return {
      ok: false,
      errors: ['onChunk callback is required and must be a function.'],
      diagnostics: {},
    };
  }

  const validation = createAndValidateGenerator({
    textSpec,
    rowCount,
    outputFormat,
    unsafeFakerExpressions,
    seed,
  });
  if (!validation.ok) {
    return validation;
  }

  if (pairwise) {
    return {
      ok: false,
      errors: ['Streaming does not support pairwise generation.'],
      diagnostics: {},
    };
  }

  if (outputFormat !== 'csv' && outputFormat !== 'jsonl') {
    return {
      ok: false,
      errors: ['Streaming currently supports only csv and jsonl formats.'],
      diagnostics: {
        supportedStreamingFormats: ['csv', 'jsonl'],
      },
    };
  }

  const { generator, safeRowCount } = validation;
  const headers = generator.generateHeadersArray();
  const rows = collectRows ? [] : null;
  let firstRow = null;
  const report = generator.compilationReport();
  const csvSettings = outputFormat === 'csv' ? getCsvStreamSettings(options) : null;

  if (outputFormat === 'csv' && csvSettings.includeHeader) {
    await onChunk(headers.map((header) => quoteCsvValue(header, csvSettings)).join(','));
  }

  for (let index = 0; index < safeRowCount; index += 1) {
    const row = generator.generateRow();
    if (firstRow === null) {
      firstRow = row;
    }
    if (rows) {
      rows.push(row);
    }
    if (outputFormat === 'csv') {
      await onChunk(rowToCsv(headers, row, csvSettings));
    } else {
      await onChunk(rowToJsonLine(row));
    }
  }

  return {
    ok: true,
    errors: [],
    headers,
    rows: rows || [],
    format: outputFormat,
    diagnostics: {
      report,
      rowCount: safeRowCount,
      streamed: true,
      firstRow,
      collectRows,
    },
  };
}

export { SUPPORTED_FORMATS };
export { Exporter, GenericDataTable };
