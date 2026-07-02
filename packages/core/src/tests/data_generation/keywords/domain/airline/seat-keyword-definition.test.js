import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('airline.seat');

describe('airline.seat parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('airline.seat');
    const parsed = parseKeywordInvocation(`airline.seat(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes airline.seat(aircraftType="widebody") successfully', () => {
    const parsed = parseKeywordInvocation('airline.seat(aircraftType="widebody")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid aircraftType type before generation', () => {
    expect(validateArgs('aircraftType={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "aircraftType" must be narrowbody, regional or widebody, not object',
    });
  });

  test('rejects unsupported aircraftType value before generation', () => {
    expect(validateArgs('aircraftType="unknown"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "aircraftType" must be narrowbody, regional or widebody, not string',
    });
  });
});
