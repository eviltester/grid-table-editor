import { Faker, faker } from '@faker-js/faker';
import RandExp from 'randexp';
import Papa from 'papaparse';
import { GenericDataTable } from '../js/data_formats/generic-data-table.js';
import { Exporter } from '../js/grid/exporter.js';
import { Importer } from '../js/grid/importer.js';
import { applyImportTrimSettingsToDataTable, normalizeImportTrimSettings } from '../js/grid/import-trim-settings.js';
import { getAllowedFakerCommandsAlphabetical, isForbiddenFakerCommand } from '../js/faker/faker-commands.js';
import { PairwiseTestDataGenerator } from '../js/data_generation/n-wise/pairwiseTestDataGenerator.js';
import {
  CombinationAlgorithm,
  CombinationsTestDataGenerator,
} from '../js/data_generation/n-wise/combinationsTestDataGenerator.js';
import { looksLikeInlineRuleSpec, startsConstraint } from '../js/data_generation/inline-schema-rule.js';
import { parseSchemaText } from '../js/data_generation/schema-conversion.js';
import { hasSafeFakerLiteralArguments } from '../js/data_generation/faker/safeLiteralArgumentParser.js';
import { getDomainKeywordByAlias } from '../js/domain/domain-keywords.js';
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
export const CONSTRAINT_FAILURE_BATCH_SIZE = 1000;
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
  let pendingName = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || /^\s*#/.test(line) || startsConstraint(trimmed)) {
      pendingName = null;
      continue;
    }

    let matchedInlineRule = false;
    for (let separatorIndex = 0; separatorIndex < line.length; separatorIndex += 1) {
      if (line[separatorIndex] !== ':') {
        continue;
      }
      const rule = line.slice(separatorIndex + 1).trim();
      if (looksLikeInlineRuleSpec(rule)) {
        ruleLines.push(rule);
        pendingName = null;
        matchedInlineRule = true;
        break;
      }
    }

    if (matchedInlineRule) {
      continue;
    }

    if (pendingName === null) {
      pendingName = trimmed;
      continue;
    }

    ruleLines.push(trimmed);
    pendingName = null;
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

function validateForbiddenFakerRules(textSpec) {
  const ruleLines = extractRuleLines(textSpec);

  for (const ruleLine of ruleLines) {
    if (!looksLikeFakerRule(ruleLine)) {
      continue;
    }

    const fakerCommand = getFakerCommandFromRule(ruleLine);
    if (getDomainKeywordByAlias(fakerCommand)) {
      continue;
    }

    if (isForbiddenFakerCommand(fakerCommand)) {
      return {
        ok: false,
        error: `Forbidden faker command: ${fakerCommand}. This command is known but not allowed through the API.`,
      };
    }
  }

  return { ok: true };
}

export function validateSafeFakerRules(textSpec) {
  const ruleLines = extractRuleLines(textSpec);
  const allowedCommandSet = new Set(getAllowedFakerCommandsAlphabetical().filter((command) => command !== 'RegEx'));

  for (const ruleLine of ruleLines) {
    if (!looksLikeFakerRule(ruleLine)) {
      continue;
    }

    const fakerCommand = getFakerCommandFromRule(ruleLine);
    if (getDomainKeywordByAlias(fakerCommand)) {
      continue;
    }

    if (isForbiddenFakerCommand(fakerCommand)) {
      return {
        ok: false,
        error: `Forbidden faker command in safe mode: ${fakerCommand}. This command is known but not allowed through the API.`,
      };
    }

    if (!allowedCommandSet.has(fakerCommand)) {
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

function createScopedFaker(seed, fakerOverride) {
  const scopedFaker = fakerOverride || new Faker({ locale: faker.rawDefinitions });
  if (typeof seed === 'number' && typeof scopedFaker?.seed === 'function') {
    scopedFaker.seed(seed);
  }
  return scopedFaker;
}

function validateSupportedOutputFormat(outputFormat = DEFAULT_FORMAT) {
  if (!SUPPORTED_FORMATS.includes(outputFormat)) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.invalidOutputFormat(SUPPORTED_FORMATS)],
      diagnostics: { supportedFormats: SUPPORTED_FORMATS },
    };
  }

  return { ok: true };
}

