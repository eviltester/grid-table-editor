import { Faker, faker } from '@faker-js/faker';
import RandExp from 'randexp';
import Papa from 'papaparse';
import { GenericDataTable } from '../js/data_formats/generic-data-table.js';
import { Exporter } from '../js/grid/exporter.js';
import { Importer } from '../js/grid/importer.js';
import { KNOWN_FAKER_COMMANDS } from '../js/faker/faker-commands.js';
import { PairwiseTestDataGenerator } from '../js/data_generation/n-wise/pairwiseTestDataGenerator.js';
import {
  CombinationAlgorithm,
  CombinationsTestDataGenerator,
} from '../js/data_generation/n-wise/combinationsTestDataGenerator.js';
import { parseSchemaText } from '../js/data_generation/schema-conversion.js';
import { hasSafeFakerLiteralArguments } from '../js/data_generation/faker/safeLiteralArgumentParser.js';
import {
  OPTION_KEYS_BY_FORMAT,
  OPTION_TIPS_BY_FORMAT,
  normalizeFormat,
  sanitizeOptionsForFormat,
  getTipsForFormat,
} from '../js/options/format-option-catalog.js';
import { CoreGenerationErrors } from './core-generation-errors.js';
import {
  EXPORT_LINE_ENDINGS,
  applyExportTextEncoding,
  resolveDefaultLineEndingForPlatform,
  resolveExportTextEncodingSettings,
} from './export-text-encoding.js';

if (typeof globalThis.Papa === 'undefined') {
  globalThis.Papa = Papa;
}

const DEFAULT_FORMAT = 'json';
const CONSTRAINT_FAILURE_BATCH_SIZE = 1000;
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
  return hasSafeFakerLiteralArguments(ruleLine);
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
          'Unsafe faker rule syntax detected. Accepted syntax is faker commands with literal args (string/number/boolean/null/array/object). Use --unsafe-faker-expressions to opt in.',
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

function parseAndCompileSchema({
  textSpec,
  fakerInstance,
  unsafeFakerExpressions = false,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
} = {}) {
  const errors = [];
  if (typeof textSpec !== 'string' || textSpec.trim().length === 0) {
    errors.push(CoreGenerationErrors.invalidTextSpecRequired());
  }

  const safeRowCount = Number.parseInt(rowCount, 10);
  if (!Number.isInteger(safeRowCount) || safeRowCount < 0) {
    errors.push(CoreGenerationErrors.invalidRowCountRequired());
  }

  if (!SUPPORTED_FORMATS.includes(outputFormat)) {
    errors.push(CoreGenerationErrors.invalidOutputFormat(SUPPORTED_FORMATS));
  }

  if (errors.length > 0) {
    return { ok: false, errors, diagnostics: { supportedFormats: SUPPORTED_FORMATS } };
  }

  const parseResult = parseSchemaText({
    schemaText: textSpec,
    faker: fakerInstance,
    RandExp,
    options: { unsafeFakerExpressions },
  });

  if (!parseResult.ok) {
    return {
      ok: false,
      errors: parseResult.errors,
      diagnostics: {
        report: parseResult.report,
      },
    };
  }

  return { ok: true, generator: parseResult.generator, safeRowCount };
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
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) {
      return undefined;
    }
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isSafeInteger(parsed) ? parsed : undefined;
  }
  return undefined;
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

