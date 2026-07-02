import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('date.birthdate');

describe('date.birthdate parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('date.birthdate');
    const parsed = parseKeywordInvocation(`date.birthdate(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes date.birthdate(refDate=20000, max=69, min=16, mode="age") successfully', () => {
    const parsed = parseKeywordInvocation('date.birthdate(refDate=20000, max=69, min=16, mode="age")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('refDate={"bad":true}, max=69, min=16, mode="age"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('refDate=20000, max={"bad":true}, min=16, mode="age"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be integer, not object',
    });
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('refDate=20000, max=69, min={"bad":true}, mode="age"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be integer, not object',
    });
  });

  test('rejects invalid mode type before generation', () => {
    expect(validateArgs('refDate=20000, max=69, min=16, mode={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "mode" must be age or year, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('refDate=20000, max=1, min=10, mode="age"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