function compileGenerationState({
  textSpec,
  seed,
  unsafeFakerExpressions = false,
  safeFakerRules = false,
  fakerInstance,
  RandExpClass = RandExp,
} = {}) {
  if (typeof textSpec !== 'string' || textSpec.trim().length === 0) {
    return { ok: false, errors: [CoreGenerationErrors.invalidTextSpecRequired()], diagnostics: {} };
  }

  const forbiddenValidation = validateForbiddenFakerRules(textSpec);
  if (!forbiddenValidation.ok) {
    return {
      ok: false,
      errors: [
        {
          code: 'unsafe_faker_rule',
          message: forbiddenValidation.error,
        },
      ],
      diagnostics: { mode: safeFakerRules ? 'safe' : 'default' },
    };
  }

  if (safeFakerRules) {
    const safeValidation = validateSafeFakerRules(textSpec);
    if (!safeValidation.ok) {
      return {
        ok: false,
        errors: [
          {
            code: 'unsafe_faker_rule',
            message: safeValidation.error,
          },
        ],
        diagnostics: { mode: 'safe' },
      };
    }
  }

  const scopedFaker = createScopedFaker(seed, fakerInstance);
  const parseResult = parseSchemaText({
    schemaText: textSpec,
    faker: scopedFaker,
    RandExp: RandExpClass,
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

  return {
    ok: true,
    faker: scopedFaker,
    RandExpClass,
    generator: parseResult.generator,
    diagnostics: {
      report: parseResult.generator?.compilationReport?.() || parseResult.report || '',
    },
  };
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

function isConstraintGenerationFailure(errors = []) {
  return (Array.isArray(errors) ? errors : []).some(
    (error) => String(error?.code || '') === 'constraint_generation_failed'
  );
}

function createDataTableFromRows(headers = [], rows = []) {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(Array.isArray(headers) ? [...headers] : []);
  rows.forEach((row) => {
    dataTable.appendDataRow(Array.isArray(row) ? [...row] : []);
  });
  return dataTable;
}

function renderGeneratedRows({ headers = [], rows = [], outputFormat, options = {} } = {}) {
  if (!outputFormat) {
    return '';
  }

  const formatValidation = validateSupportedOutputFormat(outputFormat);
  if (!formatValidation.ok) {
    return formatValidation;
  }

  const exporter = createExporter();
  if (options && Object.keys(options).length > 0) {
    exporter.setOptionsForType(outputFormat, options);
  }

  return {
    ok: true,
    rendered: exporter.getDataTableAs(outputFormat, createDataTableFromRows(headers, rows)) || '',
  };
}

function reorderRowsToOriginalHeaders(generatedRows = [], originalHeaders = []) {
  const generatedHeaders = Array.isArray(generatedRows[0]) ? generatedRows[0] : [];
  const generatedHeaderIndexes = new Map(generatedHeaders.map((header, index) => [header, index]));
  const rows = [];
  for (let rowIndex = 1; rowIndex < generatedRows.length; rowIndex += 1) {
    const generatedRow = Array.isArray(generatedRows[rowIndex])
      ? normaliseGeneratedRowValues(generatedRows[rowIndex])
      : [];
    rows.push(
      originalHeaders.map((header) => {
        const generatedIndex = generatedHeaderIndexes.get(header);
        return generatedIndex === undefined ? '' : generatedRow[generatedIndex];
      })
    );
  }
  return rows;
}

function createGenerationRowsResult({
  headers = [],
  rows = [],
  diagnostics = {},
  outputFormat,
  options = {},
  errors = [],
  warnings = [],
  aborted = false,
  partial = false,
} = {}) {
  const renderedResult = renderGeneratedRows({ headers, rows, outputFormat, options });
  if (outputFormat && !renderedResult.ok) {
    return renderedResult;
  }

  const nextDiagnostics = {
    ...diagnostics,
    warnings,
  };

  return {
    ok: errors.length === 0,
    errors,
    headers,
    rows,
    rendered: renderedResult?.rendered || '',
    format: outputFormat,
    diagnostics: nextDiagnostics,
    aborted,
    partial,
  };
}

function normalizeAmendWorkingSet({ headers = [], rows = [] } = {}) {
  const safeHeaders = Array.isArray(headers) ? [...headers] : [];
  const safeRows = Array.isArray(rows)
    ? rows.map((row) => {
        const nextRow = Array.isArray(row) ? [...row] : [];
        while (nextRow.length < safeHeaders.length) {
          nextRow.push('');
        }
        return nextRow;
      })
    : [];

  return { headers: safeHeaders, rows: safeRows };
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

function validateRowCount(rowCount) {
  const safeRowCount = Number.parseInt(rowCount, 10);
  if (!Number.isInteger(safeRowCount) || safeRowCount < 0) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.invalidRowCountRequired()],
      diagnostics: {},
    };
  }

  return { ok: true, rowCount: safeRowCount };
}

function validateOptionalOutputFormat(outputFormat) {
  if (!outputFormat) {
    return { ok: true };
  }

  return validateSupportedOutputFormat(outputFormat);
}

function generateRowsSync({ generator, rowCount, outputFormat, options = {}, diagnostics = {} } = {}) {
  const rowCountValidation = validateRowCount(rowCount);
  if (!rowCountValidation.ok) {
    return rowCountValidation;
  }

  const safeRowCount = rowCountValidation.rowCount;
  const headers = generator.generateHeadersArray();
  const rows = [];

  for (let index = 0; index < safeRowCount; index += 1) {
    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorRuntimeErrors(generator);
    if (generationErrors.length > 0) {
      if (isConstraintGenerationFailure(generationErrors)) {
        return createConstraintImpactFailure({
          generatedCount: index,
          failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
          report: diagnostics.report,
        });
      }

      return {
        ok: false,
        errors: generationErrors,
        diagnostics: {
          ...diagnostics,
          rowCount: rows.length,
        },
      };
    }

    rows.push(normaliseGeneratedRowValues(generatedRow));
  }

  return createGenerationRowsResult({
    headers,
    rows,
    diagnostics: {
      ...diagnostics,
      rowCount: safeRowCount,
    },
    outputFormat,
    options,
  });
}

async function generateRowsWithHooks({
  generator,
  rowCount,
  outputFormat,
  options = {},
  diagnostics = {},
  hooks = {},
} = {}) {
  const rowCountValidation = validateRowCount(rowCount);
  if (!rowCountValidation.ok) {
    return rowCountValidation;
  }

  const safeRowCount = rowCountValidation.rowCount;
  const headers = generator.generateHeadersArray();
  const rows = [];
  let failedRows = 0;
  let retryCount = 0;

  for (let index = 0; index < safeRowCount; ) {
    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorRuntimeErrors(generator);
    if (generationErrors.length > 0) {
      if (!isConstraintGenerationFailure(generationErrors)) {
        return {
          ok: false,
          errors: generationErrors,
          headers,
          rows,
          diagnostics: {
            ...diagnostics,
            rowCount: rows.length,
            failedRows,
            retryCount,
          },
          partial: rows.length > 0,
          aborted: false,
        };
      }

      failedRows += CONSTRAINT_FAILURE_BATCH_SIZE;
      let continueRequested = false;
      const continueGeneration = () => {
        continueRequested = true;
      };

      await hooks.onConstraintImpact?.({
        generatedRows: rows.length,
        failedRows,
        retryCount,
        continueGeneration,
        message: CoreGenerationErrors.constraintImpactingRowGeneration(rows.length, failedRows).message,
      });

      if (!continueRequested) {
        await hooks.onPartialResult?.({
          generatedRows: rows.length,
          failedRows,
          aborted: true,
          headers,
          rows,
        });

        return createGenerationRowsResult({
          headers,
          rows,
          diagnostics: {
            ...diagnostics,
            rowCount: rows.length,
            failedRows,
            retryCount,
          },
          outputFormat,
          options,
          errors: [CoreGenerationErrors.constraintImpactingRowGeneration(rows.length, failedRows)],
          aborted: true,
          partial: rows.length > 0,
        });
      }

      retryCount += 1;
      continue;
    }

    rows.push(normaliseGeneratedRowValues(generatedRow));
    index += 1;
    await hooks.onProgress?.({
      phase: 'generateRows',
      generatedRows: rows.length,
      targetRows: safeRowCount,
      message: `Generated ${rows.length} of ${safeRowCount} rows.`,
    });
  }

  return createGenerationRowsResult({
    headers,
    rows,
    diagnostics: {
      ...diagnostics,
      rowCount: safeRowCount,
      failedRows,
      retryCount,
    },
    outputFormat,
    options,
  });
}

function generatePairwiseRows({
  generator,
  fakerInstance,
  RandExpClass = RandExp,
  outputFormat,
  options = {},
  diagnostics = {},
  rowCount,
} = {}) {
  const warnings = [];
  if (rowCount !== undefined && rowCount !== null) {
    warnings.push('rowCount is ignored when pairwise generation is enabled.');
  }

  const pairwiseGenerator = new PairwiseTestDataGenerator(fakerInstance, RandExpClass);
  const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules(), {
    constraints: typeof generator.schemaConstraints === 'function' ? generator.schemaConstraints() : [],
  });
  if (initResult?.isError) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.pairwiseInitializationFailed(initResult.errorMessage)],
      diagnostics: {
        ...diagnostics,
      },
    };
  }

  const rowsResult = pairwiseGenerator.generateAllDataRecordsAsRows();
  if (rowsResult?.isError) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.pairwiseGenerationFailed(rowsResult.errorMessage)],
      diagnostics: {
        ...diagnostics,
      },
    };
  }

  const headers = generator.generateHeadersArray();
  const rows = reorderRowsToOriginalHeaders(rowsResult?.data?.data || [], headers);
  return createGenerationRowsResult({
    headers,
    rows,
    diagnostics: {
      ...diagnostics,
      rowCount: rows.length,
      pairwise: true,
    },
    outputFormat,
    options,
    warnings,
  });
}

