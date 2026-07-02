import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('number.int');

describe('number.int parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('number.int');
    const parsed = parseKeywordInvocation(`number.int(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes number.int(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('number.int(max=10, min=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('number');
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('min={"bad":true}, max=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('min=1, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid multipleOf type before generation', () => {
    expect(validateArgs('min=1, max=10, multipleOf={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be number, not object',
    });
  });

  test('rejects zero multipleOf before generation', () => {
    expect(validateArgs('min=1, max=10, multipleOf=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
    });
  });

  test('rejects negative multipleOf before generation', () => {
    expect(validateArgs('min=1, max=10, multipleOf=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
