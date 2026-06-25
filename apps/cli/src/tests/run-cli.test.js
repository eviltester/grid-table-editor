import { runCliCommand } from '../run-cli.js';

function makePlatform({ textSpec = 'Name\nBob', shouldThrowRead = false } = {}) {
  const writes = [];
  const out = [];
  const err = [];
  return {
    writes,
    out,
    err,
    getRuntimePlatform() {
      return 'linux';
    },
    async readText() {
      if (shouldThrowRead) {
        throw new Error('missing file');
      }
      return textSpec;
    },
    async writeText(path, content, exportEncodingSettings) {
      writes.push({ path, content, exportEncodingSettings });
    },
    createLineWriter(_path, exportEncodingSettings) {
      const lines = [];
      return {
        async writeLine(line) {
          lines.push(line);
        },
        async close() {
          writes.push({ path: 'stream', content: lines.join('\n'), exportEncodingSettings });
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
  expect(platform.writes[0].exportEncodingSettings).toEqual({
    lineEnding: 'lf',
    includeBom: false,
  });
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

test('passes explicit export encoding settings to buffered file output', async () => {
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
      lineEndings: 'crlf',
      bom: true,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });

  expect(code).toBe(0);
  expect(platform.writes[0].exportEncodingSettings).toEqual({
    lineEnding: 'crlf',
    includeBom: true,
  });
});

test('passes explicit export encoding settings to streaming file output', async () => {
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
      shouldStream: true,
      lineEndings: 'crlf',
      bom: true,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });

  expect(code).toBe(0);
  expect(platform.writes[0].exportEncodingSettings).toEqual({
    lineEnding: 'crlf',
    includeBom: true,
  });
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
  expect(platform.out.join('')).toContain('WARNING: rowCount is ignored when pairwise generation is enabled.');
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

test('supports comments and blank lines in input schema', async () => {
  const platform = makePlatform({
    textSpec: '# comment\n\nPriority\nhigh,medium,low\n\nStatus\nactive,inactive,pending',
  });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: null,
      format: 'json',
      rowCount: 2,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });
  expect(code).toBe(0);
  const parsed = JSON.parse(platform.out.join('').trim());
  expect(parsed).toHaveLength(2);
  expect(Object.keys(parsed[0])).toEqual(['Priority', 'Status']);
});

test('amend mode updates only first N rows and keeps full output', async () => {
  const platform = makePlatform({ textSpec: 'Name\nBob' });
  platform.readText = async (file) => {
    if (file === 'schema.txt') return 'Name\nBob';
    if (file === 'data.csv') return '"Name"\n"Alice"\n"Eve"';
    throw new Error('missing');
  };
  const code = await runCliCommand({
    platform,
    options: {
      command: 'amend',
      inputFile: 'schema.txt',
      dataFile: 'data.csv',
      inputFormat: 'csv',
      outputFile: null,
      format: 'json',
      rowCount: 1,
      testMode: false,
      showProgress: false,
      shouldStream: true,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });
  expect(code).toBe(0);
  expect(JSON.parse(platform.out.join('').trim())).toEqual([{ Name: 'Bob' }, { Name: 'Eve' }]);
});

test('accepts uppercase format names via shared normalization', async () => {
  const platform = makePlatform();
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: null,
      format: 'CSV',
      rowCount: 1,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });
  expect(code).toBe(0);
  expect(platform.err.join('')).toBe('');
});

test('enforces valid IF THEN constraints during successful CLI generation', async () => {
  const platform = makePlatform({
    textSpec: `Priority
enum("High","Low")
Status
enum("Open","Closed")

IF [Priority] = "High" THEN [Status] = "Open";`,
  });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: null,
      format: 'json',
      rowCount: 20,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });

  expect(code).toBe(0);
  const parsed = JSON.parse(platform.out.join('').trim());
  expect(parsed).toHaveLength(20);
  parsed.forEach((row) => {
    if (row.Priority === 'High') {
      expect(row.Status).toBe('Open');
    }
  });
});

test('reports constraint generation failures for impossible runtime constraints', async () => {
  const platform = makePlatform({
    textSpec: `Status
enum("Open","Closed")

IF [Status] = "Open" THEN [Status] = "Closed";
IF [Status] = "Closed" THEN [Status] = "Open";`,
  });
  const code = await runCliCommand({
    platform,
    options: {
      inputFile: 'spec.txt',
      outputFile: null,
      format: 'json',
      rowCount: 1,
      testMode: false,
      showProgress: false,
      shouldStream: false,
      unsafeFakerExpressions: false,
      pairwise: false,
    },
  });

  expect(code).toBe(1);
  expect(platform.err.join('')).toContain('[constraint_generation_failed]');
  expect(platform.err.join('')).toContain(
    'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation.'
  );
});