function mergeHeaders(baseHeaders, schemaHeaders) {
  const mergedHeaders = [...baseHeaders];
  for (const header of schemaHeaders) {
    if (!mergedHeaders.includes(header)) {
      mergedHeaders.push(header);
    }
  }
  return mergedHeaders;
}

function applyGeneratedValuesToRow(targetRow, generatedRow, schemaHeaderIndexes) {
  for (let schemaIndex = 0; schemaIndex < schemaHeaderIndexes.length; schemaIndex += 1) {
    const targetIndex = schemaHeaderIndexes[schemaIndex];
    targetRow[targetIndex] = normaliseGeneratedCellValue(generatedRow[schemaIndex]);
  }
}

function normalizeSelectedIndexes(selectedRowIndexes = []) {
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
  ].sort((left, right) => left - right);
}

function amendRowsSync({
  generator,
  headers = [],
  rows = [],
  rowCount,
  mode = 'amend-table',
  selectedRowIndexes = [],
  outputFormat,
  options = {},
  diagnostics = {},
} = {}) {
  const normalized = normalizeAmendWorkingSet({ headers, rows });
  const importedRowCount = normalized.rows.length;
  const amendCount = normaliseAmendCount(rowCount, importedRowCount);
  if (amendCount === undefined) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.invalidAmendRowCount()],
      diagnostics: {},
    };
  }
  if (mode !== 'amend-selected' && amendCount > importedRowCount) {
    return {
      ok: false,
      errors: [CoreGenerationErrors.rowCountExceedsImported(importedRowCount)],
      diagnostics: { importedRowCount },
    };
  }

  const schemaHeaders = generator.generateHeadersArray();
  const mergedHeaders = mergeHeaders(normalized.headers, schemaHeaders);
  const headerIndexMap = new Map(mergedHeaders.map((header, index) => [header, index]));
  const schemaHeaderIndexes = schemaHeaders.map((header) => headerIndexMap.get(header));
  const workingRows = normalizeAmendWorkingSet({ headers: mergedHeaders, rows: normalized.rows }).rows;

  if (mode === 'amend-selected') {
    const normalizedIndexes = normalizeSelectedIndexes(selectedRowIndexes);
    if (normalizedIndexes.length === 0) {
      return {
        ok: true,
        errors: [],
        headers: mergedHeaders,
        rows: workingRows,
        rendered: '',
        format: outputFormat,
        diagnostics: {
          ...diagnostics,
          rowCount: 0,
          importedRowCount,
          noSelectedRows: true,
        },
      };
    }

    const rowsToAmend = Math.min(amendCount, normalizedIndexes.length);
    for (let amendIndex = 0; amendIndex < rowsToAmend; amendIndex += 1) {
      const targetRowIndex = normalizedIndexes[amendIndex];
      if (targetRowIndex < 0 || targetRowIndex >= workingRows.length) {
        continue;
      }

      const generatedRow = generator.generateRow();
      const generationErrors = getGeneratorRuntimeErrors(generator);
      if (generationErrors.length > 0) {
        if (isConstraintGenerationFailure(generationErrors)) {
          return createConstraintImpactFailure({
            generatedCount: amendIndex,
            failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
            report: diagnostics.report,
          });
        }

        return {
          ok: false,
          errors: generationErrors,
          diagnostics: {
            ...diagnostics,
            rowCount: amendIndex,
            importedRowCount,
          },
        };
      }

      applyGeneratedValuesToRow(
        workingRows[targetRowIndex],
        normaliseGeneratedRowValues(generatedRow),
        schemaHeaderIndexes
      );
    }

    return createGenerationRowsResult({
      headers: mergedHeaders,
      rows: workingRows,
      diagnostics: {
        ...diagnostics,
        rowCount: Math.min(amendCount, normalizedIndexes.length),
        importedRowCount,
      },
      outputFormat,
      options,
    });
  }

  for (let rowIndex = 0; rowIndex < amendCount; rowIndex += 1) {
    while (rowIndex >= workingRows.length) {
      workingRows.push(createBlankRow(mergedHeaders.length));
    }

    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorRuntimeErrors(generator);
    if (generationErrors.length > 0) {
      if (isConstraintGenerationFailure(generationErrors)) {
        return createConstraintImpactFailure({
          generatedCount: rowIndex,
          failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
          report: diagnostics.report,
        });
      }

      return {
        ok: false,
        errors: generationErrors,
        diagnostics: {
          ...diagnostics,
          rowCount: rowIndex,
          importedRowCount,
        },
      };
    }

    applyGeneratedValuesToRow(workingRows[rowIndex], normaliseGeneratedRowValues(generatedRow), schemaHeaderIndexes);
  }

  return createGenerationRowsResult({
    headers: mergedHeaders,
    rows: workingRows,
    diagnostics: {
      ...diagnostics,
      rowCount: amendCount,
      importedRowCount,
    },
    outputFormat,
    options,
  });
}

