import {
  normaliseGeneratedCellValue,
  normaliseGeneratedRow,
  parseNonNegativeCount,
} from '../../../js/gui_components/shared/test-data/generation/generation-runtime.js';

describe('generation-runtime', () => {
  test('normaliseGeneratedCellValue serializes object values', () => {
    expect(normaliseGeneratedCellValue({ a: 1 })).toBe('{"a":1}');
  });

  test('normaliseGeneratedRow normalizes each value', () => {
    const row = normaliseGeneratedRow([null, new Date('2020-01-01T00:00:00.000Z')]);
    expect(row[0]).toBe('');
    expect(row[1]).toBe('2020-01-01T00:00:00.000Z');
  });

  test('parseNonNegativeCount clamps and reports validity', () => {
    expect(parseNonNegativeCount('12', { min: 0, max: 10 })).toEqual({ value: 10, valid: true });
    expect(parseNonNegativeCount('abc', { min: 0 })).toEqual({ value: 0, valid: false });
  });
});
