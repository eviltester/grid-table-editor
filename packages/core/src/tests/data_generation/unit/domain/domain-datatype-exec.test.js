import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('datatype domain keyword execution', () => {
  test('executes datatype.boolean', () => {
    const result = executeDomainKeyword('datatype.boolean', { faker, args: [] });
    console.log('datatype.boolean', result);
    expect(result).not.toBeUndefined();
  });
});
