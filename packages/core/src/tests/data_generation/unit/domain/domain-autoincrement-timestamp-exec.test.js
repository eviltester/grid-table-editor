import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

describe('autoIncrement.timestamp domain keyword execution', () => {
  test('uses the generation run start time by default and increments by seconds per row', () => {
    const runStartedAt = new Date('2026-06-12T12:39:23.000Z');

    expect(executeDomainKeyword('autoIncrement.timestamp', { args: [], rowIndex: 0, runStartedAt })).toBe(
      '2026-06-12T12:39:23Z'
    );
    expect(executeDomainKeyword('autoIncrement.timestamp', { args: [], rowIndex: 1, runStartedAt })).toBe(
      '2026-06-12T12:39:24Z'
    );
    expect(executeDomainKeyword('autoIncrement.timestamp', { args: [], rowIndex: 2, runStartedAt })).toBe(
      '2026-06-12T12:39:25Z'
    );
  });

  test('supports explicit ISO timestamps and day increments', () => {
    const args = ['2026-06-12T12:39:23Z', 2, 'days'];

    expect(executeDomainKeyword('autoIncrement.timestamp', { args, rowIndex: 0 })).toBe('2026-06-12T12:39:23Z');
    expect(executeDomainKeyword('autoIncrement.timestamp', { args, rowIndex: 1 })).toBe('2026-06-14T12:39:23Z');
    expect(executeDomainKeyword('autoIncrement.timestamp', { args, rowIndex: 2 })).toBe('2026-06-16T12:39:23Z');
  });

  test('supports permissive non-ISO parsing with custom output formatting', () => {
    const parsed = parseKeywordInvocation(
      'autoIncrement.timestamp(start="20/03/1969", step=1, type="days", outputFormat="yyyy-MM-dd")'
    );

    expect(parsed.errors).toEqual([]);
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 0 })).toBe('1969-03-20');
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 3 })).toBe('1969-03-23');
  });

  test('supports inputFormat when the start value is not ISO-8601', () => {
    const parsed = parseKeywordInvocation(
      'autoIncrement.timestamp(start="12-06-2026 12:39:23", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss", inputFormat="dd-MM-yyyy HH:mm:ss")'
    );

    expect(parsed.errors).toEqual([]);
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 0 })).toBe('2026-06-12 12:39:23');
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 2 })).toBe('2026-06-12 13:09:23');
  });

  test('rejects unsupported increment units', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.timestamp', {
        args: ['2026-06-12T12:39:23Z', 1, 'fortnights'],
        rowIndex: 0,
      })
    ).toThrow(
      'Invalid argument for type: expected milliseconds, seconds, minutes, hours, days, weeks, months, or years.'
    );
  });

  test('advances via auto increment state when rows are generated one at a time', () => {
    const state = {};

    expect(
      executeDomainKeyword('autoIncrement.timestamp', {
        args: ['2026-06-12T16:00:00Z', 1, 'hours'],
        autoIncrementState: state,
      })
    ).toBe('2026-06-12T16:00:00Z');

    expect(
      executeDomainKeyword('autoIncrement.timestamp', {
        args: ['2026-06-12T16:00:00Z', 1, 'hours'],
        autoIncrementState: state,
      })
    ).toBe('2026-06-12T17:00:00Z');

    expect(
      executeDomainKeyword('autoIncrement.timestamp', {
        args: ['2026-06-12T16:00:00Z', 1, 'hours'],
        autoIncrementState: state,
      })
    ).toBe('2026-06-12T18:00:00Z');
  });
});
