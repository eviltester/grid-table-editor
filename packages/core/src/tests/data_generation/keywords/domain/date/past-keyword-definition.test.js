import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('date.past');

describe('date.past parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('date.past');
    const parsed = parseKeywordInvocation(`date.past(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes date.past(refDate=1577836800000) successfully', () => {
    const parsed = parseKeywordInvocation('date.past(refDate=1577836800000)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be integer, not object',
    });
  });

  test('rejects invalid years type before generation', () => {
    expect(validateArgs('refDate=1577836800000, years={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "years" must be integer, not object',
    });
  });

  test('rejects fractional years before generation', () => {
    expect(validateArgs('refDate=1577836800000, years=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "years" must be integer, not number',
    });
  });
});
