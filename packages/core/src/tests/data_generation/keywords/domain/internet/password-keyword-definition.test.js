import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.password');

describe('internet.password parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.password');
    const parsed = parseKeywordInvocation(`internet.password(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.password(length=12) successfully', () => {
    const parsed = parseKeywordInvocation('internet.password(length=12)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid length type before generation', () => {
    expect(validateArgs('length={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be integer, not object',
    });
  });

  test('rejects zero length before generation', () => {
    expect(validateArgs('length=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects negative length before generation', () => {
    expect(validateArgs('length=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects fractional length before generation', () => {
    expect(validateArgs('length=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be integer, not number',
    });
  });

  test('rejects invalid memorable type before generation', () => {
    expect(validateArgs('length=12, memorable={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "memorable" must be boolean, not object',
    });
  });

  test('rejects invalid pattern type before generation', () => {
    expect(validateArgs('length=12, pattern={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "pattern" must be regexp, not object',
    });
  });

  test('rejects invalid prefix type before generation', () => {
    expect(validateArgs('length=12, prefix={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "prefix" must be string, not object',
    });
  });
});
