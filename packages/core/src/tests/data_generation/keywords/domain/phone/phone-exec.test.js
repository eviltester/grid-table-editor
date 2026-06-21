import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('phone domain keyword execution', () => {
  test('executes phone.imei', () => {
    const result = executeDomainKeyword('phone.imei', { faker, args: [] });
    console.log('phone.imei', result);
    expectMeaningfulString(result);
  });

  test('executes phone.number', () => {
    const result = executeDomainKeyword('phone.number', { faker, args: [] });
    console.log('phone.number', result);
    expectMeaningfulString(result);
  });
});
