import { getTipsForFormat, normalizeFormat, OPTION_KEYS_BY_FORMAT, sanitizeOptionsForFormat } from '../../index.js';

describe('format option catalog helpers', () => {
  test('normalizeFormat lowercases and handles empty values', () => {
    expect(normalizeFormat('CSV')).toBe('csv');
    expect(normalizeFormat(undefined)).toBe('');
  });

  test('sanitizeOptionsForFormat keeps only known keys for a format', () => {
    const sanitized = sanitizeOptionsForFormat('csv', { header: false, quoteChar: "'", nope: true });
    expect(sanitized).toEqual({ header: false, quoteChar: "'" });
  });

  test('sanitizeOptionsForFormat supports wrapped payload shape', () => {
    const sanitized = sanitizeOptionsForFormat('dsv', { options: { delimiter: '|', unsupported: 1 } });
    expect(sanitized).toEqual({ delimiter: '|' });
  });

  test('getTipsForFormat returns custom override with fallback tips', () => {
    const tips = getTipsForFormat('csv', { customTips: { header: 'custom header tip' } });
    expect(tips.header).toBe('custom header tip');
    expect(typeof tips.quoteChar).toBe('string');
    expect(tips.quoteChar.trim().length).toBeGreaterThan(0);
  });

  test('option keys exist for representative formats', () => {
    expect(Array.isArray(OPTION_KEYS_BY_FORMAT.csv)).toBe(true);
    expect(Array.isArray(OPTION_KEYS_BY_FORMAT.json)).toBe(true);
    expect(Array.isArray(OPTION_KEYS_BY_FORMAT.junit5)).toBe(true);
  });

  test('all cataloged keys resolve to descriptive tips (no generic fallback)', () => {
    for (const [format, keys] of Object.entries(OPTION_KEYS_BY_FORMAT)) {
      const tips = getTipsForFormat(format);
      for (const key of keys) {
        expect(typeof tips[key]).toBe('string');
        expect(tips[key].trim().length).toBeGreaterThan(0);
        expect(tips[key].startsWith('Configure ')).toBe(false);
      }
    }
  });
});
