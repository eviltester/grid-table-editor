const DISALLOWED_OUTPUT_PATTERNS = [
  /^\*\*ERROR\*\*$/i,
  /RandomDATA___/i,
  /\[object object\]/i,
  /^undefined$/i,
  /^null$/i,
];

function assertNoCommonErrorPatternsInValue(value) {
  expect([null, undefined]).not.toContain(value);
  expect(typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean').toBe(true);

  const normalized = String(value).trim();
  expect(normalized.length).toBeGreaterThan(0);
  for (const pattern of DISALLOWED_OUTPUT_PATTERNS) {
    expect(normalized).not.toMatch(pattern);
  }
}

function assertNoCommonErrorPatternsInRows(rows) {
  for (const row of rows) {
    for (const value of row) {
      assertNoCommonErrorPatternsInValue(value);
    }
  }
}

export { DISALLOWED_OUTPUT_PATTERNS, assertNoCommonErrorPatternsInValue, assertNoCommonErrorPatternsInRows };
