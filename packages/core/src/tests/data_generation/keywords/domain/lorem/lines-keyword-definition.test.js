import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('lorem.lines');

describe('lorem.lines parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('lorem.lines');
    const parsed = parseKeywordInvocation(`lorem.lines(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes lorem.lines(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('lorem.lines(max=10, min=1)');

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

  test('rejects invalid lineCount type before generation', () => {
    expect(validateArgs('lineCount={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCount" must be number, not object',
    });
  });

  test('rejects zero lineCount before generation', () => {
    expect(validateArgs('lineCount=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCount" must be greater than 0',
    });
  });

  test('rejects negative lineCount before generation', () => {
    expect(validateArgs('lineCount=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCount" must be greater than 0',
    });
  });

  test('rejects fractional lineCount before generation', () => {
    expect(validateArgs('lineCount=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCount" must be an integer',
    });
  });

  test('rejects invalid lineCountMax type before generation', () => {
    expect(validateArgs('lineCountMax={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCountMax" must be number, not object',
    });
  });

  test('rejects invalid lineCountMin type before generation', () => {
    expect(validateArgs('lineCountMin={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCountMin" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });

  test('rejects lineCountMin greater than lineCountMax before generation', () => {
    expect(validateArgs('lineCountMax=1, lineCountMin=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "lineCountMin" must be less than or equal to argument "lineCountMax"',
    });
  });
});
