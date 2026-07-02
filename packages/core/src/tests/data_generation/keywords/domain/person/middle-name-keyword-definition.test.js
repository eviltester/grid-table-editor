import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('person.middleName');

describe('person.middleName parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('person.middleName');
    const parsed = parseKeywordInvocation(`person.middleName(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes person.middleName(sex="female") successfully', () => {
    const parsed = parseKeywordInvocation('person.middleName(sex="female")');

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
