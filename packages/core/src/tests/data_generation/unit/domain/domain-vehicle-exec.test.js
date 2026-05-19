import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('vehicle domain keyword execution', () => {
  test('executes vehicle.bicycle', () => {
    const result = executeDomainKeyword('vehicle.bicycle', { faker, args: [] });
    console.log('vehicle.bicycle', result);
    assertDomainKeywordResult('vehicle.bicycle', result);
  });

  test('executes vehicle.color', () => {
    const result = executeDomainKeyword('vehicle.color', { faker, args: [] });
    console.log('vehicle.color', result);
    assertDomainKeywordResult('vehicle.color', result);
  });

  test('executes vehicle.fuel', () => {
    const result = executeDomainKeyword('vehicle.fuel', { faker, args: [] });
    console.log('vehicle.fuel', result);
    assertDomainKeywordResult('vehicle.fuel', result);
  });

  test('executes vehicle.manufacturer', () => {
    const result = executeDomainKeyword('vehicle.manufacturer', { faker, args: [] });
    console.log('vehicle.manufacturer', result);
    assertDomainKeywordResult('vehicle.manufacturer', result);
  });

  test('executes vehicle.model', () => {
    const result = executeDomainKeyword('vehicle.model', { faker, args: [] });
    console.log('vehicle.model', result);
    assertDomainKeywordResult('vehicle.model', result);
  });

  test('executes vehicle.type', () => {
    const result = executeDomainKeyword('vehicle.type', { faker, args: [] });
    console.log('vehicle.type', result);
    assertDomainKeywordResult('vehicle.type', result);
  });

  test('executes vehicle.vehicle', () => {
    const result = executeDomainKeyword('vehicle.vehicle', { faker, args: [] });
    console.log('vehicle.vehicle', result);
    assertDomainKeywordResult('vehicle.vehicle', result);
  });

  test('executes vehicle.vin', () => {
    const result = executeDomainKeyword('vehicle.vin', { faker, args: [] });
    console.log('vehicle.vin', result);
    assertDomainKeywordResult('vehicle.vin', result);
  });

  test('executes vehicle.vrm', () => {
    const result = executeDomainKeyword('vehicle.vrm', { faker, args: [] });
    console.log('vehicle.vrm', result);
    assertDomainKeywordResult('vehicle.vrm', result);
  });
});
