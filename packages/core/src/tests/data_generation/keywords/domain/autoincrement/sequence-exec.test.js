import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

describe('autoIncrement.sequence domain keyword execution', () => {
  test('routes execution through the domain keyword interface', () => {
    const state = {};

    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [], autoIncrementState: state })).toBe(1);
    expect(executeDomainKeyword('autoIncrement.sequence', { faker, args: [], autoIncrementState: state })).toBe(2);
    expect(state.nextValue).toBe(3);
  });

  test('supports named parameters through the parser and execution interface', () => {
    const state = {};
    const parsed = parseKeywordInvocation(
      'autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)'
    );

    expect(parsed.errors).toEqual([]);
    expect(executeDomainKeyword(parsed.keyword, { faker, args: parsed.args, autoIncrementState: state })).toBe(
      'filename001.txt'
    );
    expect(executeDomainKeyword(parsed.keyword, { faker, args: parsed.args, autoIncrementState: state })).toBe(
      'filename006.txt'
    );
  });

  test('surfaces helper validation errors through the domain keyword interface', () => {
    expect(() =>
      executeDomainKeyword('autoIncrement.sequence', { faker, args: [1, 0], autoIncrementState: {} })
    ).toThrow('Invalid argument for step: expected a non-zero integer.');
  });
});
