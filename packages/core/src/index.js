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
  for (const ruleLine of ruleLines) {
    if (!looksLikeFakerRule(ruleLine)) {
      continue;
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

  if (!unsafeFakerExpressions) {
    const safetyValidation = validateSafeFakerRules(textSpec);
    if (!safetyValidation.ok) {
      return {
        ok: false,
        errors: [safetyValidation.error],
        diagnostics: {
          report: 'Rejected unsafe faker expression syntax',
        },
      };
    }
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
