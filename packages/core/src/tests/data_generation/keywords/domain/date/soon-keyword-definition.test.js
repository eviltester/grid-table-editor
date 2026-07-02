import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('date.soon');

describe('date.soon parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('date.soon');
    const parsed = parseKeywordInvocation(`date.soon(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes date.soon(days=7) successfully', () => {
    const parsed = parseKeywordInvocation('date.soon(days=7)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid days type before generation', () => {
    expect(validateArgs('days={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "days" must be integer, not object',
    });
  });

  test('rejects fractional days before generation', () => {
    expect(validateArgs('days=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "days" must be integer, not number',
    });
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('days=7, refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be integer, not object',
    });
  });
});
