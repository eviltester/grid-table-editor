import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('person.fullName');

describe('person.fullName parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('person.fullName');
    const parsed = parseKeywordInvocation(`person.fullName(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes person.fullName(firstName="Ada", lastName="Lovelace", sex="female") successfully', () => {
    const parsed = parseKeywordInvocation('person.fullName(firstName="Ada", lastName="Lovelace", sex="female")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid firstName type before generation', () => {
    expect(validateArgs('firstName={"bad":true}, lastName="Lovelace", sex="female"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "firstName" must be string, not object',
    });
  });

  test('rejects invalid lastName type before generation', () => {
    expect(validateArgs('firstName="Ada", lastName={"bad":true}, sex="female"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lastName" must be string, not object',
    });
  });

  test('rejects invalid sex type before generation', () => {
    expect(validateArgs('firstName="Ada", lastName="Lovelace", sex={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sex" must be female, generic or male, not object',
    });
  });
});