function normaliseGeneratedCellValue(value) {
  if (value === undefined || value === null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return value;
}

function normaliseGeneratedRowValues(row = []) {
  if (!Array.isArray(row)) {
    return [];
  }
  return row.map((value) => normaliseGeneratedCellValue(value));
}

function getGeneratorRuntimeErrors(generator) {
  return typeof generator?.generationErrors === 'function' ? generator.generationErrors() : [];
}

function createConstraintImpactFailure({
  generatedCount = 0,
  failedCount = CONSTRAINT_FAILURE_BATCH_SIZE,
  report = '',
} = {}) {
  return {
    ok: false,
    errors: [CoreGenerationErrors.constraintImpactingRowGeneration(generatedCount, failedCount)],
    diagnostics: {
      report,
      generatedCount,
      failedCount,
    },
  };
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
  const scopedFaker = createScopedFaker(seed);
  const parsed = parseAndCompileSchema({
    textSpec,
    fakerInstance: scopedFaker,
    unsafeFakerExpressions,
    rowCount,
    outputFormat,
  });
  if (!parsed.ok) {
    return parsed;
  }
  const { generator, safeRowCount } = parsed;

  const dataTable = new GenericDataTable();
  let effectiveRowCount = safeRowCount;
  const diagnosticsWarnings = [];

  if (pairwise) {
    if (rowCount !== undefined && rowCount !== null) {
      diagnosticsWarnings.push('rowCount is ignored when pairwise generation is enabled.');
    }
    const pairwiseGenerator = new PairwiseTestDataGenerator(scopedFaker, RandExp);
    const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules(), {
      constraints: typeof generator.schemaConstraints === 'function' ? generator.schemaConstraints() : [],
    });
    if (initResult?.isError) {
      return {
        ok: false,
        errors: [CoreGenerationErrors.pairwiseInitializationFailed(initResult.errorMessage)],
        diagnostics: {
          report: generator.compilationReport(),
        },
      };
    }

    const rowsResult = pairwiseGenerator.generateAllDataRecordsAsRows();
    if (rowsResult?.isError) {
      return {
        ok: false,
        errors: [CoreGenerationErrors.pairwiseGenerationFailed(rowsResult.errorMessage)],
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
      const generatedRow = Array.isArray(generatedRows[rowIndex])
        ? normaliseGeneratedRowValues(generatedRows[rowIndex])
        : [];
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
      const generatedRow = generator.generateRow();
      const generationErrors = getGeneratorRuntimeErrors(generator);
      if (generationErrors.length > 0) {
        return createConstraintImpactFailure({
          generatedCount: index,
          failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
          report: generator.compilationReport(),
        });
      }
      dataTable.appendDataRow(normaliseGeneratedRowValues(generatedRow));
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

export {
  EXPORT_LINE_ENDINGS,
  applyExportTextEncoding,
  resolveDefaultLineEndingForPlatform,
  resolveExportTextEncodingSettings,
};

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
    errors.push(CoreGenerationErrors.invalidTextSpecRequired());
  }
  if (typeof inputData !== 'string' || inputData.length === 0) {
    errors.push(CoreGenerationErrors.invalidInputDataRequired());
  }
  if (typeof inputFormat !== 'string' || inputFormat.trim().length === 0) {
    errors.push(CoreGenerationErrors.invalidInputFormatRequired());
  }
  if (!SUPPORTED_FORMATS.includes(outputFormat)) {
    errors.push(CoreGenerationErrors.invalidOutputFormat(SUPPORTED_FORMATS));
  }
  if (errors.length > 0) {
    return { ok: false, errors, diagnostics: { supportedFormats: SUPPORTED_FORMATS } };
  }

  const normalisedInputFormat = String(inputFormat).trim().toLowerCase();
  const importer = createImporter();
  if (!importer.canImport(normalisedInputFormat)) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.invalidInputFormatSupported(Object.keys(importer.convertors).sort())],
      diagnostics: {},
    };
  }

  let sourceTable;
  try {
    sourceTable = importer.toGenericDataTable(normalisedInputFormat, inputData);
  } catch (error) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.inputParseError(normalisedInputFormat)],
      diagnostics: { message: error?.message || 'Input parsing failed.' },
    };
  }
  if (!sourceTable || !Array.isArray(sourceTable.rows)) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.inputParseError(normalisedInputFormat)],
      diagnostics: {},
    };
  }

  const importedRowCount = sourceTable.getRowCount();
  const amendCount = normaliseAmendCount(rowCount, importedRowCount);
  if (amendCount === undefined) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.invalidAmendRowCount()],
      diagnostics: {},
    };
  }
  if (amendCount > importedRowCount) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.rowCountExceedsImported(importedRowCount)],
      diagnostics: { importedRowCount },
    };
  }

  const scopedFaker = createScopedFaker(seed);
  const parseResult = parseSchemaText({
    schemaText: textSpec,
    faker: scopedFaker,
    RandExp,
    options: { unsafeFakerExpressions },
  });
  if (!parseResult.ok) {
    return { ok: false, errors: parseResult.errors, diagnostics: { report: parseResult.report } };
  }
  const generator = parseResult.generator;

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
    const generationErrors = getGeneratorRuntimeErrors(generator);
    if (generationErrors.length > 0) {
      return createConstraintImpactFailure({
        generatedCount: rowIndex,
        failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
        report: generator.compilationReport(),
      });
    }
    for (let schemaIndex = 0; schemaIndex < schemaHeaderIndexes.length; schemaIndex += 1) {
      const targetIndex = schemaHeaderIndexes[schemaIndex];
      const generatedValue = generatedRow[schemaIndex];
      targetRow[targetIndex] = normaliseGeneratedCellValue(generatedValue);
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
  const scopedFaker = createScopedFaker(seed);
  return parseAndCompileSchema({
    textSpec,
    fakerInstance: scopedFaker,
    unsafeFakerExpressions,
    rowCount,
    outputFormat,
  });
}

