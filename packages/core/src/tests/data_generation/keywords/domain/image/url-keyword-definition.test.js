import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('image.url');

describe('image.url parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('image.url');
    const parsed = parseKeywordInvocation(`image.url(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes image.url(height=1) successfully', () => {
    const parsed = parseKeywordInvocation('image.url(height=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid height type before generation', () => {
    expect(validateArgs('height={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be number, not object',
    });
  });

  test('rejects zero height before generation', () => {
    expect(validateArgs('height=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects negative height before generation', () => {
    expect(validateArgs('height=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects fractional height before generation', () => {
    expect(validateArgs('height=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be an integer',
    });
  });

  test('rejects invalid width type before generation', () => {
    expect(validateArgs('height=1, width={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be number, not object',
    });
  });

  test('rejects zero width before generation', () => {
    expect(validateArgs('height=1, width=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects negative width before generation', () => {
    expect(validateArgs('height=1, width=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects fractional width before generation', () => {
    expect(validateArgs('height=1, width=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be an integer',
    });
  });
});
