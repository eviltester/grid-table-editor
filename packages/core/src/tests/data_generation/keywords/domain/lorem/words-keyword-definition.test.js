import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('lorem.words');

describe('lorem.words parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('lorem.words');
    const parsed = parseKeywordInvocation(`lorem.words(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes lorem.words(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('lorem.words(max=10, min=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('min={"bad":true}, max=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('min=1, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid wordCount type before generation', () => {
    expect(validateArgs('min=1, max=10, wordCount={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCount" must be number, not object',
    });
  });

  test('rejects zero wordCount before generation', () => {
    expect(validateArgs('min=1, max=10, wordCount=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCount" must be greater than 0',
    });
  });

  test('rejects negative wordCount before generation', () => {
    expect(validateArgs('min=1, max=10, wordCount=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCount" must be greater than 0',
    });
  });

  test('rejects fractional wordCount before generation', () => {
    expect(validateArgs('min=1, max=10, wordCount=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCount" must be an integer',
    });
  });

  test('rejects invalid wordCountMax type before generation', () => {
    expect(validateArgs('min=1, max=10, wordCountMax={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCountMax" must be number, not object',
    });
  });

  test('rejects invalid wordCountMin type before generation', () => {
    expect(validateArgs('min=1, max=10, wordCountMin={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCountMin" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });

  test('rejects wordCountMin greater than wordCountMax before generation', () => {
    expect(validateArgs('min=1, max=10, wordCountMax=1, wordCountMin=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "wordCountMin" must be less than or equal to argument "wordCountMax"',
    });
  });
});
