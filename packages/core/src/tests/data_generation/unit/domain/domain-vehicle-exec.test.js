import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('vehicle domain keyword execution', () => {
  test('executes vehicle.bicycle', () => {
    const result = executeDomainKeyword('vehicle.bicycle', { faker, args: [] });
    console.log('vehicle.bicycle', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.color', () => {
    const result = executeDomainKeyword('vehicle.color', { faker, args: [] });
    console.log('vehicle.color', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.fuel', () => {
    const result = executeDomainKeyword('vehicle.fuel', { faker, args: [] });
    console.log('vehicle.fuel', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.manufacturer', () => {
    const result = executeDomainKeyword('vehicle.manufacturer', { faker, args: [] });
    console.log('vehicle.manufacturer', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.model', () => {
    const result = executeDomainKeyword('vehicle.model', { faker, args: [] });
    console.log('vehicle.model', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.type', () => {
    const result = executeDomainKeyword('vehicle.type', { faker, args: [] });
    console.log('vehicle.type', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.vehicle', () => {
    const result = executeDomainKeyword('vehicle.vehicle', { faker, args: [] });
    console.log('vehicle.vehicle', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.vin', () => {
    const result = executeDomainKeyword('vehicle.vin', { faker, args: [] });
    console.log('vehicle.vin', result);
    expectMeaningfulString(result);
  });

  test('executes vehicle.vrm', () => {
    const result = executeDomainKeyword('vehicle.vrm', { faker, args: [] });
    console.log('vehicle.vrm', result);
    expectMeaningfulString(result);
  });
});
