import {
  amendFromTextSpecAndData as coreAmendFromTextSpecAndData,
  createExporterForDefaults as coreCreateExporterForDefaults,
  generateFromTextSpec as coreGenerateFromTextSpec,
  getTipsForFormat as getTipsForFormatFromCatalog,
  normalizeFormat,
  sanitizeOptionsForFormat,
  SUPPORTED_FORMATS as CORE_SUPPORTED_FORMATS,
} from '@anywaydata/core';

const RESPONSE_FORMATS = new Set(['rows', 'rendered', 'all', 'raw']);

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
  const format = normalizeFormat(outputFormat);
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
  const mode = normalizeFormat(value || 'rows');
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
    return supportedFormats.includes(normalizeFormat(format));
  }

  function getTipsForFormat(format) {
    return getTipsForFormatFromCatalog(format, {
      customTips: state.formatCustomTips.get(normalizeFormat(format)) || {},
    });
  }

  function setCustomTipsForFormat(format, tipsPayload) {
    const normalised = normalizeFormat(format);
    const keys = Object.keys(getTipsForFormatFromCatalog(normalised));
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
    const normalisedFormat = normalizeFormat(format);
    if (state.formatDefaultOptions.has(normalisedFormat)) {
      return cloneValue(state.formatDefaultOptions.get(normalisedFormat));
    }
    const exporter = createExporterForDefaults();
    const builtInDefaults = exporter.getOptionsForType(normalisedFormat);
    return sanitizeOptionsForFormat(normalisedFormat, cloneValue(builtInDefaults || {}));
  }

  function setDefaultOptionsForFormat(format, options) {
    const normalisedFormat = normalizeFormat(format);
    const currentDefaults = getDefaultOptionsForFormat(normalisedFormat);
    const mergedOptions = { ...toOptionsObject(currentDefaults), ...toOptionsObject(options) };
    state.formatDefaultOptions.set(normalisedFormat, sanitizeOptionsForFormat(normalisedFormat, mergedOptions));
  }

  function resetDefaultOptionsForFormat(format) {
    const normalised = normalizeFormat(format);
    state.formatDefaultOptions.delete(normalised);
    state.formatCustomTips.delete(normalised);
  }

  function runGeneration(payload = {}) {
    const { textSpec, rowCount, outputFormat = 'csv', options, seed, pairwise, unsafeFakerExpressions } = payload;
    const concreteOutputFormat = normalizeFormat(outputFormat || 'csv');

    if (!supportedFormats.includes(concreteOutputFormat)) {
      return toErrorResponse(
        { errors: [`outputFormat must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
        400
      );
    }

    const effectiveOptions =
      options === undefined
        ? getDefaultOptionsForFormat(concreteOutputFormat)
        : sanitizeOptionsForFormat(concreteOutputFormat, options);

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
      trimInput,
      trimInputFieldsCsv,
      unsafeFakerExpressions,
      stream,
    } = payload;
    const concreteOutputFormat = normalizeFormat(outputFormat || 'csv');

    if (!supportedFormats.includes(concreteOutputFormat)) {
      return toErrorResponse(
        { errors: [`outputFormat must be one of: ${supportedFormats.join(', ')}`], diagnostics: {} },
        400
      );
    }

    const effectiveOptions =
      options === undefined
        ? getDefaultOptionsForFormat(concreteOutputFormat)
        : sanitizeOptionsForFormat(concreteOutputFormat, options);

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
        trimInput: parseBooleanFlag(trimInput),
        trimInputFieldsCsv,
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
    const normalisedFormat = normalizeFormat(format);
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
    const normalisedFormat = normalizeFormat(format);
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
    const normalisedFormat = normalizeFormat(format);
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
