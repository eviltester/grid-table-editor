import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('autoIncrement.sequence');

describe('autoIncrement.sequence parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('autoIncrement.sequence');
    const parsed = parseKeywordInvocation(`autoIncrement.sequence(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  function executeSequence(paramsText, autoIncrementState = {}) {
    const parsed = parseKeywordInvocation(`autoIncrement.sequence(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return executeDomainKeyword(parsed.keyword, {
      args: parsed.args,
      autoIncrementState,
    });
  }

  test('executes autoIncrement.sequence(start=10, step=5) successfully', () => {
    const parsed = parseKeywordInvocation('autoIncrement.sequence(start=10, step=5)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args, autoIncrementState: {} });

    expect(result).toBeDefined();
    expect(result).toEqual(10);
  });

  test('allows negative start values', () => {
    expect(executeSequence('start=-10')).toBe(-10);
  });

  test('allows negative step values and advances by the step', () => {
    const autoIncrementState = {};

    expect(executeSequence('start=10, step=-3', autoIncrementState)).toBe(10);
    expect(executeSequence('start=10, step=-3', autoIncrementState)).toBe(7);
    expect(executeSequence('start=10, step=-3', autoIncrementState)).toBe(4);
    expect(executeSequence('start=10, step=-3', autoIncrementState)).toBe(1);
    expect(executeSequence('start=10, step=-3', autoIncrementState)).toBe(-2);
  });

  test('allows positive step values and advances by the step', () => {
    const autoIncrementState = {};

    expect(executeSequence('start=-4, step=3', autoIncrementState)).toBe(-4);
    expect(executeSequence('start=-4, step=3', autoIncrementState)).toBe(-1);
    expect(executeSequence('start=-4, step=3', autoIncrementState)).toBe(2);
    expect(executeSequence('start=-4, step=3', autoIncrementState)).toBe(5);
    expect(executeSequence('start=-4, step=3', autoIncrementState)).toBe(8);
  });

  test('applies zeropadding to the numeric value', () => {
    expect(executeSequence('start=7, zeropadding=3')).toBe('007');
  });

  test('keeps zeropadding after a prefix and before a suffix', () => {
    expect(executeSequence('start=4, prefix="filename", suffix=".txt", zeropadding=4')).toBe('filename0004.txt');
  });

  test('does not truncate values wider than zeropadding', () => {
    expect(executeSequence('start=1000, zeropadding=3')).toBe('1000');
  });

  test('keeps the minus sign outside zeropadding for negative values', () => {
    expect(executeSequence('start=-7, zeropadding=2')).toBe('-07');
  });

  test('rejects invalid start type before generation', () => {
    expect(validateArgs('start={"bad":true}, step=5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "start" must be integer, not object',
    });
  });

  test('rejects invalid step type before generation', () => {
    expect(validateArgs('start=10, step={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "step" must be integer, not object',
    });
  });

  test('rejects invalid prefix type before generation', () => {
    expect(validateArgs('start=10, step=5, prefix={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "prefix" must be string, not object',
    });
  });

  test('rejects invalid suffix type before generation', () => {
    expect(validateArgs('start=10, step=5, suffix={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "suffix" must be string, not object',
    });
  });

  test('rejects invalid zeropadding type before generation', () => {
    expect(validateArgs('start=10, step=5, zeropadding={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "zeropadding" must be integer, not object',
    });
  });

  test('rejects negative zeropadding before generation', () => {
    expect(validateArgs('start=10, step=5, zeropadding=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "zeropadding" must be greater than or equal to 0',
    });
  });

  test('rejects fractional zeropadding before generation', () => {
    expect(validateArgs('start=10, step=5, zeropadding=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "zeropadding" must be integer, not number',
    });
  });
});
