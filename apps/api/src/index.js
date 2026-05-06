#!/usr/bin/env node

import express from 'express';
import {
  createExporterForDefaults as createCoreExporterForDefaults,
  generateFromTextSpec,
  SUPPORTED_FORMATS,
} from '@anywaydata/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/plain', limit: '1mb' }));
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/v1/openapi.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});

app.get('/v1/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'anywaydata-api' });
});

const RESPONSE_FORMATS = new Set(['rows', 'rendered', 'all', 'raw']);
const formatDefaultOptions = new Map();
const formatCustomTips = new Map();
let globalUnsafeFakerEnabled = false;
const UI_OPTION_KEYS_BY_FORMAT = {
  csv: ['quotes', 'header', 'quoteChar', 'escapeChar'],
  dsv: ['delimiter', 'quotes', 'header', 'quoteChar', 'escapeChar'],
  json: ['makeNumbersNumeric', 'prettyPrint', 'asObject', 'asPropertyNamed', 'prettyPrintDelimiter'],
  jsonl: ['makeNumbersNumeric'],
  xml: ['rootElementName', 'itemElementName', 'attributeColumnsCsv', 'includeXmlHeader', 'xmlns'],
  sql: [
    'tableName',
    'maxValuesPerInsert',
    'quoteNumeric',
    'sqlDialect',
    'quoteIdentifiers',
    'nullHandling',
    'wrapTransaction',
  ],
  markdown: [
    'spacePadding',
    'tabPadding',
    'borderBars',
    'emboldenHeaders',
    'emphasisHeaders',
    'emboldenColumns',
    'emphasisColumns',
    'prettyPrint',
    'globalColumnAlign',
  ],
  html: ['compact', 'prettyPrint', 'prettyPrintDelimiter', 'addTheadToTable', 'addTbodyToTable'],
  javascript: [
    'makeNumbersNumeric',
    'prettyPrint',
    'asObject',
    'asPropertyNamed',
    'outputAsJsonLines',
    'prettyPrintDelimiter',
  ],
  python: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useDecimalType',
    'decimalColumnsCsv',
    'decimalTreatIntegersAsDecimal',
    'blankValueBehavior',
    'quoteStyle',
    'prettyPrint',
    'prettyPrintDelimiter',
    'includeImports',
    'importStatements',
    'useAnonymousDicts',
    'objectClassName',
  ],
  java: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useAnonymousMaps',
    'objectClassName',
    'blankValueBehavior',
    'includeImports',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  typescript: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useAnonymousObjects',
    'objectClassName',
    'blankValueBehavior',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  gherkin: ['showHeadings', 'leftIndent', 'inCellPadding', 'prettyPrint'],
  asciitable: ['style'],
  junit4: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit5: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit6: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  testng: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pytest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  unittest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nose2: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  jest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  vitest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mocha: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  xunit: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nunit: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mstest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  rspec: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  minitest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  phpunit: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  kotest: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'junit5-kotlin': [
    'suiteName',
    'testNamePrefix',
    'assertionStyle',
    'includeSetup',
    'prettyPrint',
    'dataSourceStrategy',
  ],
  spek: ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test-more': ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test2-suite': ['suiteName', 'testNamePrefix', 'assertionStyle', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
};
const UI_OPTION_TIPS_BY_FORMAT = {
  csv: {
    quotes: 'Wrap fields in quote characters when exporting CSV.',
    header: 'Include the column header row as the first line of output.',
    quoteChar: 'Character used to quote string values, for example double quote.',
    escapeChar: 'Character used to escape quote characters inside field values.',
  },
  dsv: {
    delimiter: 'Choose the delimiter character used between values in each row.',
    quotes: 'Wrap fields in quote characters when exporting delimited data.',
    header: 'Include the header row as the first line of output.',
    quoteChar: 'Character used to quote string values.',
    escapeChar: 'Character used to escape quote characters inside field values.',
  },
  junit4: {
    suiteName: 'Name of generated Java test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict/basic both map to assertEquals for JUnit4.',
    includeSetup: 'Include @Before setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider/method, inline, or csv source style.',
  },
  junit5: {
    suiteName: 'Name of generated Java test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict/basic both map to assertEquals for JUnit5.',
    includeSetup: 'Include @BeforeEach setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider/method, inline, or csv source style.',
  },
  junit6: {
    suiteName: 'Name of generated Java test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict/basic both map to assertEquals for JUnit6.',
    includeSetup: 'Include @BeforeEach setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider/method, inline, or csv source style.',
  },
  testng: {
    suiteName: 'Name of generated Java test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict/basic both map to assertEquals for TestNG.',
    includeSetup: 'Include @BeforeMethod setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider/method or inline style.',
  },
  pytest: {
    suiteName: 'Name hint for generated test suite.',
    testNamePrefix: 'Prefix for generated test function name.',
    assertionStyle: 'Strict/basic both map to == assertions for pytest.',
    includeSetup: 'Include fixture scaffold and inject it into test signature.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider function or inline rows.',
  },
  jest: {
    suiteName: 'Name of generated Jest describe block.',
    testNamePrefix: 'Prefix for generated test name.',
    assertionStyle: 'Strict uses toStrictEqual; basic uses toEqual.',
    includeSetup: 'Include beforeEach setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Provider function or inline rows.',
  },
  xunit: {
    suiteName: 'Name of generated C# test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict/basic both map to Assert.Equal for xUnit.',
    includeSetup: 'Include constructor setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'MemberData provider or InlineData.',
  },
  rspec: {
    suiteName: 'Name of generated RSpec describe block.',
    testNamePrefix: 'Prefix for generated test name.',
    assertionStyle: 'Strict/basic both map to eq for RSpec.',
    includeSetup: 'Include before block scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Rows constant iteration style.',
  },
  phpunit: {
    suiteName: 'Name of generated PHPUnit test class.',
    testNamePrefix: 'Prefix for generated test method name.',
    assertionStyle: 'Strict uses assertSame; basic uses assertEquals.',
    includeSetup: 'Include setUp() scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data provider rows style.',
  },
  kotest: {
    suiteName: 'Name of generated Kotest spec class.',
    testNamePrefix: 'Prefix for generated test name.',
    assertionStyle: 'Strict/basic both map to shouldBe for Kotest.',
    includeSetup: 'Include beforeTest setup scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Rows collection iteration style.',
  },
  'test-more': {
    suiteName: 'Name hint for generated Perl test script.',
    testNamePrefix: 'Prefix used in assertion labels.',
    assertionStyle: 'Strict uses is_deeply; basic uses is where scalar-safe else is_deeply.',
    includeSetup: 'Include setup variable scaffold.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Row hash iteration style.',
  },
};

