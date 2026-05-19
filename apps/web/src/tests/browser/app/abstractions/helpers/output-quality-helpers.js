const { expect } = require('@playwright/test');

const DISALLOWED_OUTPUT_PATTERNS = [
  /^\*\*ERROR\*\*$/i,
  /RandomDATA___/i,
  /\[object object\]/i,
  /^undefined$/i,
  /^null$/i,
];

function assertNoCommonErrorPatterns(values) {
  for (const value of values) {
    expect(value).not.toBeNull();
    expect(value).not.toBeUndefined();
    const normalized = String(value).trim();
    expect(normalized.length).toBeGreaterThan(0);
    for (const pattern of DISALLOWED_OUTPUT_PATTERNS) {
      expect(normalized).not.toMatch(pattern);
    }
  }
}

module.exports = {
  DISALLOWED_OUTPUT_PATTERNS,
  assertNoCommonErrorPatterns,
};
