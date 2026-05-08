import { runCliCommand } from '../run-cli.js';

function makePlatform({ textSpec = 'Name\nBob', shouldThrowRead = false } = {}) {
  const writes = [];
  const out = [];
  const err = [];
  return {
    writes,
    out,
    err,
    async readText() {
      if (shouldThrowRead) {
        throw new Error('missing file');
      }
      return textSpec;
    },
    async writeText(path, content) {
      writes.push({ path, content });
    },
    createLineWriter() {
      const lines = [];
      return {
        async writeLine(line) {
          lines.push(line);
        },
        async close() {
          writes.push({ path: 'stream', content: lines.join('\n') });
        },
      };
    },
    stdout(text) {
      out.push(text);
    },
    stderr(text) {
      err.push(text);
    },
  };
}

test('returns error when input file cannot be read', async () => {
  const platform = makePlatform({ shouldThrowRead: true });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'missing.txt',
      outputFile: null,
      format: 'csv',
      rowCount: 1,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
    },
  });
  expect(code).toBe(1);
  expect(platform.err.join('')).toContain('Unable to read input file');
});

test('writes output file in buffered mode', async () => {
  const platform = makePlatform();
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: 'out.csv',
      format: 'csv',
      rowCount: 2,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
    },
  });
  expect(code).toBe(0);
  expect(platform.writes.length).toBe(1);
  expect(platform.writes[0].path).toBe('out.csv');
});

test('returns error when stream writer fails', async () => {
  const platform = makePlatform();
  platform.createLineWriter = () => ({
    async writeLine() {
      throw new Error('disk full');
    },
    async close() {},
  });

  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: 'out.csv',
      format: 'csv',
      rowCount: 2,
      testMode: false,
      showProgress: false,
      shouldStream: true,
      unsafeFakerExpressions: false,
    },
  });

  expect(code).toBe(1);
  expect(platform.err.join('')).toContain('Streaming generation failed');
});
