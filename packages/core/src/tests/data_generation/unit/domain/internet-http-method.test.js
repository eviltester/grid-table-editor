import {
  ALL_HTTP_METHODS,
  COMMON_HTTP_METHODS,
  executeCustomInternetHttpMethod,
  getInternetHttpMethodPool,
  normalizeHttpMethodToken,
  parseExcludedHttpMethodsCsv,
} from '../../../../../js/keywords/domain/internet/internet-http-method.js';

describe('custom internet.httpMethod helpers', () => {
  test('normalizes http method tokens to trimmed uppercase values', () => {
    expect(normalizeHttpMethodToken(' patch ')).toBe('PATCH');
    expect(normalizeHttpMethodToken('TRACE')).toBe('TRACE');
  });

  test('parses excludes csv values case-insensitively and trims spaces', () => {
    expect(parseExcludedHttpMethodsCsv('patch, TRACE , connect')).toEqual(['PATCH', 'TRACE', 'CONNECT']);
  });

  test('uses the full method set by default', () => {
    expect(getInternetHttpMethodPool()).toEqual(ALL_HTTP_METHODS);
  });

  test('supports restricting to common methods and excluding values', () => {
    expect(getInternetHttpMethodPool({ commonOnly: true })).toEqual(COMMON_HTTP_METHODS);
    expect(getInternetHttpMethodPool({ excludes: 'patch, TRACE' })).toEqual([
      'GET',
      'HEAD',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
      'CONNECT',
    ]);
    expect(getInternetHttpMethodPool({ commonOnly: true, excludes: 'head, delete' })).toEqual(['GET', 'POST', 'PUT']);
  });

  test('throws when exclusions remove every available method', () => {
    expect(() => executeCustomInternetHttpMethod({ args: [true, 'get, head, post, put, delete'] })).toThrow(
      'Invalid argument for excludes: no HTTP methods remain after exclusions.'
    );
  });
});