function createExporterForDefaults() {
  return createCoreExporterForDefaults();
}

function contentTypeForFormat(outputFormat) {
  const format = String(outputFormat || '').toLowerCase();
  if (format === 'csv') return 'text/csv; charset=utf-8';
  if (format === 'dsv') return 'text/tab-separated-values; charset=utf-8';
  if (format === 'markdown') return 'text/markdown; charset=utf-8';
  if (format === 'json') return 'application/json; charset=utf-8';
  if (format === 'jsonl') return 'application/x-ndjson; charset=utf-8';
  if (format === 'javascript') return 'text/javascript; charset=utf-8';
  if (format === 'python') return 'text/x-python; charset=utf-8';
  if (format === 'java') return 'text/x-java-source; charset=utf-8';
  if (format === 'typescript') return 'application/typescript; charset=utf-8';
  if (format === 'junit4' || format === 'junit5' || format === 'junit6' || format === 'testng')
    return 'text/x-java-source; charset=utf-8';
  if (format === 'pytest' || format === 'unittest' || format === 'nose2') return 'text/x-python; charset=utf-8';
  if (format === 'jest' || format === 'vitest' || format === 'mocha') return 'text/javascript; charset=utf-8';
  if (format === 'xunit' || format === 'nunit' || format === 'mstest') return 'text/x-csharp; charset=utf-8';
  if (format === 'rspec' || format === 'minitest') return 'text/x-ruby; charset=utf-8';
  if (format === 'phpunit' || format === 'pest') return 'application/x-httpd-php; charset=utf-8';
  if (format === 'kotest' || format === 'junit5-kotlin' || format === 'spek') return 'text/x-kotlin; charset=utf-8';
  if (format === 'test-more' || format === 'test2-suite') return 'text/x-perl; charset=utf-8';
  if (format === 'xml') return 'application/xml; charset=utf-8';
  if (format === 'sql') return 'application/sql; charset=utf-8';
  if (format === 'gherkin') return 'text/x-gherkin; charset=utf-8';
  if (format === 'html') return 'text/html; charset=utf-8';
  if (format === 'asciitable') return 'text/plain; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function toErrorResponse(result, statusCode = 400) {
  return {
    statusCode,
    body: {
      errors: Array.isArray(result?.errors) ? result.errors : ['Unknown generation error'],
      diagnostics: result?.diagnostics || {},
    },
  };
}