function getCsvStreamSettings(options = {}) {
  const quoteChar = typeof options.quoteChar === 'string' && options.quoteChar.length > 0 ? options.quoteChar : '"';
  const escapeChar =
    typeof options.escapeChar === 'string' && options.escapeChar.length > 0 ? options.escapeChar : quoteChar;
  const includeHeader = options.header !== false;
  return { quoteChar, escapeChar, includeHeader };
}

function getDsvStreamSettings(options = {}) {
  const delimiter = typeof options.delimiter === 'string' && options.delimiter.length > 0 ? options.delimiter : '\t';
  const quoteChar = typeof options.quoteChar === 'string' && options.quoteChar.length > 0 ? options.quoteChar : '"';
  const escapeChar =
    typeof options.escapeChar === 'string' && options.escapeChar.length > 0 ? options.escapeChar : quoteChar;
  const includeHeader = options.header !== false;
  return { delimiter, quoteChar, escapeChar, includeHeader };
}

function quoteCsvValue(value, { quoteChar, escapeChar }) {
  const text = String(normaliseGeneratedCellValue(value) ?? '');
  const escapedQuote = `${escapeChar}${quoteChar}`;
  const escaped = text.split(quoteChar).join(escapedQuote);
  return `${quoteChar}${escaped}${quoteChar}`;
}

function rowToCsv(headers, row, csvSettings) {
  return headers.map((_, index) => quoteCsvValue(row[index], csvSettings)).join(',');
}

function rowToDsv(headers, row, dsvSettings) {
  return headers.map((_, index) => quoteCsvValue(row[index], dsvSettings)).join(dsvSettings.delimiter);
}

function rowToJsonLine(headers, rowArray, options = {}) {
  const rowObject = rowArrayToObject(headers, rowArray, options);
  return JSON.stringify(rowObject);
}

function rowArrayToObject(headers, rowArray, options = {}) {
  const makeNumbersNumeric = options?.makeNumbersNumeric === true;
  const rowObject = {};
  for (let i = 0; i < headers.length; i += 1) {
    const header = headers[i];
    const value = rowArray[i] === undefined || rowArray[i] === null ? '' : rowArray[i];
    if (makeNumbersNumeric) {
      const text = String(value);
      if (text.trim().length === 0) {
        rowObject[header] = value;
      } else if (Number.isFinite(Number(text))) {
        rowObject[header] = Number(text);
      } else {
        rowObject[header] = value;
      }
    } else {
      rowObject[header] = value;
    }
  }
  return rowObject;
}

