import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('image.dataUri');

describe('image.dataUri parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('image.dataUri');
    const parsed = parseKeywordInvocation(`image.dataUri(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes image.dataUri(width=320, height=240, color="red", type="svg-base64") successfully', () => {
    const parsed = parseKeywordInvocation('image.dataUri(width=320, height=240, color="red", type="svg-base64")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid width type before generation', () => {
    expect(validateArgs('width={"bad":true}, height=240, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be number, not object',
    });
  });

  test('rejects zero width before generation', () => {
    expect(validateArgs('width=0, height=240, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects negative width before generation', () => {
    expect(validateArgs('width=-1, height=240, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be greater than 0',
    });
  });

  test('rejects fractional width before generation', () => {
    expect(validateArgs('width=1.5, height=240, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "width" must be an integer',
    });
  });

  test('rejects invalid height type before generation', () => {
    expect(validateArgs('width=320, height={"bad":true}, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be number, not object',
    });
  });

  test('rejects zero height before generation', () => {
    expect(validateArgs('width=320, height=0, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects negative height before generation', () => {
    expect(validateArgs('width=320, height=-1, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be greater than 0',
    });
  });

  test('rejects fractional height before generation', () => {
    expect(validateArgs('width=320, height=1.5, color="red", type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "height" must be an integer',
    });
  });

  test('rejects invalid color type before generation', () => {
    expect(validateArgs('width=320, height=240, color={"bad":true}, type="svg-base64"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "color" must be string, not object',
    });
  });

  test('rejects invalid type type before generation', () => {
    expect(validateArgs('width=320, height=240, color="red", type={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "type" must be svg-uri or svg-base64, not object',
    });
  });
});
