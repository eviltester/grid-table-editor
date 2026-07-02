import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('airline.flightNumber');

describe('airline.flightNumber parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('airline.flightNumber');
    const parsed = parseKeywordInvocation(`airline.flightNumber(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes airline.flightNumber(length=4, addLeadingZeros=true) successfully', () => {
    const parsed = parseKeywordInvocation('airline.flightNumber(length=4, addLeadingZeros=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
    expect(result).toMatch(/^\d{4}$/);
  });

  test('rejects invalid length type before generation', () => {
    expect(validateArgs('length={"bad":true}, addLeadingZeros=true')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be number, not object',
    });
  });

  test('rejects zero length before generation', () => {
    expect(validateArgs('length=0, addLeadingZeros=true')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects negative length before generation', () => {
    expect(validateArgs('length=-1, addLeadingZeros=true')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects fractional length before generation', () => {
    expect(validateArgs('length=1.5, addLeadingZeros=true')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be an integer',
    });
  });

  test('rejects invalid addLeadingZeros type before generation', () => {
    expect(validateArgs('length=4, addLeadingZeros={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "addLeadingZeros" must be boolean, not object',
    });
  });
});
