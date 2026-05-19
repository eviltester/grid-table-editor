const { expect } = require('@playwright/test');

function assertStrictBooleanCell(value) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  expect(normalized).not.toBe('');
  expect(['true', 'false']).toContain(normalized);
  return normalized;
}

module.exports = {
  assertStrictBooleanCell,
};
