import { jest } from '@jest/globals';
import { executeCustomCounterString } from '../../../../../../js/keywords/domain/string/counterstring.js';

describe('custom counterstring implementation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('defaults to a star-delimited counterstring between length 1 and 25', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = executeCustomCounterString();
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(25);
    expect(result).toContain('*');
  });

  test('uses the provided minimum as the exact length when max is omitted', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(executeCustomCounterString({ args: [15] })).toBe('*3*5*7*9*12*15*');
  });

  test('uses the requested min and max range regardless of argument order', () => {
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy.mockReturnValue(0);
    expect(executeCustomCounterString({ args: [9, 5] }).length).toBe(5);

    randomSpy.mockReturnValue(0.999999);
    expect(executeCustomCounterString({ args: [5, 9] }).length).toBe(9);
  });

  test('clamps the generated minimum length to 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(executeCustomCounterString({ args: [0, 3] })).toBe('*');
  });

  test('supports custom delimiters, trims empty delimiters, and uses the first character of longer tokens', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(executeCustomCounterString({ args: [12, 12, '#'] })).toBe('#3#5#7#9#12#');
    expect(executeCustomCounterString({ args: [12, 12, 'XYZ'] })).toBe('X3X5X7X9X12X');
    expect(executeCustomCounterString({ args: [3, 3, '   '] })).toBe('*3*');
  });

  test('rejects non-integer min and max arguments', () => {
    expect(() => executeCustomCounterString({ args: [1.2, 3] })).toThrow(
      'Invalid argument for min: expected an integer.'
    );
    expect(() => executeCustomCounterString({ args: [2, 3.4] })).toThrow(
      'Invalid argument for max: expected an integer.'
    );
  });
});
