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

test('accepts inputFormat values with surrounding whitespace', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: ' csv ',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Bob']]);
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

test('rejects non-integer rowCount strings', () => {
  const decimal = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    rowCount: '1.5',
    outputFormat: 'json',
  });
  expect(decimal.ok).toBe(false);
  expect(decimal.errors[0]).toContain('rowCount must be an integer');

  const junk = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    rowCount: '2abc',
    outputFormat: 'json',
  });
  expect(junk.ok).toBe(false);
  expect(junk.errors[0]).toContain('rowCount must be an integer');
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

test('does not create a synthetic trailing row from terminal newline-delimited input', () => {
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

test('preserves legitimate trailing blank records from structured formats', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '[{"Name":"Alice"},{"Name":""}]',
    inputFormat: 'json',
    rowCount: 0,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toHaveLength(2);
  expect(result.rows).toEqual([
    ['Alice', ''],
    ['', ''],
  ]);
  expect(result.diagnostics.importedRowCount).toBe(2);
});

test('preserves explicit empty CSV records while ignoring terminal newline artifacts', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '"Name","Age"\n"Alice","30"\n"",""\n',
    inputFormat: 'csv',
    rowCount: 0,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.rows).toHaveLength(2);
  expect(result.rows).toEqual([
    ['Alice', '30', ''],
    ['', '', ''],
  ]);
  expect(result.diagnostics.importedRowCount).toBe(2);
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
