import { executeCustomAutoIncrementTimestamp } from '../../../../../../js/keywords/domain/autoincrement/auto-increment-timestamp.js';

describe('custom auto increment timestamp implementation', () => {
  test('defaults to runStartedAt and increments by seconds using rowIndex', () => {
    const runStartedAt = new Date('2026-06-12T12:39:23.000Z');

    expect(executeCustomAutoIncrementTimestamp({ runStartedAt, rowIndex: 0 })).toBe('2026-06-12T12:39:23Z');
    expect(executeCustomAutoIncrementTimestamp({ runStartedAt, rowIndex: 1 })).toBe('2026-06-12T12:39:24Z');
    expect(executeCustomAutoIncrementTimestamp({ runStartedAt, rowIndex: 2 })).toBe('2026-06-12T12:39:25Z');
  });

  test('falls back to nowProvider when runStartedAt is absent', () => {
    const nowProvider = () => new Date('2026-06-12T16:00:00.000Z');

    expect(executeCustomAutoIncrementTimestamp({ nowProvider, rowIndex: 0 })).toBe('2026-06-12T16:00:00Z');
    expect(executeCustomAutoIncrementTimestamp({ nowProvider, rowIndex: -1 })).toBe('2026-06-12T16:00:00Z');
  });

  test('supports numeric start values, singular step types, and custom output formats', () => {
    const start = Date.UTC(2026, 5, 12, 12, 39, 23);
    expect(
      executeCustomAutoIncrementTimestamp({ args: [start, 15, 'minute', 'yyyy-MM-dd HH:mm:ss'], rowIndex: 2 })
    ).toBe('2026-06-12 13:09:23');
  });

  test('supports inputFormat parsing while preserving the parsed clock time as UTC', () => {
    expect(
      executeCustomAutoIncrementTimestamp({
        args: ['12-06-2026 12:39:23', 15, 'minutes', 'yyyy-MM-dd HH:mm:ss', 'dd-MM-yyyy HH:mm:ss'],
        rowIndex: 2,
      })
    ).toBe('2026-06-12 13:09:23');
  });

  test('supports natural-language parsing and output format aliases', () => {
    const runStartedAt = new Date('2026-06-12T00:00:00.000Z');

    expect(
      executeCustomAutoIncrementTimestamp({
        args: ['20/03/1969', 1, 'days', 'yyyy-MM-dd'],
        runStartedAt,
        rowIndex: 3,
      })
    ).toBe('1969-03-23');

    expect(
      executeCustomAutoIncrementTimestamp({
        args: ['2026-06-12T12:39:23Z', 1, 'seconds', 'iso'],
        rowIndex: 0,
      })
    ).toBe('2026-06-12T12:39:23Z');
  });

  test('advances one step at a time when autoIncrementState is supplied', () => {
    const state = {};

    expect(
      executeCustomAutoIncrementTimestamp({
        args: ['2026-06-12T16:00:00Z', 1, 'hours'],
        autoIncrementState: state,
      })
    ).toBe('2026-06-12T16:00:00Z');
    expect(state.nextDate.toISOString()).toBe('2026-06-12T17:00:00.000Z');
    expect(
      executeCustomAutoIncrementTimestamp({
        args: ['2026-06-12T16:00:00Z', 1, 'hours'],
        autoIncrementState: state,
      })
    ).toBe('2026-06-12T17:00:00Z');
  });

  test('rejects invalid dates, step values, and step types', () => {
    expect(() => executeCustomAutoIncrementTimestamp({ args: ['not-a-date'], rowIndex: 0 })).toThrow(
      'Invalid start date.'
    );
    expect(() => executeCustomAutoIncrementTimestamp({ args: ['2026-06-12T12:39:23Z', 'x'], rowIndex: 0 })).toThrow(
      'Invalid argument for step: expected a number.'
    );
    expect(() =>
      executeCustomAutoIncrementTimestamp({ args: ['2026-06-12T12:39:23Z', 1, 'fortnights'], rowIndex: 0 })
    ).toThrow(
      'Invalid argument for type: expected milliseconds, seconds, minutes, hours, days, weeks, months, or years.'
    );
  });
});
