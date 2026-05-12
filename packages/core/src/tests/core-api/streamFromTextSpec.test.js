import { streamFromTextSpec } from '../../index.js';

test('streamFromTextSpec streams csv rows with header', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'csv',
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });

  expect(result.ok).toBe(true);
  expect(chunks.length).toBe(3);
  expect(chunks[0]).toContain('"Name"');
  expect(chunks[1]).toContain('"Bob"');
  expect(chunks[2]).toContain('"Bob"');
});

test('streamFromTextSpec streams jsonl rows', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'jsonl',
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });

  expect(result.ok).toBe(true);
  expect(chunks.length).toBe(2);
  for (const chunk of chunks) {
    const parsed = JSON.parse(chunk);
    expect(Array.isArray(parsed)).toBe(false);
    expect(parsed).toHaveProperty('Name');
    expect(parsed.Name).toBe('Bob');
  }
});

test('streamFromTextSpec rejects unsupported formats', async () => {
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'markdown',
    onChunk: async () => {},
  });

  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('supports only csv, jsonl, dsv, json and xml');
});

test('streamFromTextSpec rejects pairwise mode', async () => {
  const result = await streamFromTextSpec({
    textSpec: 'Browser\nChrome,Firefox\nTheme\nLight,Dark',
    rowCount: 10,
    outputFormat: 'csv',
    pairwise: true,
    onChunk: async () => {},
  });

  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('does not support pairwise');
});

test('streamFromTextSpec streams dsv rows with delimiter and header', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'dsv',
    options: { delimiter: '\t', header: true },
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });
  expect(result.ok).toBe(true);
  expect(chunks.length).toBe(3);
  expect(chunks[0]).toContain('"Name"');
  expect(chunks[1]).toContain('"Bob"');
  expect(chunks[2]).toContain('"Bob"');
});

test('streamFromTextSpec streams json as valid array payload', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'json',
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });
  expect(result.ok).toBe(true);
  const payload = chunks.join('');
  const parsed = JSON.parse(payload);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.length).toBe(2);
  expect(parsed[0]).toHaveProperty('Name');
  expect(parsed[0].Name).toBe('Bob');
  expect(parsed[1].Name).toBe('Bob');
});

test('streamFromTextSpec streams xml as a well-formed document', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'xml',
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });
  expect(result.ok).toBe(true);
  const payload = chunks.join('\n');
  expect(payload).toContain('<?xml version="1.0" encoding="utf-8"?>');
  expect(payload).toContain('<root>');
  expect(payload).toContain('</root>');
  expect(payload).toContain('<item>');
  expect(payload).toContain('<Name>Bob</Name>');
});

test('streamFromTextSpec warns for json options that are unsupported in stream mode', async () => {
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 1,
    outputFormat: 'json',
    options: {
      asObject: true,
      outputAsJsonLines: true,
    },
    onChunk: async () => {},
  });
  expect(result.ok).toBe(true);
  expect(Array.isArray(result.diagnostics.warnings)).toBe(true);
  expect(result.diagnostics.warnings.join(' ')).toContain('ignores option asObject');
});

test('streamFromTextSpec json makeNumbersNumeric preserves empty strings', async () => {
  const chunks = [];
  const result = await streamFromTextSpec({
    textSpec: 'Quantity\n()',
    rowCount: 1,
    outputFormat: 'json',
    options: { makeNumbersNumeric: true },
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });

  expect(result.ok).toBe(true);
  const parsed = JSON.parse(chunks.join(''));
  expect(parsed[0].Quantity).toBe('');
});
