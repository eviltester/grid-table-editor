import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('phone domain keyword execution', () => {
  test('executes phone.imei', () => {
    const result = executeDomainKeyword('phone.imei', { faker, args: [] });
    console.log('phone.imei', result);
    expect(result).not.toBeUndefined();
  });

  test('executes phone.number', () => {
    const result = executeDomainKeyword('phone.number', { faker, args: [] });
    console.log('phone.number', result);
    expect(result).not.toBeUndefined();
  });
});
