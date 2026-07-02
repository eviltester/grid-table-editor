import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('string.fromCharacters');

describe('string.fromCharacters parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('string.fromCharacters');
    const parsed = parseKeywordInvocation(`string.fromCharacters(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes string.fromCharacters(characters="ABC123") successfully', () => {
    const parsed = parseKeywordInvocation('string.fromCharacters(characters="ABC123")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects missing required characters before generation', () => {
    expect(validateArgs('')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "characters" is required',
    });
  });

  test('rejects invalid characters type before generation', () => {
    expect(validateArgs('characters={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "characters" must be string or array, not object',
    });
  });

  test('rejects invalid length type before generation', () => {
    expect(validateArgs('characters="ABC123", length={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be integer, not object',
    });
  });

  test('rejects zero length before generation', () => {
    expect(validateArgs('characters="ABC123", length=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects negative length before generation', () => {
    expect(validateArgs('characters="ABC123", length=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects fractional length before generation', () => {
    expect(validateArgs('characters="ABC123", length=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be integer, not number',
    });
  });
});
