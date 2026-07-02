import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('word.sample');

describe('word.sample parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('word.sample');
    const parsed = parseKeywordInvocation(`word.sample(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes word.sample(length=5) successfully', () => {
    const parsed = parseKeywordInvocation('word.sample(length=5)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid length type before generation', () => {
    expect(validateArgs('length={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be number, not object',
    });
  });

  test('rejects zero length before generation', () => {
    expect(validateArgs('length=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects negative length before generation', () => {
    expect(validateArgs('length=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects fractional length before generation', () => {
    expect(validateArgs('length=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be an integer',
    });
  });

  test('rejects invalid strategy type before generation', () => {
    expect(validateArgs('length=5, strategy={"bad":true}')).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "strategy" must be fail, closest, shortest, longest or any-length, not object',
    });
  });
});
