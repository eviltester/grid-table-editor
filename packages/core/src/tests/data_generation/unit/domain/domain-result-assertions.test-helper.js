const DISALLOWED_OUTPUT_PATTERNS = [/^\*\*ERROR\*\*$/i, /RandomDATA___/i, /\[object object\]/i];

function assertNoKnownBadStringPatterns(value) {
  expect(typeof value).toBe('string');
  for (const pattern of DISALLOWED_OUTPUT_PATTERNS) {
    expect(value).not.toMatch(pattern);
  }
}

function assertStructuredValue(value) {
  if (typeof value === 'string') {
    assertNoKnownBadStringPatterns(value);
    return;
  }
  if (typeof value === 'number') {
    expect(Number.isFinite(value)).toBe(true);
    return;
  }
  if (typeof value === 'bigint') {
    return;
  }
  if (typeof value === 'boolean') {
    return;
  }
  if (Array.isArray(value)) {
    expect(value.length).toBeGreaterThan(0);
    for (const item of value) {
      assertStructuredValue(item);
    }
    return;
  }
  if (value instanceof Date) {
    expect(Number.isNaN(value.getTime())).toBe(false);
    return;
  }
  expect(value && typeof value === 'object').toBe(true);
  const entries = Object.entries(value);
  expect(entries.length).toBeGreaterThan(0);
  for (const [, nested] of entries) {
    assertStructuredValue(nested);
  }
}

function assertDomainKeywordResult(keyword, result) {
  expect([null, undefined]).not.toContain(result);
  assertStructuredValue(result);

  if (/email/i.test(keyword)) {
    expect(String(result)).toContain('@');
  }
  if (typeof result === 'string') {
    expect(result.trim().length).toBeGreaterThan(0);
  }
  if (/url$/i.test(keyword)) {
    expect(String(result)).toMatch(/^https?:\/\//i);
  }
  if (/ipv4$/i.test(keyword)) {
    expect(String(result)).toMatch(/^(\d{1,3}\.){3}\d{1,3}$/);
  }
  if (/ipv6$/i.test(keyword)) {
    expect(String(result)).toContain(':');
  }
  if (/^internet\.ip$/i.test(keyword)) {
    expect(String(result).includes('.') || String(result).includes(':')).toBe(true);
  }
  if (/httpMethod$/i.test(keyword)) {
    expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(String(result));
  }
  if (/httpStatusCode$/i.test(keyword)) {
    const numeric = Number(result);
    expect(Number.isInteger(numeric)).toBe(true);
    expect(numeric).toBeGreaterThanOrEqual(100);
    expect(numeric).toBeLessThanOrEqual(599);
  }
  if (/^internet\.port$/i.test(keyword)) {
    const numeric = Number(result);
    expect(Number.isInteger(numeric)).toBe(true);
    expect(numeric).toBeGreaterThanOrEqual(0);
    expect(numeric).toBeLessThanOrEqual(65535);
  }
  if (/^internet\.protocol$/i.test(keyword)) {
    expect(['http', 'https']).toContain(String(result));
  }
  if (/iata(Code|TypeCode)$/i.test(keyword)) {
    expect(String(result)).toMatch(/^[A-Z0-9]{2,4}$/);
  }
}

export { assertDomainKeywordResult };
