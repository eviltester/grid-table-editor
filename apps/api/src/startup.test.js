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
  expect(parseCliPort(['node', 'index.js', '--port', '3001'])).toBe('3001');
  expect(parseCliPort(['node', 'index.js', '--port=3002'])).toBe('3002');
  expect(parseCliPort(['node', 'index.js'])).toBe(undefined);
});

test('resolvePortConfiguration uses cli over env', () => {
  const config = resolvePortConfiguration({
    argv: ['node', 'index.js', '--port', '3010'],
    env: { PORT: '3020' },
  });
  expect(config.ok).toBe(true);
  expect(config.port).toBe(3010);
  expect(config.source).toBe('cli');
  expect(config.explicit).toBe(true);
});

test('resolvePortConfiguration uses env when cli absent', () => {
  const config = resolvePortConfiguration({ argv: ['node', 'index.js'], env: { PORT: '3020' } });
  expect(config.ok).toBe(true);
  expect(config.port).toBe(3020);
  expect(config.source).toBe('env');
  expect(config.explicit).toBe(true);
});

test('resolvePortConfiguration rejects invalid explicit port', () => {
  const config = resolvePortConfiguration({ argv: ['node', 'index.js', '--port', 'abc'], env: {} });
  expect(config.ok).toBe(false);
  expect(config.error).toMatch(/--port must be an integer/);
});

test('startApiServer fails fast with clean EADDRINUSE for explicit port', async () => {
  const blockerApp = createTestApp();
  const blockerResult = await startApiServer(blockerApp, {
    argv: ['node', 'index.js'],
    env: {},
    logger: () => {},
    defaultPort: 41000,
  });

  expect(blockerResult.ok).toBe(true);

  try {
    const app = createTestApp();
    const result = await startApiServer(app, {
      argv: ['node', 'index.js', '--port', String(blockerResult.port)],
      env: {},
      logger: () => {},
    });

    expect(result.ok).toBe(false);
    expect(result.code).toBe('EADDRINUSE');
    expect(result.message).toMatch(/already in use/);
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

  expect(blockerResult.ok).toBe(true);

  let result;
  try {
    const app = createTestApp();
    result = await startApiServer(app, {
      argv: ['node', 'index.js'],
      env: {},
      logger: () => {},
      defaultPort: blockerResult.port,
    });

    expect(result.ok).toBe(true);
    expect(result.port).toBe(blockerResult.port + 1);
  } finally {
    blockerResult.server.close();
    if (result?.server) {
      result.server.close();
    }
  }
});
