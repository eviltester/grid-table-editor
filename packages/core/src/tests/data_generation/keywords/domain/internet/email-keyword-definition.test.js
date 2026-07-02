import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.email');

describe('internet.email parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.email');
    const parsed = parseKeywordInvocation(`internet.email(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.email(allowSpecialCharacters=true) successfully', () => {
    const parsed = parseKeywordInvocation('internet.email(allowSpecialCharacters=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid allowSpecialCharacters type before generation', () => {
    expect(validateArgs('allowSpecialCharacters={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "allowSpecialCharacters" must be boolean, not object',
    });
  });

  test('rejects invalid firstName type before generation', () => {
    expect(validateArgs('allowSpecialCharacters=true, firstName={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "firstName" must be string, not object',
    });
  });

  test('rejects invalid lastName type before generation', () => {
    expect(validateArgs('allowSpecialCharacters=true, lastName={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lastName" must be string, not object',
    });
  });

  test('rejects invalid provider type before generation', () => {
    expect(validateArgs('allowSpecialCharacters=true, provider={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "provider" must be string, not object',
    });
  });
});
