import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

describe('autoIncrement.sequence domain keyword execution', () => {
  test('defaults to an incrementing numeric sequence', () => {
    const state = {};

    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [], autoIncrementState: state })).toBe(1);
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [], autoIncrementState: state })).toBe(2);
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [], autoIncrementState: state })).toBe(3);
  });

  test('supports custom start and step values', () => {
    const state = {};

    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [10, 5], autoIncrementState: state })).toBe(
      10
    );
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [10, 5], autoIncrementState: state })).toBe(
      15
    );
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [10, 5], autoIncrementState: state })).toBe(
      20
    );
  });

  test('supports prefix, suffix, and zero padding', () => {
    const state = {};

    expect(
      executeDomainKeyword('autoIncrement.sequence', {
        faker,
        args: [1, 5, 'filename', '.txt', 3],
        autoIncrementState: state,
      })
    ).toBe('filename0001.txt');
    expect(
      executeDomainKeyword('autoIncrement.sequence', {
        faker,
        args: [1, 5, 'filename', '.txt', 3],
        autoIncrementState: state,
      })
    ).toBe('filename0006.txt');
  });

  test('supports named parameters', () => {
    const state = {};
    const parsed = parseKeywordInvocation(
      'autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)'
    );

    expect(parsed.errors).toEqual([]);
    expect(executeDomainKeyword(parsed.keyword, { faker, args: parsed.args, autoIncrementState: state })).toBe(
      'filename0001.txt'
    );
    expect(executeDomainKeyword(parsed.keyword, { faker, args: parsed.args, autoIncrementState: state })).toBe(
      'filename0006.txt'
    );
  });

  test('supports negative steps', () => {
    const state = {};

    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [5, -2], autoIncrementState: state })).toBe(5);
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [5, -2], autoIncrementState: state })).toBe(3);
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [5, -2], autoIncrementState: state })).toBe(1);
  });

  test('rejects non-integer start argument', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.sequence', { faker, args: [1.2], autoIncrementState: {} })
    ).toThrow('Invalid argument for start: expected an integer.');
  });

  test('rejects non-integer step argument', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.sequence', { faker, args: [1, 'x'], autoIncrementState: {} })
    ).toThrow('Invalid argument for step: expected an integer.');
  });

  test('rejects negative zeropadding', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.sequence', { faker, args: [1, 1, '', '', -1], autoIncrementState: {} })
    ).toThrow('Invalid argument for zeropadding: expected an integer greater than or equal to 0.');
  });
});
