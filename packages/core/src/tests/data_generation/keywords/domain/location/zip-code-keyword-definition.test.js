import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.zipCode');

describe('location.zipCode parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.zipCode');
    const parsed = parseKeywordInvocation(`location.zipCode(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.zipCode(format="#####") successfully', () => {
    const parsed = parseKeywordInvocation('location.zipCode(format="#####")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid state type before generation', () => {
    expect(validateArgs('state={"bad":true}, format="#####"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "state" must be string, not object',
    });
  });

  test('rejects invalid format type before generation', () => {
    expect(validateArgs('format={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "format" must be string, not object',
    });
  });
});
