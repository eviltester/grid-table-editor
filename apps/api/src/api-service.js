import {
  amendFromTextSpecAndData as coreAmendFromTextSpecAndData,
  createExporterForDefaults as coreCreateExporterForDefaults,
  generateFromTextSpec as coreGenerateFromTextSpec,
  SUPPORTED_FORMATS as CORE_SUPPORTED_FORMATS,
} from '@anywaydata/core';

const RESPONSE_FORMATS = new Set(['rows', 'rendered', 'all', 'raw']);

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
  junit4: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit5: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit6: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  testng: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pytest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  unittest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nose2: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  jest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  vitest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mocha: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  xunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mstest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  rspec: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  minitest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  phpunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  kotest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'junit5-kotlin': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  spek: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test-more': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test2-suite': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
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
  junit4: { includeSetup: 'Include @Before setup scaffold.' },
  junit5: { includeSetup: 'Include @BeforeEach setup scaffold.' },
  junit6: { includeSetup: 'Include @BeforeEach setup scaffold.' },
  testng: { includeSetup: 'Include @BeforeMethod setup scaffold.' },
  pytest: { includeSetup: 'Include fixture scaffold and inject it into test signature.' },
  jest: { includeSetup: 'Include beforeEach setup scaffold.' },
  xunit: { includeSetup: 'Include constructor setup scaffold.' },
  rspec: { includeSetup: 'Include before block scaffold.' },
  phpunit: { includeSetup: 'Include setUp() scaffold.' },
  kotest: { includeSetup: 'Include beforeTest setup scaffold.' },
  'test-more': { includeSetup: 'Include setup variable scaffold.' },
};

function normaliseFormat(format) {
  return String(format || '').toLowerCase();
}

function parseBooleanFlag(value) {
  return value === true || value === 'true';
}

function parseSeed(seed) {
  if (seed === undefined || seed === null || seed === '') return { ok: true, seed: undefined };
  const parsed = Number(seed);
  if (!Number.isFinite(parsed)) return { ok: false, error: 'seed must be a finite number when provided.' };
  return { ok: true, seed: parsed };
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
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) return payload;
  return {};
}

function toErrorResponse(result, statusCode = 400) {
  return {
    ok: false,
    statusCode,
    body: {
      errors: Array.isArray(result?.errors) ? result.errors : ['Unknown generation error'],
      diagnostics: result?.diagnostics || {},
    },
  };
}

function contentTypeForFormat(outputFormat) {
  const format = normaliseFormat(outputFormat);
  if (format === 'csv') return 'text/csv; charset=utf-8';
  if (format === 'dsv') return 'text/tab-separated-values; charset=utf-8';
  if (format === 'markdown') return 'text/markdown; charset=utf-8';
  if (format === 'json') return 'application/json; charset=utf-8';
  if (format === 'jsonl') return 'application/x-ndjson; charset=utf-8';
  if (format === 'javascript') return 'text/javascript; charset=utf-8';
  if (format === 'python') return 'text/x-python; charset=utf-8';
  if (format === 'java') return 'text/x-java-source; charset=utf-8';
  if (format === 'typescript') return 'application/typescript; charset=utf-8';
  if (['junit4', 'junit5', 'junit6', 'testng'].includes(format)) return 'text/x-java-source; charset=utf-8';
  if (['pytest', 'unittest', 'nose2'].includes(format)) return 'text/x-python; charset=utf-8';
  if (['jest', 'vitest', 'mocha'].includes(format)) return 'text/javascript; charset=utf-8';
  if (['xunit', 'nunit', 'mstest'].includes(format)) return 'text/x-csharp; charset=utf-8';
  if (['rspec', 'minitest'].includes(format)) return 'text/x-ruby; charset=utf-8';
  if (['phpunit', 'pest'].includes(format)) return 'application/x-httpd-php; charset=utf-8';
  if (['kotest', 'junit5-kotlin', 'spek'].includes(format)) return 'text/x-kotlin; charset=utf-8';
  if (['test-more', 'test2-suite'].includes(format)) return 'text/x-perl; charset=utf-8';
  if (format === 'xml') return 'application/xml; charset=utf-8';
  if (format === 'sql') return 'application/sql; charset=utf-8';
  if (format === 'gherkin') return 'text/x-gherkin; charset=utf-8';
  if (format === 'html') return 'text/html; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function parseResponseFormat(value) {
  const mode = normaliseFormat(value || 'rows');
  if (!RESPONSE_FORMATS.has(mode)) {
    return { ok: false, errors: ['responseFormat must be one of: rows, rendered, all, raw'] };
  }
  return { ok: true, mode };
}