function getUnsupportedStreamingOptionWarnings(outputFormat, options = {}) {
  const warnings = [];
  if (outputFormat === 'json') {
    if (options.asObject === true) {
      warnings.push('Streaming JSON ignores option asObject=true and always emits a JSON array.');
    }
    if (typeof options.asPropertyNamed === 'string' && options.asPropertyNamed.trim().length > 0) {
      warnings.push('Streaming JSON ignores option asPropertyNamed and always emits a JSON array.');
    }
    if (options.prettyPrint === true || options.prettyPrintDelimiter !== undefined) {
      warnings.push('Streaming JSON ignores prettyPrint options and emits compact JSON.');
    }
    if (options.outputAsJsonLines === true) {
      warnings.push('Streaming JSON ignores outputAsJsonLines=true and emits a JSON array.');
    }
  }
  return warnings;
}

function parseXmlAttributeColumns(attributeColumnsCsv) {
  return String(attributeColumnsCsv ?? '')
    .split(',')
    .map((column) => column.trim())
    .filter((column) => column.length > 0);
}

function normaliseXmlName(originalName, fallbackName, contextLabel, usedNames, warnings) {
  const namesInUse = usedNames || new Set();
  const inputName = String(originalName ?? '').trim();
  let normalised = inputName.length > 0 ? inputName : fallbackName;
  normalised = normalised.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.-]/g, '_');
  if (!/^[A-Za-z_]/.test(normalised)) normalised = `_${normalised}`;
  if (/^xml/i.test(normalised)) normalised = `_${normalised}`;
  if (normalised.length === 0) normalised = fallbackName;
  let deduplicated = normalised;
  let suffix = 2;
  while (namesInUse.has(deduplicated)) {
    deduplicated = `${normalised}_${suffix}`;
    suffix += 1;
  }
  namesInUse.add(deduplicated);
  if (inputName !== deduplicated) {
    warnings.push(`Auto-fixed XML ${contextLabel} name "${inputName}" -> "${deduplicated}"`);
  }
  return deduplicated;
}

