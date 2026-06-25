import { amendFromTextSpecAndData } from '../../index.js';

test('rejects missing inputData', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '',
    inputFormat: 'csv',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_input_data',
    })
  );
});

test('rejects missing inputFormat', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: '',
    outputFormat: 'json',
  });
  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_input_format',
    })
  );
});

test('rejects unsupported outputFormat', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    outputFormat: 'not-a-format',
  });
  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_output_format',
    })
  );
});

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

test('supports pict-style inline schema definitions for amend flows', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status: literal(Active)\nRole: Admin,User',
    inputData: '"Name"\n"Alice"\n"Eve"',
    inputFormat: 'csv',
    outputFormat: 'json',
  });

  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Name', 'Status', 'Role']);
  expect(result.rows).toHaveLength(2);
  result.rows.forEach((row) => {
    expect(['Alice', 'Eve']).toContain(row[0]);
    expect(row[1]).toBe('Active');
    expect(['Admin', 'User']).toContain(row[2]);
  });
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
  expect(result.errors[0].code).toBe('invalid_input_format');
  expect(result.errors[0].message).toContain('inputFormat must be one of');
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
  expect(result.errors[0].code).toBe('invalid_row_count');
  expect(result.errors[0].message).toContain('less than or equal to imported row count');
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
  expect(decimal.errors[0].code).toBe('invalid_row_count');
  expect(decimal.errors[0].message).toContain('rowCount must be an integer');

  const junk = amendFromTextSpecAndData({
    textSpec: 'Name\nBob',
    inputData: '"Name"\n"Alice"',
    inputFormat: 'csv',
    rowCount: '2abc',
    outputFormat: 'json',
  });
  expect(junk.ok).toBe(false);
  expect(junk.errors[0].code).toBe('invalid_row_count');
  expect(junk.errors[0].message).toContain('rowCount must be an integer');
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
  expect(result.errors[0].code).toBe('input_parse_error');
  expect(result.errors[0].message).toContain('Unable to parse inputData using inputFormat "json".');
});

test('trimInput trims whitespace from every imported field before amend processing', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
    inputFormat: 'csv',
    outputFormat: 'json',
    rowCount: 0,
    trimInput: true,
  });

  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Alice', 'Engineer', '']]);
});

test('trimInputFieldsCsv trims only listed imported columns with exact header matches', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
    inputFormat: 'csv',
    outputFormat: 'json',
    rowCount: 0,
    trimInputFieldsCsv: 'Name',
  });

  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Alice', '  Engineer  ', '']]);
});

test('trimInput and trimInputFieldsCsv use union behavior and ignore blank duplicate field entries', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
    inputFormat: 'csv',
    outputFormat: 'json',
    rowCount: 0,
    trimInput: true,
    trimInputFieldsCsv: 'Role, ,Role',
  });

  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['Alice', 'Engineer', '']]);
});

test('trimInputFieldsCsv does not trim unlisted or non-exact-match columns', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Status\nActive',
    inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
    inputFormat: 'csv',
    outputFormat: 'json',
    rowCount: 0,
    trimInputFieldsCsv: 'name,Unknown',
  });

  expect(result.ok).toBe(true);
  expect(result.rows).toEqual([['  Alice  ', '  Engineer  ', '']]);
});

test('safeFakerRules enforces safe faker validation for amend flows', () => {
  const result = amendFromTextSpecAndData({
    textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
    inputData: '[{"Name":"Alice"}]',
    inputFormat: 'json',
    rowCount: 1,
    outputFormat: 'json',
    safeFakerRules: true,
  });

  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'unsafe_faker_rule',
    })
  );
});
