import { describe, expect, test } from '@jest/globals';
import { isExplicitEnumRule } from '../../../js/data_generation/utils/enum-rule-detection.js';

describe('isExplicitEnumRule', () => {
  test('matches only explicit enum syntaxes', () => {
    expect(isExplicitEnumRule('enum("Chrome","Firefox")')).toBe(true);
    expect(isExplicitEnumRule('enum "Chrome","Firefox"')).toBe(true);
    expect(isExplicitEnumRule('("Chrome","Firefox")')).toBe(true);

    expect(isExplicitEnumRule('regex("[A,B]")')).toBe(false);
    expect(isExplicitEnumRule('literal.value("A,B")')).toBe(false);
    expect(isExplicitEnumRule('domain(city,state)')).toBe(false);
    expect(isExplicitEnumRule('red,blue,green')).toBe(false);
  });
});
