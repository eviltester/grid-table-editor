import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.username');

describe('internet.username parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.username');
    const parsed = parseKeywordInvocation(`internet.username(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.username(firstName="Ada") successfully', () => {
    const parsed = parseKeywordInvocation('internet.username(firstName="Ada")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid firstName type before generation', () => {
    expect(validateArgs('firstName={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "firstName" must be string, not object',
    });
  });

  test('rejects invalid lastName type before generation', () => {
    expect(validateArgs('firstName="Ada", lastName={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lastName" must be string, not object',
    });
  });
});