function buildResponsePayload(mode, result, includeDiagnostics = false) {
  if (mode === 'raw') {
    return {
      ok: true,
      statusCode: 200,
      raw: result.rendered || '',
      contentType: contentTypeForFormat(result.format),
    };
  }
  if (mode === 'rendered') {
    return { ok: true, statusCode: 200, body: { rendered: result.rendered, format: result.format } };
  }
  if (mode === 'all') {
    const body = { headers: result.headers, rows: result.rows, rendered: result.rendered, format: result.format };
    if (includeDiagnostics) body.diagnostics = result.diagnostics;
    return { ok: true, statusCode: 200, body };
  }
  const body = { headers: result.headers, rows: result.rows, format: result.format };
  if (includeDiagnostics) body.diagnostics = result.diagnostics;
  return { ok: true, statusCode: 200, body };
}

export function createApiService({
  generateFromTextSpec = coreGenerateFromTextSpec,
  amendFromTextSpecAndData = coreAmendFromTextSpecAndData,
  createExporterForDefaults = coreCreateExporterForDefaults,
  supportedFormats = CORE_SUPPORTED_FORMATS,
  state = { formatDefaultOptions: new Map(), formatCustomTips: new Map() },
  getGlobalUnsafeFakerEnabled = () => false,
  logger = console,
} = {}) {
  function isSupportedFormat(format) {
    return supportedFormats.includes(normaliseFormat(format));
  }

  function sanitiseOptionsForFormat(format, payload) {
    const keys = UI_OPTION_KEYS_BY_FORMAT[normaliseFormat(format)] || [];
    const sourceOptions = toOptionsObject(payload);
    const filteredOptions = {};
    for (const key of keys) {
      if (sourceOptions[key] !== undefined) filteredOptions[key] = sourceOptions[key];
    }
    return filteredOptions;
  }

  function getTipsForFormat(format) {
    const normalised = normaliseFormat(format);
    const keys = UI_OPTION_KEYS_BY_FORMAT[normalised] || [];
    const configuredTips = UI_OPTION_TIPS_BY_FORMAT[normalised] || {};
    const customTips = state.formatCustomTips.get(normalised) || {};
    const tips = {};
    for (const key of keys) {
      const tip =
        customTips[key] || configuredTips[key] || `Configure ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      tips[key] = tip;
    }
    return tips;
  }

  function setCustomTipsForFormat(format, tipsPayload) {
    const normalised = normaliseFormat(format);
    const keys = UI_OPTION_KEYS_BY_FORMAT[normalised] || [];
    const nextTips = {};
    for (const key of keys) {
      const value = tipsPayload?.[key];
      if (typeof value === 'string' && value.trim()) nextTips[key] = value;
    }
    if (Object.keys(nextTips).length === 0) {
      state.formatCustomTips.delete(normalised);
      return;
    }
    state.formatCustomTips.set(normalised, nextTips);
  }

  function getDefaultOptionsForFormat(format) {
    const normalisedFormat = normaliseFormat(format);
    if (state.formatDefaultOptions.has(normalisedFormat)) {
      return cloneValue(state.formatDefaultOptions.get(normalisedFormat));
    }
    const exporter = createExporterForDefaults();
    const builtInDefaults = exporter.getOptionsForType(normalisedFormat);
    return sanitiseOptionsForFormat(normalisedFormat, cloneValue(builtInDefaults || {}));
  }

  function setDefaultOptionsForFormat(format, options) {
    const normalisedFormat = normaliseFormat(format);
    const currentDefaults = getDefaultOptionsForFormat(normalisedFormat);
    const mergedOptions = { ...toOptionsObject(currentDefaults), ...toOptionsObject(options) };
    state.formatDefaultOptions.set(normalisedFormat, sanitiseOptionsForFormat(normalisedFormat, mergedOptions));
  }

  function resetDefaultOptionsForFormat(format) {
    const normalised = normaliseFormat(format);
    state.formatDefaultOptions.delete(normalised);
    state.formatCustomTips.delete(normalised);
  }

  function runGeneration(payload = {}) {
    const { textSpec, rowCount, outputFormat = 'csv', options, seed, pairwise, unsafeFakerExpressions } = payload;
    const concreteOutputFormat = normaliseFormat(outputFormat || 'csv');

    if (!supportedFormats.includes(concreteOutputFormat)) {
      return toErrorResponse(
        { errors: [`outputFormat must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
        400
      );
    }

    const effectiveOptions =
      options === undefined
        ? getDefaultOptionsForFormat(concreteOutputFormat)
        : sanitiseOptionsForFormat(concreteOutputFormat, options);

    const parsedSeed = parseSeed(seed);
    if (!parsedSeed.ok) {
      return toErrorResponse({ errors: [parsedSeed.error], diagnostics: {} }, 400);
    }

    try {
      const result = generateFromTextSpec({
        textSpec,
        rowCount,
        outputFormat: concreteOutputFormat,
        options: effectiveOptions,
        seed: parsedSeed.seed,
        pairwise: parseBooleanFlag(pairwise),
        unsafeFakerExpressions: unsafeFakerExpressions || false,
      });
      if (!result?.ok) return toErrorResponse(result, 400);
      return { ok: true, result };
    } catch (error) {
      logger.error?.('Generation request failed', error);
      return toErrorResponse({ errors: ['Internal server error while generating data.'], diagnostics: {} }, 500);
    }
  }

  function runAmend(payload = {}) {
    const {
      textSpec,
      inputData,
      inputFormat,
      rowCount,
      outputFormat = 'csv',
      options,
      seed,
      unsafeFakerExpressions,
      stream,
    } = payload;
    const concreteOutputFormat = normaliseFormat(outputFormat || 'csv');

    if (!supportedFormats.includes(concreteOutputFormat)) {
      return toErrorResponse(
        { errors: [`outputFormat must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
        400
      );
    }

    const effectiveOptions =
      options === undefined
        ? getDefaultOptionsForFormat(concreteOutputFormat)
        : sanitiseOptionsForFormat(concreteOutputFormat, options);

    const parsedSeed = parseSeed(seed);
    if (!parsedSeed.ok) {
      return toErrorResponse({ errors: [parsedSeed.error], diagnostics: {} }, 400);
    }

    try {
      const result = amendFromTextSpecAndData({
        textSpec,
        inputData,
        inputFormat,
        rowCount,
        outputFormat: concreteOutputFormat,
        options: effectiveOptions,
        seed: parsedSeed.seed,
        unsafeFakerExpressions: unsafeFakerExpressions || false,
        stream,
      });
      if (!result?.ok) return toErrorResponse(result, 400);
      return { ok: true, result };
    } catch (error) {
      logger.error?.('Amend request failed', error);
      return toErrorResponse({ errors: ['Internal server error while amending data.'], diagnostics: {} }, 500);
    }
  }

  function handleGenerateRequest({ body = {} } = {}) {
    const modeResult = parseResponseFormat(body?.responseFormat);
    if (!modeResult.ok) return { ok: false, statusCode: 400, body: { errors: modeResult.errors, diagnostics: {} } };

    const allowUnsafe = getGlobalUnsafeFakerEnabled() || parseBooleanFlag(body?.unsafeFakerExpressions);
    const generated = runGeneration({ ...(body || {}), unsafeFakerExpressions: allowUnsafe });
    if (!generated.ok) return generated;
    return buildResponsePayload(modeResult.mode, generated.result, false);
  }

  function buildFromSchemaPayload({ body, query } = {}) {
    const textSpec = typeof body === 'string' ? body : '';
    const { rowCount, outputFormat, seed, responseFormat, unsafeFakerExpressions } = query || {};
    return {
      textSpec,
      rowCount,
      outputFormat: outputFormat || 'csv',
      seed,
      pairwise: query?.pairwise === 'true',
      responseFormat,
      unsafeFakerExpressions: unsafeFakerExpressions === 'true',
    };
  }

  function handleFromSchemaRequest({ body, query } = {}) {
    if (typeof body !== 'string') {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: ['text/plain request body is required for /generate/fromschema'], diagnostics: {} },
      };
    }
    const payload = buildFromSchemaPayload({ body, query });
    const modeResult = parseResponseFormat(payload.responseFormat);
    if (!modeResult.ok) return { ok: false, statusCode: 400, body: { errors: modeResult.errors, diagnostics: {} } };

    const allowUnsafe = getGlobalUnsafeFakerEnabled() || payload.unsafeFakerExpressions === true;
    const generated = runGeneration({ ...payload, unsafeFakerExpressions: allowUnsafe });
    if (!generated.ok) return generated;
    return buildResponsePayload(modeResult.mode, generated.result, false);
  }

  function handleAmendRequest({ body = {} } = {}) {
    const modeResult = parseResponseFormat(body?.responseFormat);
    if (!modeResult.ok) return { ok: false, statusCode: 400, body: { errors: modeResult.errors, diagnostics: {} } };

    const allowUnsafe = getGlobalUnsafeFakerEnabled() || parseBooleanFlag(body?.unsafeFakerExpressions);
    const amended = runAmend({ ...(body || {}), unsafeFakerExpressions: allowUnsafe });
    if (!amended.ok) return amended;
    return buildResponsePayload(modeResult.mode, amended.result, true);
  }

  function handleGetOptionsRequest({ format } = {}) {
    const normalisedFormat = normaliseFormat(format);
    if (!isSupportedFormat(normalisedFormat)) {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: [`format must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
      };
    }
    const options = getDefaultOptionsForFormat(normalisedFormat) || {};
    const source = state.formatDefaultOptions.has(normalisedFormat) ? 'custom-default' : 'built-in-default';
    return {
      ok: true,
      statusCode: 200,
      body: { format: normalisedFormat, options, tips: getTipsForFormat(normalisedFormat), source },
    };
  }

  function handleSetOptionsRequest({ format, body } = {}) {
    const normalisedFormat = normaliseFormat(format);
    if (!isSupportedFormat(normalisedFormat)) {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: [`format must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
      };
    }
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: ['Options payload must be a JSON object'], diagnostics: {} },
      };
    }
    if (body.tips !== undefined && (typeof body.tips !== 'object' || body.tips === null || Array.isArray(body.tips))) {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: ['tips must be a JSON object when provided'], diagnostics: {} },
      };
    }

    setDefaultOptionsForFormat(normalisedFormat, body);
    setCustomTipsForFormat(normalisedFormat, body.tips);

    return {
      ok: true,
      statusCode: 200,
      body: {
        format: normalisedFormat,
        options: getDefaultOptionsForFormat(normalisedFormat) || {},
        tips: getTipsForFormat(normalisedFormat),
        source: 'custom-default',
      },
    };
  }

  function handleResetOptionsRequest({ format } = {}) {
    const normalisedFormat = normaliseFormat(format);
    if (!isSupportedFormat(normalisedFormat)) {
      return {
        ok: false,
        statusCode: 400,
        body: { errors: [`format must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
      };
    }
    resetDefaultOptionsForFormat(normalisedFormat);
    return {
      ok: true,
      statusCode: 200,
      body: {
        format: normalisedFormat,
        options: getDefaultOptionsForFormat(normalisedFormat) || {},
        tips: getTipsForFormat(normalisedFormat),
        source: 'built-in-default',
      },
    };
  }

  return {
    handleGenerateRequest,
    handleFromSchemaRequest,
    handleAmendRequest,
    handleGetOptionsRequest,
    handleSetOptionsRequest,
    handleResetOptionsRequest,
    contentTypeForFormat,
    parseResponseFormat,
    parseSeed,
    buildFromSchemaPayload,
  };
}
