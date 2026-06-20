import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('airline domain keyword execution', () => {
  test('executes airline.aircraftType', () => {
    const result = executeDomainKeyword('airline.aircraftType', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes airline.airline', () => {
    const result = executeDomainKeyword('airline.airline', { faker, args: [] });
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        iataCode: expect.any(String),
      })
    );
    expect(result.iataCode).toMatch(/^[A-Z0-9]{2}$/);
  });

  test('executes airline.airline.iataCode', () => {
    const result = executeDomainKeyword('airline.airline.iataCode', { faker, args: [] });
    expect(result).toMatch(/^[A-Z0-9]{2}$/);
  });

  test('executes airline.airline.name', () => {
    const result = executeDomainKeyword('airline.airline.name', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes airline.airplane', () => {
    const result = executeDomainKeyword('airline.airplane', { faker, args: [] });
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        iataTypeCode: expect.any(String),
      })
    );
    expect(result.iataTypeCode).toMatch(/^[A-Z0-9]{3}$/);
  });

  test('executes airline.airplane.iataTypeCode', () => {
    const result = executeDomainKeyword('airline.airplane.iataTypeCode', { faker, args: [] });
    expect(result).toMatch(/^[A-Z0-9]{3}$/);
  });

  test('executes airline.airplane.name', () => {
    const result = executeDomainKeyword('airline.airplane.name', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes airline.airport', () => {
    const result = executeDomainKeyword('airline.airport', { faker, args: [] });
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        iataCode: expect.any(String),
      })
    );
    expect(result.iataCode).toMatch(/^[A-Z]{3}$/);
  });

  test('executes airline.airport.iataCode', () => {
    const result = executeDomainKeyword('airline.airport.iataCode', { faker, args: [] });
    expect(result).toMatch(/^[A-Z]{3}$/);
  });

  test('executes airline.airport.name', () => {
    const result = executeDomainKeyword('airline.airport.name', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes airline.flightNumber', () => {
    const result = executeDomainKeyword('airline.flightNumber', { faker, args: [] });
    expect(result).toMatch(/^\d{1,4}$/);
  });

  test('executes airline.recordLocator', () => {
    const result = executeDomainKeyword('airline.recordLocator', { faker, args: [] });
    expect(result).toMatch(/^[A-Z0-9]{6}$/);
  });

  test('executes airline.seat', () => {
    const result = executeDomainKeyword('airline.seat', { faker, args: [] });
    expect(result).toMatch(/^\d{1,2}[A-Z]$/);
  });
});
