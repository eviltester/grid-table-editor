import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('date.recent');

describe('date.recent parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('date.recent');
    const parsed = parseKeywordInvocation(`date.recent(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes date.recent(days=7) successfully', () => {
    const parsed = parseKeywordInvocation('date.recent(days=7)');

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

  test('rejects negative days before generation', () => {
    expect(validateArgs('days=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "days" must be greater than or equal to 0',
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
