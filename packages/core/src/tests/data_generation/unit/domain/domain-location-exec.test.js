import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('location domain keyword execution', () => {
  test('executes location.buildingNumber', () => {
    const result = executeDomainKeyword('location.buildingNumber', { faker, args: [] });
    console.log('location.buildingNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.cardinalDirection', () => {
    const result = executeDomainKeyword('location.cardinalDirection', { faker, args: [] });
    console.log('location.cardinalDirection', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.city', () => {
    const result = executeDomainKeyword('location.city', { faker, args: [] });
    console.log('location.city', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.continent', () => {
    const result = executeDomainKeyword('location.continent', { faker, args: [] });
    console.log('location.continent', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.country', () => {
    const result = executeDomainKeyword('location.country', { faker, args: [] });
    console.log('location.country', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.countryCode', () => {
    const result = executeDomainKeyword('location.countryCode', { faker, args: [] });
    console.log('location.countryCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.county', () => {
    const result = executeDomainKeyword('location.county', { faker, args: [] });
    console.log('location.county', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.direction', () => {
    const result = executeDomainKeyword('location.direction', { faker, args: [] });
    console.log('location.direction', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.language', () => {
    const result = executeDomainKeyword('location.language', { faker, args: [] });
    console.log('location.language', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.latitude', () => {
    const result = executeDomainKeyword('location.latitude', { faker, args: [] });
    console.log('location.latitude', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.longitude', () => {
    const result = executeDomainKeyword('location.longitude', { faker, args: [] });
    console.log('location.longitude', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.nearbyGPSCoordinate', () => {
    const result = executeDomainKeyword('location.nearbyGPSCoordinate', { faker, args: [] });
    console.log('location.nearbyGPSCoordinate', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.ordinalDirection', () => {
    const result = executeDomainKeyword('location.ordinalDirection', { faker, args: [] });
    console.log('location.ordinalDirection', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.secondaryAddress', () => {
    const result = executeDomainKeyword('location.secondaryAddress', { faker, args: [] });
    console.log('location.secondaryAddress', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.state', () => {
    const result = executeDomainKeyword('location.state', { faker, args: [] });
    console.log('location.state', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.street', () => {
    const result = executeDomainKeyword('location.street', { faker, args: [] });
    console.log('location.street', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.streetAddress', () => {
    const result = executeDomainKeyword('location.streetAddress', { faker, args: [] });
    console.log('location.streetAddress', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.timeZone', () => {
    const result = executeDomainKeyword('location.timeZone', { faker, args: [] });
    console.log('location.timeZone', result);
    expect(result).not.toBeUndefined();
  });

  test('executes location.zipCode', () => {
    const result = executeDomainKeyword('location.zipCode', { faker, args: [] });
    console.log('location.zipCode', result);
    expect(result).not.toBeUndefined();
  });
});
