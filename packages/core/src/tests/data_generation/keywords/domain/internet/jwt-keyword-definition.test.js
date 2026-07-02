import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.jwt');

describe('internet.jwt parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.jwt');
    const parsed = parseKeywordInvocation(`internet.jwt(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.jwt(header={"value":"sample"}) successfully', () => {
    const parsed = parseKeywordInvocation('internet.jwt(header={"value":"sample"})');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid header type before generation', () => {
    expect(validateArgs('header=["bad"]')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "header" must be object, not array',
    });
  });

  test('rejects invalid payload type before generation', () => {
    expect(validateArgs('header={"value":"sample"}, payload=["bad"]')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "payload" must be object, not array',
    });
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('header={"value":"sample"}, refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be number, not object',
    });
  });
});
