import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('airline.recordLocator');

describe('airline.recordLocator parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('airline.recordLocator');
    const parsed = parseKeywordInvocation(`airline.recordLocator(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes airline.recordLocator(allowNumerics=true) successfully', () => {
    const parsed = parseKeywordInvocation('airline.recordLocator(allowNumerics=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid allowNumerics type before generation', () => {
    expect(validateArgs('allowNumerics={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "allowNumerics" must be boolean, not object',
    });
  });

  test('rejects invalid allowNumerics integer before generation', () => {
    expect(validateArgs('allowNumerics=123')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "allowNumerics" must be boolean, not integer',
    });
  });

  test('rejects invalid allowVisuallySimilarCharacters type before generation', () => {
    expect(validateArgs('allowNumerics=true, allowVisuallySimilarCharacters={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "allowVisuallySimilarCharacters" must be boolean, not object',
    });
  });

  test('rejects invalid allowVisuallySimilarCharacters string before generation', () => {
    expect(validateArgs('allowNumerics=true, allowVisuallySimilarCharacters="true"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "allowVisuallySimilarCharacters" must be boolean, not string',
    });
  });
});
