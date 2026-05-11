import { normalizeAndValidateFormat, sanitizeCliOptionsForFormat } from '../format-options.js';

test('normalizeAndValidateFormat uses shared normalization and validation', () => {
  expect(normalizeAndValidateFormat('JSON')).toEqual({ format: 'json', isSupported: true });
  expect(normalizeAndValidateFormat('nope').isSupported).toBe(false);
});

test('sanitizeCliOptionsForFormat drops unsupported keys', () => {
  expect(sanitizeCliOptionsForFormat('csv', { header: false, random: 1 })).toEqual({ header: false });
});
