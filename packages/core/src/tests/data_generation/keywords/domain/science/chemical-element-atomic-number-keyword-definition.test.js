import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('science.chemicalElement.atomicNumber');

describe('science.chemicalElement.atomicNumber parameter validation', () => {
  test('executes science.chemicalElement.atomicNumber() successfully', () => {
    const parsed = parseKeywordInvocation('science.chemicalElement.atomicNumber()');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('number');
  });
});
