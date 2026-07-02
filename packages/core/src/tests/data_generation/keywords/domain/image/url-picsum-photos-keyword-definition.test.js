import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('image.urlPicsumPhotos');

describe('image.urlPicsumPhotos parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('image.urlPicsumPhotos');
    const parsed = parseKeywordInvocation(`image.urlPicsumPhotos(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes image.urlPicsumPhotos(width=320, height=240, grayscale=true, blur=3) successfully', () => {
    const parsed = parseKeywordInvocation('image.urlPicsumPhotos(width=320, height=240, grayscale=true, blur=3)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid width type before generation', () => {
    expect(validateArgs('width={"bad":true}, height=240, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be number, not object',
    });
  });

  test('rejects zero width before generation', () => {
    expect(validateArgs('width=0, height=240, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects negative width before generation', () => {
    expect(validateArgs('width=-1, height=240, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects fractional width before generation', () => {
    expect(validateArgs('width=1.5, height=240, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be an integer',
    });
  });

  test('rejects invalid height type before generation', () => {
    expect(validateArgs('width=320, height={"bad":true}, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be number, not object',
    });
  });

  test('rejects zero height before generation', () => {
    expect(validateArgs('width=320, height=0, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects negative height before generation', () => {
    expect(validateArgs('width=320, height=-1, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects fractional height before generation', () => {
    expect(validateArgs('width=320, height=1.5, grayscale=true, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be an integer',
    });
  });

  test('rejects invalid grayscale type before generation', () => {
    expect(validateArgs('width=320, height=240, grayscale={"bad":true}, blur=3')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "grayscale" must be boolean, not object',
    });
  });

  test('rejects invalid blur type before generation', () => {
    expect(validateArgs('width=320, height=240, grayscale=true, blur={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "blur" must be 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 or 10, not object',
    });
  });
});
