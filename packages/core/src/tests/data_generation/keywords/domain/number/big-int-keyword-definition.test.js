import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('number.bigInt');

describe('number.bigInt parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('number.bigInt');
    const parsed = parseKeywordInvocation(`number.bigInt(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes number.bigInt(min=100, max=1000) successfully', () => {
    const parsed = parseKeywordInvocation('number.bigInt(min=100, max=1000)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('min={"bad":true}, max=1000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('min=100, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be integer, not object',
    });
  });

  test('rejects invalid multipleOf type before generation', () => {
    expect(validateArgs('min=100, max=1000, multipleOf={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be integer, not object',
    });
  });

  test('rejects zero multipleOf before generation', () => {
    expect(validateArgs('min=100, max=1000, multipleOf=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
    });
  });

  test('rejects negative multipleOf before generation', () => {
    expect(validateArgs('min=100, max=1000, multipleOf=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
    });
  });

  test('rejects fractional multipleOf before generation', () => {
    expect(validateArgs('min=100, max=1000, multipleOf=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be integer, not number',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
