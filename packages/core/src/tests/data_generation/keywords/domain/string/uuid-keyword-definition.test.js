import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('string.uuid');

describe('string.uuid parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('string.uuid');
    const parsed = parseKeywordInvocation(`string.uuid(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes string.uuid(version=7) successfully', () => {
    const parsed = parseKeywordInvocation('string.uuid(version=7)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid version type before generation', () => {
    expect(validateArgs('version={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "version" must be 4 or 7, not object',
    });
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('version=7, refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be string, number or date, not object',
    });
  });
});
