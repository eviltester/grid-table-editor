import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('word.words');

describe('word.words parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('word.words');
    const parsed = parseKeywordInvocation(`word.words(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes word.words(count=5) successfully', () => {
    const parsed = parseKeywordInvocation('word.words(count=5)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid count type before generation', () => {
    expect(validateArgs('count={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be number, not object',
    });
  });

  test('rejects zero count before generation', () => {
    expect(validateArgs('count=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be greater than 0',
    });
  });

  test('rejects negative count before generation', () => {
    expect(validateArgs('count=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be greater than 0',
    });
  });

  test('rejects fractional count before generation', () => {
    expect(validateArgs('count=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be an integer',
    });
  });
});
