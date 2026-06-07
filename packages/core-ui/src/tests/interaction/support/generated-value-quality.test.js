import { describe, expect, test } from '@jest/globals';
import { assertNoErrorIndicators } from './generated-value-quality.js';

describe('assertNoErrorIndicators', () => {
  test('allows incidental NaN substrings inside ordinary text values', () => {
    expect(() =>
      assertNoErrorIndicators('e30.e30.PxJVXCFQzCFHqE6NaNR45tsjoSGaV8ZY8seHTcuUD2DgVXHwjG67NIcR9yAuReck')
    ).not.toThrow();
  });

  test('still rejects standalone invalid tokens', () => {
    expect(() => assertNoErrorIndicators('"Value"\n"NaN"')).toThrow();
    expect(() => assertNoErrorIndicators('"Value"\n"undefined"')).toThrow();
  });
});
