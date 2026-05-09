import { amendFromTextSpecAndData } from '../../index.js';

test('defaults rowCount to imported row count', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"\n"Eve"',
    inputFormat: 'csv',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Bob'], ['Bob']]);
  expect(result.diagnostics.importedRowCount).toBe(2);
});

test('amends only first N rows when rowCount is smaller', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"\n"Eve"',
    inputFormat: 'csv',
    rowCount: 1,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Bob'], ['Eve']]);
});

test('rowCount zero leaves rows unchanged', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Generated\nX',
    inputData: '"Name"\n"Alice"\n"Eve"',
    inputFormat: 'csv',
    rowCount: 0,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Name', 'Generated']);
  expect(result.rows).toEqual([
    ['Alice', ''],
    ['Eve', ''],
  ]);
});

test('invalid input format returns clear error', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: 'Name\nAlice',
    inputFormat: 'xmlx',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('inputFormat must be one of');
});

test('rowCount cannot exceed imported rows', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    rowCount: 2,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('less than or equal to imported row count');
});

test('stream is ignored with warning', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    outputFormat: 'json',
    stream: true,
  });
  expect(result.ok).toBe(true);
  expect(result.diagnostics.warnings).toContain(
    'stream is ignored for amend operations and buffered mode is always used.'
  );
});

test('ignores parser-only trailing blank row so output row count matches semantic input rows', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nUpdated Name\nStatus\nActive',
    inputData: '"Name","Age"\n"Alice","30"\n"Eve","40"\n',
    inputFormat: 'csv',
    rowCount: 2,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toHaveLength(2);
  expect(result.rows).toEqual([
    ['Updated Name', '30', 'Active'],
    ['Updated Name', '40', 'Active'],
  ]);
});

test('malformed input data returns structured error', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '{',
    inputFormat: 'json',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(false);
  expect(result.errors[0]).toContain('Unable to parse inputData using inputFormat "json".');
});
