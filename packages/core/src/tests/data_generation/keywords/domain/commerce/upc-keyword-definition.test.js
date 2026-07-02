import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('commerce.upc');

describe('commerce.upc parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('commerce.upc');
    const parsed = parseKeywordInvocation(`commerce.upc(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes commerce.upc(prefix="01234") successfully', () => {
    const parsed = parseKeywordInvocation('commerce.upc(prefix="01234")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid prefix type before generation', () => {
    expect(validateArgs('prefix={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "prefix" must be string, not object',
    });
  });
});
