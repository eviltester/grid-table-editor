import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('person.lastName');

describe('person.lastName parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('person.lastName');
    const parsed = parseKeywordInvocation(`person.lastName(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes person.lastName(sex="female") successfully', () => {
    const parsed = parseKeywordInvocation('person.lastName(sex="female")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid sex type before generation', () => {
    expect(validateArgs('sex={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sex" must be female or male, not object',
    });
  });
});
