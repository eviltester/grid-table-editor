#!/usr/bin/env node

import express from 'express';
import { SUPPORTED_FORMATS } from '@anywaydata/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { createApiService } from './api-service.js';
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

let globalUnsafeFakerEnabled = false;
const apiService = createApiService({
  supportedFormats: SUPPORTED_FORMATS,
  getGlobalUnsafeFakerEnabled: () => globalUnsafeFakerEnabled,
  logger: console,
});

function sendServiceResult(res, serviceResult) {
  if (serviceResult.raw !== undefined) {
    return res.status(serviceResult.statusCode).type(serviceResult.contentType).send(serviceResult.raw);
  }
  return res.status(serviceResult.statusCode).json(serviceResult.body);
}

app.post('/v1/generate', (req, res) => {
  const result = apiService.handleGenerateRequest({ body: req.body, headers: req.headers });
  return sendServiceResult(res, result);
});

app.post('/v1/generate/fromschema', (req, res) => {
  const result = apiService.handleFromSchemaRequest({ body: req.body, query: req.query, headers: req.headers });
  return sendServiceResult(res, result);
});

app.post('/v1/generate/amend', (req, res) => {
  const result = apiService.handleAmendRequest({ body: req.body, headers: req.headers });
  return sendServiceResult(res, result);
});

app.get('/v1/generate/options/:format', (req, res) => {
  const result = apiService.handleGetOptionsRequest({ format: req.params?.format });
  return sendServiceResult(res, result);
});

app.post('/v1/generate/options/:format', (req, res) => {
  const result = apiService.handleSetOptionsRequest({ format: req.params?.format, body: req.body });
  return sendServiceResult(res, result);
});

app.post('/v1/generate/options/:format/default', (req, res) => {
  const result = apiService.handleResetOptionsRequest({ format: req.params?.format });
  return sendServiceResult(res, result);
});

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
      const nextToken = argv[index + 1];
      if (nextToken === 'false') {
        return false;
      }
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
    const actualPort = server.address().port;
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
      const actualPort = server.address().port;
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
