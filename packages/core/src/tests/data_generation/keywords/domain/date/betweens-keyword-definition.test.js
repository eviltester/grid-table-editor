import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('date.betweens');

describe('date.betweens parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('date.betweens');
    const parsed = parseKeywordInvocation(`date.betweens(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes date.betweens(from=1577836800000, to=1609372800000) successfully', () => {
    const parsed = parseKeywordInvocation('date.betweens(from=1577836800000, to=1609372800000)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid count type before generation', () => {
    expect(validateArgs('count={"bad":true}, from=1577836800000, to=1609372800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be integer, not object',
    });
  });

  test('rejects zero count before generation', () => {
    expect(validateArgs('count=0, from=1577836800000, to=1609372800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be greater than 0',
    });
  });

  test('rejects negative count before generation', () => {
    expect(validateArgs('count=-1, from=1577836800000, to=1609372800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be greater than 0',
    });
  });

  test('rejects fractional count before generation', () => {
    expect(validateArgs('count=1.5, from=1577836800000, to=1609372800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "count" must be integer, not number',
    });
  });

  test('rejects missing required from before generation', () => {
    expect(validateArgs('')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "from" is required',
    });
  });

  test('rejects invalid from type before generation', () => {
    expect(validateArgs('from={"bad":true}, to=1609372800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "from" must be integer, not object',
    });
  });

  test('rejects missing required to before generation', () => {
    expect(validateArgs('from=1577836800000')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "to" is required',
    });
  });

  test('rejects invalid to type before generation', () => {
    expect(validateArgs('from=1577836800000, to={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "to" must be integer, not object',
    });
  });

  test('rejects from greater than to before generation', () => {
    expect(validateArgs('from=10, to=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "from" must be less than or equal to argument "to"',
    });
  });
});