function cloneValue(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function toOptionsObject(payload) {
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    payload.options &&
    typeof payload.options === 'object'
  ) {
    return payload.options;
  }
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload;
  }
  return {};
}

function sanitiseOptionsForFormat(format, payload) {
  const keys = UI_OPTION_KEYS_BY_FORMAT[normaliseFormat(format)] || [];
  const sourceOptions = toOptionsObject(payload);
  const filteredOptions = {};
  for (const key of keys) {
    if (sourceOptions[key] !== undefined) {
      filteredOptions[key] = sourceOptions[key];
    }
  }
  return filteredOptions;
}

function getTipsForFormat(format) {
  const normalised = normaliseFormat(format);
  const keys = UI_OPTION_KEYS_BY_FORMAT[normalised] || [];
  const configuredTips = UI_OPTION_TIPS_BY_FORMAT[normalised] || {};
  const customTips = formatCustomTips.get(normalised) || {};
  const tips = {};
  for (const key of keys) {
    const tip = customTips[key] || configuredTips[key] || `Configure ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
    if (tip) {
      tips[key] = tip;
    }
  }
  return tips;
}

function setCustomTipsForFormat(format, tipsPayload) {
  const normalised = normaliseFormat(format);
  const keys = UI_OPTION_KEYS_BY_FORMAT[normalised] || [];
  const nextTips = {};
  for (const key of keys) {
    const value = tipsPayload?.[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      nextTips[key] = value;
    }
  }
  if (Object.keys(nextTips).length === 0) {
    formatCustomTips.delete(normalised);
    return;
  }
  formatCustomTips.set(normalised, nextTips);
}

function normaliseFormat(format) {
  return String(format || '').toLowerCase();
}

function isSupportedFormat(format) {
  return SUPPORTED_FORMATS.includes(normaliseFormat(format));
}

function getDefaultOptionsForFormat(format) {
  const normalisedFormat = normaliseFormat(format);
  if (formatDefaultOptions.has(normalisedFormat)) {
    return cloneValue(formatDefaultOptions.get(normalisedFormat));
  }

  const exporter = createExporterForDefaults();
  const builtInDefaults = exporter.getOptionsForType(normalisedFormat);
  const result = sanitiseOptionsForFormat(normalisedFormat, cloneValue(builtInDefaults || {}));
  return result;
}

function setDefaultOptionsForFormat(format, options) {
  const normalisedFormat = normaliseFormat(format);
  const currentDefaults = getDefaultOptionsForFormat(normalisedFormat);
  const mergedOptions = { ...toOptionsObject(currentDefaults), ...toOptionsObject(options) };
  formatDefaultOptions.set(normalisedFormat, sanitiseOptionsForFormat(normalisedFormat, mergedOptions));
}

function resetDefaultOptionsForFormat(format) {
  formatDefaultOptions.delete(normaliseFormat(format));
  formatCustomTips.delete(normaliseFormat(format));
}

function runGeneration(payload = {}) {
  const { textSpec, rowCount, outputFormat = 'csv', options, seed, unsafeFakerExpressions } = payload;
  const concreteOutputFormat = String(outputFormat || 'csv').toLowerCase();

  if (!SUPPORTED_FORMATS.includes(String(outputFormat).toLowerCase())) {
    return {
      ok: false,
      ...toErrorResponse(
        {
          errors: [`outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`],
          diagnostics: {},
        },
        400
      ),
    };
  }

  const effectiveOptions =
    options === undefined
      ? getDefaultOptionsForFormat(concreteOutputFormat)
      : sanitiseOptionsForFormat(concreteOutputFormat, options);

  const parsedSeed = parseSeed(seed);
  if (!parsedSeed.ok) {
    return {
      ok: false,
      ...toErrorResponse(
        {
          errors: [parsedSeed.error],
          diagnostics: {},
        },
        400
      ),
    };
  }

  try {
    const result = generateFromTextSpec({
      textSpec,
      rowCount,
      outputFormat: concreteOutputFormat,
      options: effectiveOptions,
      seed: parsedSeed.seed,
      unsafeFakerExpressions: unsafeFakerExpressions || false,
    });
    if (!result?.ok) {
      return { ok: false, ...toErrorResponse(result, 400) };
    }
    return { ok: true, result };
  } catch (error) {
    return {
      ok: false,
      ...toErrorResponse(
        {
          errors: [error?.message || 'Unhandled generation error'],
          diagnostics: { stack: error?.stack },
        },
        500
      ),
    };
  }
}

function parseSeed(seed) {
  if (seed === undefined || seed === null || seed === '') {
    return { ok: true, seed: undefined };
  }

  const parsed = Number(seed);
  if (!Number.isFinite(parsed)) {
    return { ok: false, error: 'seed must be a finite number when provided.' };
  }

  return { ok: true, seed: parsed };
}

function parseResponseFormat(value) {
  const mode = String(value || 'rows').toLowerCase();
  if (!RESPONSE_FORMATS.has(mode)) {
    return { ok: false, errors: ['responseFormat must be one of: rows, rendered, all, raw'] };
  }
  return { ok: true, mode };
}

function parseBooleanFlag(value) {
  return value === true || value === 'true';
}

function sendGenerateResponse(req, res) {
  const modeResult = parseResponseFormat(req.body?.responseFormat);
  if (!modeResult.ok) {
    return res.status(400).json({ errors: modeResult.errors, diagnostics: {} });
  }

  const allowUnsafe = globalUnsafeFakerEnabled || parseBooleanFlag(req.body?.unsafeFakerExpressions);

  const generated = runGeneration({
    ...(req.body || {}),
    acceptHeader: req.headers.accept,
    unsafeFakerExpressions: allowUnsafe,
  });
  if (!generated.ok) {
    return res.status(generated.statusCode).json(generated.body);
  }

  const result = generated.result;
  if (modeResult.mode === 'raw') {
    return res
      .status(200)
      .type(contentTypeForFormat(result.format))
      .send(result.rendered || '');
  }
  if (modeResult.mode === 'rendered') {
    return res.status(200).json({ rendered: result.rendered, format: result.format });
  }
  if (modeResult.mode === 'all') {
    return res.status(200).json({
      headers: result.headers,
      rows: result.rows,
      rendered: result.rendered,
      format: result.format,
    });
  }
  return res.status(200).json({ headers: result.headers, rows: result.rows, format: result.format });
}

function buildFromSchemaPayload(req) {
  const textSpec = typeof req.body === 'string' ? req.body : '';
  const { rowCount, outputFormat, seed, responseFormat, unsafeFakerExpressions } = req.query || {};
  return {
    textSpec,
    rowCount,
    outputFormat: outputFormat || 'csv',
    seed,
    responseFormat,
    unsafeFakerExpressions: unsafeFakerExpressions === 'true',
  };
}

function sendFromSchemaResponse(req, res) {
  if (typeof req.body !== 'string') {
    return res
      .status(400)
      .json({ errors: ['text/plain request body is required for /generate/fromschema'], diagnostics: {} });
  }

  const payload = buildFromSchemaPayload(req);
  const modeResult = parseResponseFormat(payload.responseFormat);
  if (!modeResult.ok) {
    return res.status(400).json({ errors: modeResult.errors, diagnostics: {} });
  }

  // Allow unsafe expressions if globally enabled or explicitly requested via query param
  const allowUnsafe = globalUnsafeFakerEnabled || payload.unsafeFakerExpressions === true;
  const generated = runGeneration({
    ...payload,
    acceptHeader: req.headers.accept,
    unsafeFakerExpressions: allowUnsafe,
  });
  if (!generated.ok) {
    return res.status(generated.statusCode).json(generated.body);
  }

  const result = generated.result;
  if (modeResult.mode === 'raw') {
    return res
      .status(200)
      .type(contentTypeForFormat(result.format))
      .send(result.rendered || '');
  }
  if (modeResult.mode === 'rendered') {
    return res.status(200).json({ rendered: result.rendered, format: result.format });
  }
  if (modeResult.mode === 'all') {
    return res.status(200).json({
      headers: result.headers,
      rows: result.rows,
      rendered: result.rendered,
      format: result.format,
    });
  }
  return res.status(200).json({ headers: result.headers, rows: result.rows, format: result.format });
}

function sendSetDefaultOptionsResponse(req, res) {
  const format = normaliseFormat(req.params?.format);
  if (!isSupportedFormat(format)) {
    return res.status(400).json({
      errors: [`format must be one of: ${SUPPORTED_FORMATS.join(', ')}`],
      diagnostics: {},
    });
  }

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    return res.status(400).json({
      errors: ['Options payload must be a JSON object'],
      diagnostics: {},
    });
  }

  if (
    req.body.tips !== undefined &&
    (typeof req.body.tips !== 'object' || req.body.tips === null || Array.isArray(req.body.tips))
  ) {
    return res.status(400).json({
      errors: ['tips must be a JSON object when provided'],
      diagnostics: {},
    });
  }
  setDefaultOptionsForFormat(format, req.body);
  setCustomTipsForFormat(format, req.body.tips);
  return res.status(200).json({
    format,
    options: getDefaultOptionsForFormat(format) || {},
    tips: getTipsForFormat(format),
    source: 'custom-default',
  });
}

function sendGetDefaultOptionsResponse(req, res) {
  const format = normaliseFormat(req.params?.format);
  if (!isSupportedFormat(format)) {
    return res.status(400).json({
      errors: [`format must be one of: ${SUPPORTED_FORMATS.join(', ')}`],
      diagnostics: {},
    });
  }

  const options = getDefaultOptionsForFormat(format) || {};
  const source = formatDefaultOptions.has(format) ? 'custom-default' : 'built-in-default';
  const response = { format, options, tips: getTipsForFormat(format), source };
  return res.status(200).json(response);
}

function sendResetDefaultOptionsResponse(req, res) {
  const format = normaliseFormat(req.params?.format);
  if (!isSupportedFormat(format)) {
    return res.status(400).json({
      errors: [`format must be one of: ${SUPPORTED_FORMATS.join(', ')}`],
      diagnostics: {},
    });
  }

  resetDefaultOptionsForFormat(format);
  return res.status(200).json({
    format,
    options: getDefaultOptionsForFormat(format) || {},
    tips: getTipsForFormat(format),
    source: 'built-in-default',
  });
}

app.post('/v1/generate', sendGenerateResponse);
app.post('/v1/generate/fromschema', sendFromSchemaResponse);
app.get('/v1/generate/options/:format', sendGetDefaultOptionsResponse);
app.post('/v1/generate/options/:format', sendSetDefaultOptionsResponse);
app.post('/v1/generate/options/:format/default', sendResetDefaultOptionsResponse);

app.use((error, _req, res, next) => {
  if (error?.type === 'entity.parse.failed' || error instanceof SyntaxError) {
    return res.status(400).json({
      errors: ['Malformed JSON request body. Ensure strings escape new lines as \\n.'],
      diagnostics: { message: error.message },
    });
  }
  return next(error);
});

function parseCliPort(argv = []) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--port') {
      return argv[index + 1];
    }
    if (typeof token === 'string' && token.startsWith('--port=')) {
      return token.slice('--port='.length);
    }
  }
  return undefined;
}

function parseUnsafeFaker(argv = []) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--unsafe-faker=true') {
      return true;
    }
    if (token === '--unsafe-faker=false') {
      return false;
    }
    if (token === '--unsafe-faker') {
      // Check the next argument for bare --unsafe-faker flag
      const nextToken = argv[index + 1];
      if (nextToken === 'false') {
        return false;
      }
      // If next token is 'true', missing, or another flag, treat as enabled
      return true;
    }
  }
  return false;
}

function parsePortValue(rawPort, sourceLabel) {
  if (rawPort === undefined || rawPort === null || rawPort === '') {
    return { ok: false, error: `${sourceLabel} is empty.` };
  }

  const port = Number.parseInt(String(rawPort), 10);
  if (!Number.isInteger(port) || String(port) !== String(rawPort).trim()) {
    return { ok: false, error: `${sourceLabel} must be an integer between 1 and 65535.` };
  }

  if (port < 1 || port > 65535) {
    return { ok: false, error: `${sourceLabel} must be an integer between 1 and 65535.` };
  }

  return { ok: true, port };
}

function resolvePortConfiguration({ argv = process.argv, env = process.env, defaultPort = 3000 } = {}) {
  const cliPortRaw = parseCliPort(argv);
  if (cliPortRaw !== undefined) {
    const parsed = parsePortValue(cliPortRaw, '--port');
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    return { ok: true, port: parsed.port, explicit: true, source: 'cli' };
  }

  if (env.PORT !== undefined) {
    const parsed = parsePortValue(env.PORT, 'PORT');
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    return { ok: true, port: parsed.port, explicit: true, source: 'env' };
  }

  return { ok: true, port: defaultPort, explicit: false, source: 'default' };
}

function listenOnPort(expressApp, port) {
  return new Promise((resolve, reject) => {
    const server = expressApp.listen(port);
    server.once('listening', () => resolve(server));
    server.once('error', (error) => reject(error));
  });
}

async function startApiServer(
  expressApp,
  { argv = process.argv, env = process.env, logger = console.log, defaultPort = 3000 } = {}
) {
  // Parse unsafe faker setting from command line
  const unsafeFakerFromCli = parseUnsafeFaker(argv);
  globalUnsafeFakerEnabled = unsafeFakerFromCli;
  if (globalUnsafeFakerEnabled) {
    logger('WARNING: Unsafe faker expressions enabled globally via command line');
  }

  const portConfig = resolvePortConfiguration({ argv, env, defaultPort });
  if (!portConfig.ok) {
    return { ok: false, code: 'INVALID_PORT', message: portConfig.error };
  }

  const maxFallbackOffset = 20;
  const attemptedPorts = [portConfig.port];

  try {
    const server = await listenOnPort(expressApp, portConfig.port);
    const actualPort = server.address().port; // Get the actual assigned port
    logger(`anywaydata-api listening on ${actualPort}`);
    return { ok: true, server, port: actualPort, source: portConfig.source, attemptedPorts };
  } catch (error) {
    if (error?.code !== 'EADDRINUSE') {
      return {
        ok: false,
        code: error?.code || 'STARTUP_ERROR',
        message: `Unable to start API server: ${error?.message || 'unknown error'}`,
      };
    }

    if (portConfig.explicit) {
      return {
        ok: false,
        code: 'EADDRINUSE',
        message: `Port ${portConfig.port} is already in use. Choose another port with --port or PORT.`,
      };
    }
  }

  for (let offset = 1; offset <= maxFallbackOffset; offset += 1) {
    const candidatePort = portConfig.port + offset;
    attemptedPorts.push(candidatePort);
    try {
      const server = await listenOnPort(expressApp, candidatePort);
      const actualPort = server.address().port; // Get the actual assigned port
      logger(`anywaydata-api listening on ${actualPort}`);
      return { ok: true, server, port: actualPort, source: 'fallback', attemptedPorts };
    } catch (error) {
      if (error?.code !== 'EADDRINUSE') {
        return {
          ok: false,
          code: error?.code || 'STARTUP_ERROR',
          message: `Unable to start API server: ${error?.message || 'unknown error'}`,
        };
      }
    }
  }

  return {
    ok: false,
    code: 'EADDRINUSE',
    message: `No free port found between ${portConfig.port} and ${portConfig.port + maxFallbackOffset}. Set --port or PORT.`,
  };
}

function isRunningFromApiBin(argv = process.argv) {
  const entry = argv[1];
  if (!entry) {
    return false;
  }

  const normalizedEntry = path.resolve(entry).toLowerCase();
  const currentModulePath = path.resolve(fileURLToPath(import.meta.url)).toLowerCase();
  const entryBaseName = path.basename(normalizedEntry);

  return (
    normalizedEntry === currentModulePath ||
    entryBaseName === 'anywaydata-api' ||
    entryBaseName === 'anywaydata-api.cmd'
  );
}

const isDirectRun = isRunningFromApiBin(process.argv);
if (isDirectRun) {
  console.log('Starting anywaydata-api...');
  const result = await startApiServer(app, {
    argv: process.argv,
    env: process.env,
    logger: (message) => console.log(message),
  });
  if (!result.ok) {
    console.error(result.message);
    process.exit(1);
  }

  const sourceLabel = result.source === 'cli' ? 'CLI --port' : result.source === 'env' ? 'PORT env' : result.source;
  const baseUrl = `http://localhost:${result.port}`;
  console.log(`API base URL: ${baseUrl}`);
  console.log(`Swagger UI: ${baseUrl}/v1/docs`);
  console.log(`OpenAPI spec: ${baseUrl}/v1/openapi.json`);
  console.log(`Health check: ${baseUrl}/v1/health`);
  console.log(`Port source: ${sourceLabel}`);
  if (result.source === 'fallback') {
    console.log(`Port fallback sequence tried: ${result.attemptedPorts.join(', ')}`);
  }
}

export { app, parseCliPort, parseUnsafeFaker, resolvePortConfiguration, startApiServer };