async function streamRowsFromGenerator({
  generator,
  rowCount,
  outputFormat = DEFAULT_FORMAT,
  options = {},
  onChunk,
  collectRows = false,
  diagnostics = {},
  hooks = {},
} = {}) {
  if (typeof onChunk !== 'function') {
    return {
      ok: false,
      errors: ['onChunk callback is required and must be a function.'],
      diagnostics: {},
    };
  }

  const rowCountValidation = validateRowCount(rowCount);
  if (!rowCountValidation.ok) {
    return rowCountValidation;
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

  const safeRowCount = rowCountValidation.rowCount;
  const headers = generator.generateHeadersArray();
  const rows = collectRows ? [] : null;
  let firstRow = null;
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
      if (isConstraintGenerationFailure(generationErrors)) {
        return createConstraintImpactFailure({
          generatedCount: index,
          failedCount: CONSTRAINT_FAILURE_BATCH_SIZE,
          report: diagnostics.report,
        });
      }

      return {
        ok: false,
        errors: generationErrors,
        diagnostics: {
          ...diagnostics,
          rowCount: index,
        },
      };
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

    await hooks.onProgress?.({
      phase: 'streamRows',
      generatedRows: index + 1,
      targetRows: safeRowCount,
      message: `Streamed ${index + 1} of ${safeRowCount} rows.`,
    });
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
      ...diagnostics,
      rowCount: safeRowCount,
      streamed: true,
      firstRow,
      collectRows,
      warnings: diagnosticsWarnings,
    },
  };
}

