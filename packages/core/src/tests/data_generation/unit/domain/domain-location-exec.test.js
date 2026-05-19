import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('location domain keyword execution', () => {
  test('executes location.buildingNumber', () => {
    const result = executeDomainKeyword('location.buildingNumber', { faker, args: [] });
    console.log('location.buildingNumber', result);
    expectMeaningfulString(result);
  });

  test('executes location.cardinalDirection', () => {
    const result = executeDomainKeyword('location.cardinalDirection', { faker, args: [] });
    console.log('location.cardinalDirection', result);
    expectMeaningfulString(result);
  });

  test('executes location.city', () => {
    const result = executeDomainKeyword('location.city', { faker, args: [] });
    console.log('location.city', result);
    expectMeaningfulString(result);
  });

  test('executes location.continent', () => {
    const result = executeDomainKeyword('location.continent', { faker, args: [] });
    console.log('location.continent', result);
    expectMeaningfulString(result);
  });

  test('executes location.country', () => {
    const result = executeDomainKeyword('location.country', { faker, args: [] });
    console.log('location.country', result);
    expectMeaningfulString(result);
  });

  test('executes location.countryCode', () => {
    const result = executeDomainKeyword('location.countryCode', { faker, args: [] });
    console.log('location.countryCode', result);
    expect(result).toMatch(/^[A-Z]{2}$/);
  });

  test('executes location.county', () => {
    const result = executeDomainKeyword('location.county', { faker, args: [] });
    console.log('location.county', result);
    expectMeaningfulString(result);
  });

  test('executes location.direction', () => {
    const result = executeDomainKeyword('location.direction', { faker, args: [] });
    console.log('location.direction', result);
    expectMeaningfulString(result);
  });

  test('executes location.language', () => {
    const result = executeDomainKeyword('location.language', { faker, args: [] });
    console.log('location.language', result);
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        alpha2: expect.any(String),
        alpha3: expect.any(String),
      })
    );
  });

  test('executes location.latitude', () => {
    const result = executeDomainKeyword('location.latitude', { faker, args: [] });
    console.log('location.latitude', result);
    expect(typeof result).toBe('number');
  });

  test('location.latitude respects min/max/precision params', () => {
    const result = executeDomainKeyword('location.latitude', { faker, args: [-10, 10, 2] });
    console.log('location.latitude(min=-10,max=10,precision=2)', result);
    const numeric = Number(result);
    expect(numeric).toBeGreaterThanOrEqual(-10);
    expect(numeric).toBeLessThanOrEqual(10);
    const fraction = String(result).split('.')[1] || '';
    expect(fraction.length).toBeLessThanOrEqual(2);
  });

  test('location.latitude respects min/max/precision params via named arguments', () => {
    const parsed = parseKeywordInvocation('location.latitude(min=-10, max=10, precision=2)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    const numeric = Number(result);
    expect(numeric).toBeGreaterThanOrEqual(-10);
    expect(numeric).toBeLessThanOrEqual(10);
    const fraction = String(result).split('.')[1] || '';
    expect(fraction.length).toBeLessThanOrEqual(2);
  });

  test('executes location.longitude', () => {
    const result = executeDomainKeyword('location.longitude', { faker, args: [] });
    console.log('location.longitude', result);
    expect(typeof result).toBe('number');
  });

  test('location.longitude respects min/max/precision params', () => {
    const result = executeDomainKeyword('location.longitude', { faker, args: [-20, 20, 3] });
    console.log('location.longitude(min=-20,max=20,precision=3)', result);
    const numeric = Number(result);
    expect(numeric).toBeGreaterThanOrEqual(-20);
    expect(numeric).toBeLessThanOrEqual(20);
    const fraction = String(result).split('.')[1] || '';
    expect(fraction.length).toBeLessThanOrEqual(3);
  });

  test('location.longitude respects min/max/precision params via named arguments', () => {
    const parsed = parseKeywordInvocation('location.longitude(min=-20, max=20, precision=3)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    const numeric = Number(result);
    expect(numeric).toBeGreaterThanOrEqual(-20);
    expect(numeric).toBeLessThanOrEqual(20);
    const fraction = String(result).split('.')[1] || '';
    expect(fraction.length).toBeLessThanOrEqual(3);
  });

  test('executes location.nearbyGPSCoordinate', () => {
    const result = executeDomainKeyword('location.nearbyGPSCoordinate', { faker, args: [] });
    console.log('location.nearbyGPSCoordinate', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  test('executes location.ordinalDirection', () => {
    const result = executeDomainKeyword('location.ordinalDirection', { faker, args: [] });
    console.log('location.ordinalDirection', result);
    expectMeaningfulString(result);
  });

  test('executes location.secondaryAddress', () => {
    const result = executeDomainKeyword('location.secondaryAddress', { faker, args: [] });
    console.log('location.secondaryAddress', result);
    expectMeaningfulString(result);
  });

  test('executes location.state', () => {
    const result = executeDomainKeyword('location.state', { faker, args: [] });
    console.log('location.state', result);
    expectMeaningfulString(result);
  });

  test('executes location.street', () => {
    const result = executeDomainKeyword('location.street', { faker, args: [] });
    console.log('location.street', result);
    expectMeaningfulString(result);
  });

  test('executes location.streetAddress', () => {
    const result = executeDomainKeyword('location.streetAddress', { faker, args: [] });
    console.log('location.streetAddress', result);
    expectMeaningfulString(result);
  });

  test('executes location.timeZone', () => {
    const result = executeDomainKeyword('location.timeZone', { faker, args: [] });
    console.log('location.timeZone', result);
    expect(result).toMatch(/^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/);
  });

  test('executes location.zipCode', () => {
    const result = executeDomainKeyword('location.zipCode', { faker, args: [] });
    console.log('location.zipCode', result);
    expectMeaningfulString(result);
  });
});
