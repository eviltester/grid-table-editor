import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('finance.amount');

describe('finance.amount parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('finance.amount');
    const parsed = parseKeywordInvocation(`finance.amount(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes finance.amount(autoFormat=true) successfully', () => {
    const parsed = parseKeywordInvocation('finance.amount(autoFormat=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid autoFormat type before generation', () => {
    expect(validateArgs('autoFormat={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "autoFormat" must be boolean, not object',
    });
  });

  test('rejects invalid dec type before generation', () => {
    expect(validateArgs('autoFormat=true, dec={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "dec" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('autoFormat=true, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('autoFormat=true, min={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid symbol type before generation', () => {
    expect(validateArgs('autoFormat=true, symbol={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "symbol" must be string, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('autoFormat=true, max=1, min=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
