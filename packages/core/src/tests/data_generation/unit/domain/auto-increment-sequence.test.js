import {
  executeCustomAutoIncrementSequence,
  formatAutoIncrementValue,
} from '../../../../../js/keywords/domain/autoincrement/auto-increment-sequence.js';

describe('custom auto increment sequence implementation', () => {
  test('formats padded values and preserves negative signs', () => {
    expect(formatAutoIncrementValue(7, 3)).toBe('007');
    expect(formatAutoIncrementValue(-7, 3)).toBe('-007');
    expect(formatAutoIncrementValue(1234, 3)).toBe('1234');
  });

  test('defaults to a numeric sequence starting at 1 and stores nextValue in state', () => {
    const state = {};

    expect(executeCustomAutoIncrementSequence({ autoIncrementState: state })).toBe(1);
    expect(state.nextValue).toBe(2);
    expect(executeCustomAutoIncrementSequence({ autoIncrementState: state })).toBe(2);
    expect(state.nextValue).toBe(3);
  });

  test('uses the configured start value when state.nextValue is missing or invalid', () => {
    expect(executeCustomAutoIncrementSequence({ args: [10], autoIncrementState: {} })).toBe(10);
    expect(
      executeCustomAutoIncrementSequence({ args: [10], autoIncrementState: { nextValue: 'not-an-integer' } })
    ).toBe(10);
  });

  test('supports prefix, suffix, zero padding, and negative steps', () => {
    const state = {};

    expect(
      executeCustomAutoIncrementSequence({
        args: [5, -2, 'INV-', '.txt', 3],
        autoIncrementState: state,
      })
    ).toBe('INV-005.txt');
    expect(
      executeCustomAutoIncrementSequence({
        args: [5, -2, 'INV-', '.txt', 3],
        autoIncrementState: state,
      })
    ).toBe('INV-003.txt');
  });

  test('coerces prefix and suffix values to strings', () => {
    expect(
      executeCustomAutoIncrementSequence({
        args: [2, 1, 99, false, 2],
        autoIncrementState: {},
      })
    ).toBe('9902false');
  });

  test('rejects invalid integer arguments and zero or negative-invalid padding rules', () => {
    expect(() => executeCustomAutoIncrementSequence({ args: [1.5], autoIncrementState: {} })).toThrow(
      'Invalid argument for start: expected an integer.'
    );
    expect(() => executeCustomAutoIncrementSequence({ args: [1, 'x'], autoIncrementState: {} })).toThrow(
      'Invalid argument for step: expected an integer.'
    );
    expect(() => executeCustomAutoIncrementSequence({ args: [1, 0], autoIncrementState: {} })).toThrow(
      'Invalid argument for step: expected a non-zero integer.'
    );
    expect(() => executeCustomAutoIncrementSequence({ args: [1, 1, '', '', -1], autoIncrementState: {} })).toThrow(
      'Invalid argument for zeropadding: expected an integer greater than or equal to 0.'
    );
  });
});
