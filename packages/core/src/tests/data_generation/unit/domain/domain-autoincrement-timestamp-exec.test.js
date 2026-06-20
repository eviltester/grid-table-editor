import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

describe('autoIncrement.timestamp domain keyword execution', () => {
  test('routes execution through the domain keyword interface', () => {
    const runStartedAt = new Date('2026-06-12T12:39:23.000Z');

    expect(executeDomainKeyword('autoIncrement.timestamp', { args: [], rowIndex: 0, runStartedAt })).toBe(
      '2026-06-12T12:39:23Z'
    );
    expect(executeDomainKeyword('autoIncrement.timestamp', { args: [], rowIndex: 1, runStartedAt })).toBe(
      '2026-06-12T12:39:24Z'
    );
  });

  test('supports named parameters through the parser and execution interface', () => {
    const parsed = parseKeywordInvocation(
      'autoIncrement.timestamp(start="20/03/1969", step=1, type="days", outputFormat="yyyy-MM-dd")'
    );

    expect(parsed.errors).toEqual([]);
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 0 })).toBe('1969-03-20');
    expect(executeDomainKeyword(parsed.keyword, { args: parsed.args, rowIndex: 3 })).toBe('1969-03-23');
  });

  test('advances via auto increment state through the domain keyword interface', () => {
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
  });

  test('surfaces helper validation errors through the domain keyword interface', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.timestamp', {
        args: ['2026-06-12T12:39:23Z', 1, 'fortnights'],
        rowIndex: 0,
      })
    ).toThrow(
      'Invalid argument for type: expected milliseconds, seconds, minutes, hours, days, weeks, months, or years.'
    );
  });
});
