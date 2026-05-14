import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('vehicle domain keyword execution', () => {
  test('executes vehicle.bicycle', () => {
    const result = executeDomainKeyword('vehicle.bicycle', { faker, args: [] });
    console.log('vehicle.bicycle', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.color', () => {
    const result = executeDomainKeyword('vehicle.color', { faker, args: [] });
    console.log('vehicle.color', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.fuel', () => {
    const result = executeDomainKeyword('vehicle.fuel', { faker, args: [] });
    console.log('vehicle.fuel', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.manufacturer', () => {
    const result = executeDomainKeyword('vehicle.manufacturer', { faker, args: [] });
    console.log('vehicle.manufacturer', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.model', () => {
    const result = executeDomainKeyword('vehicle.model', { faker, args: [] });
    console.log('vehicle.model', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.type', () => {
    const result = executeDomainKeyword('vehicle.type', { faker, args: [] });
    console.log('vehicle.type', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.vehicle', () => {
    const result = executeDomainKeyword('vehicle.vehicle', { faker, args: [] });
    console.log('vehicle.vehicle', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.vin', () => {
    const result = executeDomainKeyword('vehicle.vin', { faker, args: [] });
    console.log('vehicle.vin', result);
    expect(result).not.toBeUndefined();
  });

  test('executes vehicle.vrm', () => {
    const result = executeDomainKeyword('vehicle.vrm', { faker, args: [] });
    console.log('vehicle.vrm', result);
    expect(result).not.toBeUndefined();
  });
});
