import { OPTION_KEYS_BY_FORMAT } from '@anywaydata/core';
import {
  getTestFrameworkFormats,
  getTestFrameworkLabel,
  sanitizeUiOptionsForFormat,
} from '../../../js/gui_components/options-catalog-adapter.js';

describe('options catalog adapter', () => {
  test('discovers test framework formats from core option catalog', () => {
    const discovered = getTestFrameworkFormats();
    expect(discovered).toContain('junit5');
    expect(discovered).toContain('jest');
    expect(discovered).toContain('test2-suite');
    expect(discovered.every((format) => Array.isArray(OPTION_KEYS_BY_FORMAT[format]))).toBe(true);
  });

  test('returns known framework labels with fallback', () => {
    expect(getTestFrameworkLabel('junit5')).toBe('JUnit5');
    expect(getTestFrameworkLabel('unknown-framework')).toBe('unknown-framework');
  });

  test('sanitizes UI options using the core catalog', () => {
    expect(sanitizeUiOptionsForFormat('csv', { header: false, unknown: true })).toEqual({
      outputFormat: 'csv',
      options: { header: false },
    });
  });
});
