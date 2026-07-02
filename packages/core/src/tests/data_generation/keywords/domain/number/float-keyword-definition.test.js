import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('number.float');

describe('number.float parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('number.float');
    const parsed = parseKeywordInvocation(`number.float(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes number.float(fractionDigits=2) successfully', () => {
    const parsed = parseKeywordInvocation('number.float(fractionDigits=2)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('number');
  });

  test('rejects invalid fractionDigits type before generation', () => {
    expect(validateArgs('fractionDigits={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "fractionDigits" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('fractionDigits=2, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('fractionDigits=2, min={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid multipleOf type before generation', () => {
    expect(validateArgs('fractionDigits=2, multipleOf={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "multipleOf" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('fractionDigits=2, max=1, min=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