function createGenerationSession({
  textSpec,
  seed,
  unsafeFakerExpressions = false,
  safeFakerRules = false,
  schemaSource = null,
  fakerInstance,
  RandExpClass = RandExp,
} = {}) {
  const compiled = compileGenerationState({
    textSpec,
    seed,
    unsafeFakerExpressions,
    safeFakerRules,
    fakerInstance,
    RandExpClass,
  });
  const baseDiagnostics = {
    ...(compiled.diagnostics || {}),
    schemaSource,
  };

  return {
    schemaSource,
    diagnostics: baseDiagnostics,
    isValid() {
      return compiled.ok === true;
    },
    getErrors() {
      return compiled.ok ? [] : compiled.errors || [];
    },
    generateRows({ rowCount, hooks, outputFormat, options = {} } = {}) {
      if (!compiled.ok) {
        return {
          ok: false,
          errors: compiled.errors,
          diagnostics: compiled.diagnostics || {},
        };
      }

      const formatValidation = validateOptionalOutputFormat(outputFormat);
      if (!formatValidation.ok) {
        return formatValidation;
      }

      if (hooks && Object.keys(hooks).length > 0) {
        return generateRowsWithHooks({
          generator: compiled.generator,
          rowCount,
          hooks,
          outputFormat,
          options,
          diagnostics: baseDiagnostics,
        });
      }

      return generateRowsSync({
        generator: compiled.generator,
        rowCount,
        outputFormat,
        options,
        diagnostics: baseDiagnostics,
      });
    },
    amendRows({ headers = [], rows = [], rowCount, mode, selectedRowIndexes = [], outputFormat, options = {} } = {}) {
      if (!compiled.ok) {
        return {
          ok: false,
          errors: compiled.errors,
          diagnostics: compiled.diagnostics || {},
        };
      }

      const formatValidation = validateOptionalOutputFormat(outputFormat);
      if (!formatValidation.ok) {
        return formatValidation;
      }

      return amendRowsSync({
        generator: compiled.generator,
        headers,
        rows,
        rowCount,
        mode,
        selectedRowIndexes,
        outputFormat,
        options,
        diagnostics: baseDiagnostics,
      });
    },
    generatePairwise({ rowCount, outputFormat, options = {} } = {}) {
      if (!compiled.ok) {
        return {
          ok: false,
          errors: compiled.errors,
          diagnostics: compiled.diagnostics || {},
        };
      }

      const formatValidation = validateOptionalOutputFormat(outputFormat);
      if (!formatValidation.ok) {
        return formatValidation;
      }

      return generatePairwiseRows({
        generator: compiled.generator,
        fakerInstance: compiled.faker,
        RandExpClass: compiled.RandExpClass,
        rowCount,
        outputFormat,
        options,
        diagnostics: baseDiagnostics,
      });
    },
    streamRows({
      rowCount,
      outputFormat = DEFAULT_FORMAT,
      options = {},
      onChunk,
      collectRows = false,
      hooks = {},
    } = {}) {
      if (!compiled.ok) {
        return Promise.resolve({
          ok: false,
          errors: compiled.errors,
          diagnostics: compiled.diagnostics || {},
        });
      }

      return streamRowsFromGenerator({
        generator: compiled.generator,
        rowCount,
        outputFormat,
        options,
        onChunk,
        collectRows,
        diagnostics: baseDiagnostics,
        hooks,
      });
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
  const formatValidation = validateSupportedOutputFormat(outputFormat);
  if (!formatValidation.ok) {
    return formatValidation;
  }

  const session = createGenerationSession({
    textSpec,
    seed,
    unsafeFakerExpressions,
  });

  return pairwise
    ? session.generatePairwise({ rowCount, outputFormat, options })
    : session.generateRows({ rowCount, outputFormat, options });
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
  trimInput = false,
  trimInputFieldsCsv = '',
  unsafeFakerExpressions = false,
  safeFakerRules = false,
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
  importer.setImportSettings({ trimInput, trimInputFieldsCsv });
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

  const session = createGenerationSession({
    textSpec,
    seed,
    unsafeFakerExpressions,
    safeFakerRules,
  });
  if (!session.isValid()) {
    return { ok: false, errors: session.getErrors(), diagnostics: session.diagnostics || {} };
  }

  if (stream === true || stream === 'true') {
    diagnosticsWarnings.push('stream is ignored for amend operations and buffered mode is always used.');
  }
  const { headers, rows } = toRowsWithHeaderMap(sourceTable);
  const result = session.amendRows({
    headers,
    rows,
    rowCount: amendCount,
    mode: 'amend-table',
    outputFormat,
    options,
  });
  if (!result.ok) {
    return result;
  }

  return {
    ...result,
    diagnostics: {
      ...result.diagnostics,
      warnings: [...(result.diagnostics?.warnings || []), ...diagnosticsWarnings],
    },
  };
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
  if (pairwise) {
    return {
      ok: false,
      errors: ['Streaming does not support pairwise generation.'],
      diagnostics: {},
    };
  }
  const session = createGenerationSession({
    textSpec,
    seed,
    unsafeFakerExpressions,
  });

  return session.streamRows({
    rowCount,
    outputFormat,
    options,
    onChunk,
    collectRows,
  });
}

export { SUPPORTED_FORMATS };
export { Exporter, GenericDataTable };
export { createGenerationSession };
export { CombinationAlgorithm, CombinationsTestDataGenerator, PairwiseTestDataGenerator };
export { OPTION_KEYS_BY_FORMAT, OPTION_TIPS_BY_FORMAT, normalizeFormat, sanitizeOptionsForFormat, getTipsForFormat };
export { applyImportTrimSettingsToDataTable, normalizeImportTrimSettings };