function sanitizeXmlCharacters(value) {
  const text = String(value ?? '');
  let sanitized = '';
  for (const char of text) {
    const codePoint = char.codePointAt(0);
    const isValidXmlChar =
      codePoint === 0x9 ||
      codePoint === 0xa ||
      codePoint === 0xd ||
      (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
      (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
      (codePoint >= 0x10000 && codePoint <= 0x10ffff);
    if (isValidXmlChar) sanitized += char;
  }
  return sanitized;
}

function escapeXmlValue(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function createXmlStreamContext(headers, options = {}, warnings = []) {
  const includeXmlHeader = options.includeXmlHeader !== false;
  const rootElementName = normaliseXmlName(options.rootElementName, 'root', 'root element', new Set(), warnings);
  const itemElementName = normaliseXmlName(options.itemElementName, 'item', 'item element', new Set(), warnings);
  const attributeColumnNames = parseXmlAttributeColumns(options.attributeColumnsCsv);
  const knownAttributeColumnNames = new Set();
  attributeColumnNames.forEach((attributeColumnName) => {
    if (headers.includes(attributeColumnName)) {
      knownAttributeColumnNames.add(attributeColumnName);
    } else {
      warnings.push(`Ignored unknown XML attribute column: ${attributeColumnName}`);
    }
  });
  const usedColumnXmlNames = new Set();
  const headerXmlNames = headers.map((header) => {
    const context = knownAttributeColumnNames.has(header) ? 'attribute column' : 'child element column';
    return normaliseXmlName(header, 'column', context, usedColumnXmlNames, warnings);
  });
  const xmlnsValue = String(options.xmlns ?? '').trim();
  const xmlnsAttribute = xmlnsValue.length > 0 ? ` xmlns="${escapeXmlValue(xmlnsValue)}"` : '';
  return {
    includeXmlHeader,
    rootElementName,
    itemElementName,
    knownAttributeColumnNames,
    headerXmlNames,
    xmlnsAttribute,
  };
}

function rowToXmlItem(headers, headerXmlNames, rowArray, knownAttributeColumnNames, itemElementName) {
  const itemAttributes = [];
  const childElements = [];
  headers.forEach((header, columnIndex) => {
    const value = sanitizeXmlCharacters(rowArray[columnIndex]);
    const xmlName = headerXmlNames[columnIndex];
    if (knownAttributeColumnNames.has(header)) {
      itemAttributes.push(`${xmlName}="${escapeXmlValue(value)}"`);
      return;
    }
    childElements.push(`    <${xmlName}>${escapeXmlValue(value)}</${xmlName}>`);
  });
  const attributesSuffix = itemAttributes.length > 0 ? ` ${itemAttributes.join(' ')}` : '';
  return [`  <${itemElementName}${attributesSuffix}>`, ...childElements, `  </${itemElementName}>`].join('\n');
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

  if (!['csv', 'jsonl', 'dsv', 'json', 'xml'].includes(outputFormat)) {
    return {
      ok: false,
      errors: ['Streaming currently supports only csv, jsonl, dsv, json and xml formats.'],
      diagnostics: {
        supportedStreamingFormats: ['csv', 'jsonl', 'dsv', 'json', 'xml'],
      },
    };
  }

  const { generator, safeRowCount } = validation;
  const headers = generator.generateHeadersArray();
  const rows = collectRows ? [] : null;
  let firstRow = null;
  const report = generator.compilationReport();
  const csvSettings = outputFormat === 'csv' ? getCsvStreamSettings(options) : null;
  const dsvSettings = outputFormat === 'dsv' ? getDsvStreamSettings(options) : null;
  const diagnosticsWarnings = getUnsupportedStreamingOptionWarnings(outputFormat, options);
  const xmlContext = outputFormat === 'xml' ? createXmlStreamContext(headers, options, diagnosticsWarnings) : null;

  if (outputFormat === 'csv' && csvSettings.includeHeader) {
    await onChunk(headers.map((header) => quoteCsvValue(header, csvSettings)).join(','));
  }
  if (outputFormat === 'dsv' && dsvSettings.includeHeader) {
    await onChunk(headers.map((header) => quoteCsvValue(header, dsvSettings)).join(dsvSettings.delimiter));
  }
  if (outputFormat === 'json') {
    await onChunk('[');
  }
  if (outputFormat === 'xml') {
    if (xmlContext.includeXmlHeader) {
      await onChunk('<?xml version="1.0" encoding="utf-8"?>');
    }
    await onChunk(`<${xmlContext.rootElementName}${xmlContext.xmlnsAttribute}>`);
  }

  for (let index = 0; index < safeRowCount; index += 1) {
    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorRuntimeErrors(generator);
    if (generationErrors.length > 0) {
      return createConstraintImpactFailure({
        generatedCount: index,
        failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
        report,
      });
    }
    const rowArray = normaliseGeneratedRowValues(generatedRow);
    if (firstRow === null) {
      firstRow = rowArray;
    }
    if (rows) {
      rows.push(rowArray);
    }
    if (outputFormat === 'csv') {
      await onChunk(rowToCsv(headers, rowArray, csvSettings));
    } else if (outputFormat === 'dsv') {
      await onChunk(rowToDsv(headers, rowArray, dsvSettings));
    } else if (outputFormat === 'jsonl') {
      await onChunk(rowToJsonLine(headers, rowArray, options));
    } else if (outputFormat === 'json') {
      const rowObject = rowArrayToObject(headers, rowArray, options);
      await onChunk(index === 0 ? JSON.stringify(rowObject) : `,${JSON.stringify(rowObject)}`);
    } else if (outputFormat === 'xml') {
      await onChunk(
        rowToXmlItem(
          headers,
          xmlContext.headerXmlNames,
          rowArray,
          xmlContext.knownAttributeColumnNames,
          xmlContext.itemElementName
        )
      );
    }
  }
  if (outputFormat === 'json') {
    await onChunk(']');
  }
  if (outputFormat === 'xml') {
    await onChunk(`</${xmlContext.rootElementName}>`);
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
      warnings: diagnosticsWarnings,
    },
  };
}

export { SUPPORTED_FORMATS };
export { Exporter, GenericDataTable };
export { CombinationAlgorithm, CombinationsTestDataGenerator, PairwiseTestDataGenerator };
export { OPTION_KEYS_BY_FORMAT, OPTION_TIPS_BY_FORMAT, normalizeFormat, sanitizeOptionsForFormat, getTipsForFormat };
