import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('airline domain keyword execution', () => {
  test('executes airline.aircraftType', () => {
    const result = executeDomainKeyword('airline.aircraftType', { faker, args: [] });
    console.log('airline.aircraftType', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airline', () => {
    const result = executeDomainKeyword('airline.airline', { faker, args: [] });
    console.log('airline.airline', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airline.iataCode', () => {
    const result = executeDomainKeyword('airline.airline.iataCode', { faker, args: [] });
    console.log('airline.airline.iataCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airline.name', () => {
    const result = executeDomainKeyword('airline.airline.name', { faker, args: [] });
    console.log('airline.airline.name', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airplane', () => {
    const result = executeDomainKeyword('airline.airplane', { faker, args: [] });
    console.log('airline.airplane', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airplane.iataTypeCode', () => {
    const result = executeDomainKeyword('airline.airplane.iataTypeCode', { faker, args: [] });
    console.log('airline.airplane.iataTypeCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airplane.name', () => {
    const result = executeDomainKeyword('airline.airplane.name', { faker, args: [] });
    console.log('airline.airplane.name', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airport', () => {
    const result = executeDomainKeyword('airline.airport', { faker, args: [] });
    console.log('airline.airport', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airport.iataCode', () => {
    const result = executeDomainKeyword('airline.airport.iataCode', { faker, args: [] });
    console.log('airline.airport.iataCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.airport.name', () => {
    const result = executeDomainKeyword('airline.airport.name', { faker, args: [] });
    console.log('airline.airport.name', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.flightNumber', () => {
    const result = executeDomainKeyword('airline.flightNumber', { faker, args: [] });
    console.log('airline.flightNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.recordLocator', () => {
    const result = executeDomainKeyword('airline.recordLocator', { faker, args: [] });
    console.log('airline.recordLocator', result);
    expect(result).not.toBeUndefined();
  });

  test('executes airline.seat', () => {
    const result = executeDomainKeyword('airline.seat', { faker, args: [] });
    console.log('airline.seat', result);
    expect(result).not.toBeUndefined();
  });
});
