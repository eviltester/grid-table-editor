import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('lorem.paragraphs');

describe('lorem.paragraphs parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('lorem.paragraphs');
    const parsed = parseKeywordInvocation(`lorem.paragraphs(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes lorem.paragraphs(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('lorem.paragraphs(max=10, min=1)');

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

  test('rejects invalid paragraphCount type before generation', () => {
    expect(validateArgs('paragraphCount={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCount" must be number, not object',
    });
  });

  test('rejects zero paragraphCount before generation', () => {
    expect(validateArgs('paragraphCount=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCount" must be greater than 0',
    });
  });

  test('rejects negative paragraphCount before generation', () => {
    expect(validateArgs('paragraphCount=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCount" must be greater than 0',
    });
  });

  test('rejects fractional paragraphCount before generation', () => {
    expect(validateArgs('paragraphCount=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCount" must be an integer',
    });
  });

  test('rejects invalid separator type before generation', () => {
    expect(validateArgs('min=1, max=10, separator={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "separator" must be string, not object',
    });
  });

  test('rejects invalid paragraphCountMax type before generation', () => {
    expect(validateArgs('paragraphCountMax={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCountMax" must be number, not object',
    });
  });

  test('rejects invalid paragraphCountMin type before generation', () => {
    expect(validateArgs('paragraphCountMin={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "paragraphCountMin" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });

  test('rejects paragraphCountMin greater than paragraphCountMax before generation', () => {
    expect(validateArgs('paragraphCountMax=1, paragraphCountMin=10')).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "paragraphCountMin" must be less than or equal to argument "paragraphCountMax"',
    });
  });
});
