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
      pairwise: false,
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
      pairwise: false,
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
      pairwise: false,
    },
  });

  expect(code).toBe(1);
  expect(platform.err.join('')).toContain('Streaming generation failed');
});

test('ignores stream mode when pairwise is requested', async () => {
  const platform = makePlatform({ textSpec: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark' });
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
      pairwise: true,
    },
  });
  expect(code).toBe(0);
  expect(platform.err.join('')).toBe('');
  expect(platform.writes.length).toBe(1);
  expect(platform.writes[0].path).toBe('out.csv');
});

test('reports warning in test mode when stream mode is ignored for pairwise', async () => {
  const platform = makePlatform({ textSpec: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark' });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: 'out.csv',
      format: 'csv',
      rowCount: 2,
      testMode: true,
      showProgress: true,
      shouldStream: true,
      unsafeFakerExpressions: false,
      pairwise: true,
    },
  });
  expect(code).toBe(0);
  expect(platform.out.join('')).toContain('WARNING: Streaming is ignored when pairwise generation is enabled');
});

test('generates deterministic pairwise output in buffered mode', async () => {
  const platform = makePlatform({ textSpec: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark' });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: null,
      format: 'json',
      rowCount: 100,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
      pairwise: true,
    },
  });

  expect(code).toBe(0);
  const rendered = platform.out.join('').trim();
  expect(JSON.parse(rendered)).toEqual([
    { Browser: 'Chrome', Theme: 'Light' },
    { Browser: 'Chrome', Theme: 'Dark' },
    { Browser: 'Firefox', Theme: 'Light' },
    { Browser: 'Firefox', Theme: 'Dark' },
    { Browser: 'Safari', Theme: 'Light' },
    { Browser: 'Safari', Theme: 'Dark' },
  ]);
});
