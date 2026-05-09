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
    expect(() => JSON.parse(chunk)).not.toThrow();
  }
});

test('streamFromTextSpec rejects unsupported formats', async () => {
  const result = await streamFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 2,
    outputFormat: 'json',
    onChunk: async () => {},
  });

  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('supports only csv and jsonl');
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
