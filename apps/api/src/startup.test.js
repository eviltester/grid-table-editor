import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { parseCliPort, resolvePortConfiguration, startApiServer } from './index.js';

function createTestApp() {
  const instance = express();
  instance.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return instance;
}

test('parseCliPort supports --port and --port=value', () => {
  assert.equal(parseCliPort(['node', 'index.js', '--port', '3001']), '3001');
  assert.equal(parseCliPort(['node', 'index.js', '--port=3002']), '3002');
  assert.equal(parseCliPort(['node', 'index.js']), undefined);
});

test('resolvePortConfiguration uses cli over env', () => {
  const config = resolvePortConfiguration({
    argv: ['node', 'index.js', '--port', '3010'],
    env: { PORT: '3020' },
  });
  assert.equal(config.ok, true);
  assert.equal(config.port, 3010);
  assert.equal(config.source, 'cli');
  assert.equal(config.explicit, true);
});

test('resolvePortConfiguration uses env when cli absent', () => {
  const config = resolvePortConfiguration({ argv: ['node', 'index.js'], env: { PORT: '3020' } });
  assert.equal(config.ok, true);
  assert.equal(config.port, 3020);
  assert.equal(config.source, 'env');
  assert.equal(config.explicit, true);
});

test('resolvePortConfiguration rejects invalid explicit port', () => {
  const config = resolvePortConfiguration({ argv: ['node', 'index.js', '--port', 'abc'], env: {} });
  assert.equal(config.ok, false);
  assert.match(config.error, /--port must be an integer/);
});

test('startApiServer fails fast with clean EADDRINUSE for explicit port', async () => {
  const blockerApp = createTestApp();
  const blockerResult = await startApiServer(blockerApp, {
    argv: ['node', 'index.js'],
    env: {},
    logger: () => {},
    defaultPort: 41000,
  });

  assert.equal(blockerResult.ok, true);

  try {
    const app = createTestApp();
    const result = await startApiServer(app, {
      argv: ['node', 'index.js', '--port', String(blockerResult.port)],
      env: {},
      logger: () => {},
    });

    assert.equal(result.ok, false);
    assert.equal(result.code, 'EADDRINUSE');
    assert.match(result.message, /already in use/);
  } finally {
    blockerResult.server.close();
  }
});

test('startApiServer auto-falls back when default port is busy', async () => {
  const blockerApp = createTestApp();
  const blockerResult = await startApiServer(blockerApp, {
    argv: ['node', 'index.js'],
    env: {},
    logger: () => {},
    defaultPort: 42000,
  });

  assert.equal(blockerResult.ok, true);

  let result;
  try {
    const app = createTestApp();
    result = await startApiServer(app, {
      argv: ['node', 'index.js'],
      env: {},
      logger: () => {},
      defaultPort: blockerResult.port,
    });

    assert.equal(result.ok, true);
    assert.equal(result.port, blockerResult.port + 1);
  } finally {
    blockerResult.server.close();
    if (result?.server) {
      result.server.close();
    }
  }
});
