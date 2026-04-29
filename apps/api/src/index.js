import express from 'express';
import {
  createExporterForDefaults as createCoreExporterForDefaults,
  generateFromTextSpec,
  SUPPORTED_FORMATS,
} from '@anywaydata/core';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/plain', limit: '1mb' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/openapi.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'anywaydata-api' });
});

const RESPONSE_FORMATS = new Set(['rows', 'rendered', 'all', 'raw']);
const formatDefaultOptions = new Map();
const formatCustomTips = new Map();
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
  return { options: filteredOptions };
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
  return sanitiseOptionsForFormat(normalisedFormat, cloneValue(builtInDefaults || {}));
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
  const { textSpec, rowCount, outputFormat = 'csv', options, seed } = payload;
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

  try {
    const result = generateFromTextSpec({
      textSpec,
      rowCount,
      outputFormat: concreteOutputFormat,
      options: effectiveOptions,
      seed,
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

function parseResponseFormat(value) {
  const mode = String(value || 'rows').toLowerCase();
  if (!RESPONSE_FORMATS.has(mode)) {
    return { ok: false, errors: ['responseFormat must be one of: rows, rendered, all, raw'] };
  }
  return { ok: true, mode };
}

function sendGenerateResponse(req, res) {
  const modeResult = parseResponseFormat(req.body?.responseFormat);
  if (!modeResult.ok) {
    return res.status(400).json({ errors: modeResult.errors, diagnostics: {} });
  }

  const generated = runGeneration({ ...(req.body || {}), acceptHeader: req.headers.accept });
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
  const { rowCount, outputFormat, seed, responseFormat } = req.query || {};
  return {
    textSpec,
    rowCount,
    outputFormat: outputFormat || 'csv',
    seed,
    responseFormat,
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

  const generated = runGeneration({ ...payload, acceptHeader: req.headers.accept });
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
      errors: ['Options payload must be a JSON object.'],
      diagnostics: {},
    });
  }

  if (
    req.body.tips !== undefined &&
    (typeof req.body.tips !== 'object' || req.body.tips === null || Array.isArray(req.body.tips))
  ) {
    return res.status(400).json({
      errors: ['tips must be a JSON object when provided.'],
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
  return res.status(200).json({ format, options, tips: getTipsForFormat(format), source });
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
app.post('/generate', sendGenerateResponse);
app.post('/v1/generate/fromschema', sendFromSchemaResponse);
app.post('/generate/fromschema', sendFromSchemaResponse);
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
  const portConfig = resolvePortConfiguration({ argv, env, defaultPort });
  if (!portConfig.ok) {
    return { ok: false, code: 'INVALID_PORT', message: portConfig.error };
  }

  const maxFallbackOffset = 20;
  const attemptedPorts = [portConfig.port];

  try {
    const server = await listenOnPort(expressApp, portConfig.port);
    logger(`anywaydata-api listening on ${portConfig.port}`);
    return { ok: true, server, port: portConfig.port, source: portConfig.source, attemptedPorts };
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
      logger(`anywaydata-api listening on ${candidatePort}`);
      return { ok: true, server, port: candidatePort, source: 'fallback', attemptedPorts };
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

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const result = await startApiServer(app, {
    argv: process.argv,
    env: process.env,
    logger: (message) => console.log(message),
  });
  if (!result.ok) {
    console.error(result.message);
    process.exit(1);
  }
}

export { app, parseCliPort, resolvePortConfiguration, startApiServer };
