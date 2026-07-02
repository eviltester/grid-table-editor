import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('lorem.paragraph');

describe('lorem.paragraph parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('lorem.paragraph');
    const parsed = parseKeywordInvocation(`lorem.paragraph(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes lorem.paragraph(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('lorem.paragraph(max=10, min=1)');

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

  test('rejects invalid sentenceCount type before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCount={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCount" must be number, not object',
    });
  });

  test('rejects zero sentenceCount before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCount=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCount" must be greater than 0',
    });
  });

  test('rejects negative sentenceCount before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCount=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCount" must be greater than 0',
    });
  });

  test('rejects fractional sentenceCount before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCount=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCount" must be an integer',
    });
  });

  test('rejects invalid sentenceCountMax type before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCountMax={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCountMax" must be number, not object',
    });
  });

  test('rejects invalid sentenceCountMin type before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCountMin={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sentenceCountMin" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });

  test('rejects sentenceCountMin greater than sentenceCountMax before generation', () => {
    expect(validateArgs('min=1, max=10, sentenceCountMax=1, sentenceCountMin=10')).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "sentenceCountMin" must be less than or equal to argument "sentenceCountMax"',
    });
  });
});
