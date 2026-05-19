import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('location domain keyword execution', () => {
  test('executes location.buildingNumber', () => {
    const result = executeDomainKeyword('location.buildingNumber', { faker, args: [] });
    console.log('location.buildingNumber', result);
    assertDomainKeywordResult('location.buildingNumber', result);
  });

  test('executes location.cardinalDirection', () => {
    const result = executeDomainKeyword('location.cardinalDirection', { faker, args: [] });
    console.log('location.cardinalDirection', result);
    assertDomainKeywordResult('location.cardinalDirection', result);
  });

  test('executes location.city', () => {
    const result = executeDomainKeyword('location.city', { faker, args: [] });
    console.log('location.city', result);
    assertDomainKeywordResult('location.city', result);
  });

  test('executes location.continent', () => {
    const result = executeDomainKeyword('location.continent', { faker, args: [] });
    console.log('location.continent', result);
    assertDomainKeywordResult('location.continent', result);
  });

  test('executes location.country', () => {
    const result = executeDomainKeyword('location.country', { faker, args: [] });
    console.log('location.country', result);
    assertDomainKeywordResult('location.country', result);
  });

  test('executes location.countryCode', () => {
    const result = executeDomainKeyword('location.countryCode', { faker, args: [] });
    console.log('location.countryCode', result);
    assertDomainKeywordResult('location.countryCode', result);
  });

  test('executes location.county', () => {
    const result = executeDomainKeyword('location.county', { faker, args: [] });
    console.log('location.county', result);
    assertDomainKeywordResult('location.county', result);
  });

  test('executes location.direction', () => {
    const result = executeDomainKeyword('location.direction', { faker, args: [] });
    console.log('location.direction', result);
    assertDomainKeywordResult('location.direction', result);
  });

  test('executes location.language', () => {
    const result = executeDomainKeyword('location.language', { faker, args: [] });
    console.log('location.language', result);
    assertDomainKeywordResult('location.language', result);
  });

  test('executes location.latitude', () => {
    const result = executeDomainKeyword('location.latitude', { faker, args: [] });
    console.log('location.latitude', result);
    assertDomainKeywordResult('location.latitude', result);
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

  test('executes location.longitude', () => {
    const result = executeDomainKeyword('location.longitude', { faker, args: [] });
    console.log('location.latitude', result);
    assertDomainKeywordResult('location.latitude', result);
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

  test('executes location.nearbyGPSCoordinate', () => {
    const result = executeDomainKeyword('location.nearbyGPSCoordinate', { faker, args: [] });
    console.log('location.longitude', result);
    assertDomainKeywordResult('location.longitude', result);
  });

  test('executes location.ordinalDirection', () => {
    const result = executeDomainKeyword('location.ordinalDirection', { faker, args: [] });
    console.log('location.ordinalDirection', result);
    assertDomainKeywordResult('location.ordinalDirection', result);
  });

  test('executes location.secondaryAddress', () => {
    const result = executeDomainKeyword('location.secondaryAddress', { faker, args: [] });
    console.log('location.secondaryAddress', result);
    assertDomainKeywordResult('location.secondaryAddress', result);
  });

  test('executes location.state', () => {
    const result = executeDomainKeyword('location.state', { faker, args: [] });
    console.log('location.state', result);
    assertDomainKeywordResult('location.state', result);
  });

  test('executes location.street', () => {
    const result = executeDomainKeyword('location.street', { faker, args: [] });
    console.log('location.street', result);
    assertDomainKeywordResult('location.street', result);
  });

  test('executes location.streetAddress', () => {
    const result = executeDomainKeyword('location.streetAddress', { faker, args: [] });
    console.log('location.streetAddress', result);
    assertDomainKeywordResult('location.streetAddress', result);
  });

  test('executes location.timeZone', () => {
    const result = executeDomainKeyword('location.timeZone', { faker, args: [] });
    console.log('location.timeZone', result);
    assertDomainKeywordResult('location.timeZone', result);
  });

  test('executes location.zipCode', () => {
    const result = executeDomainKeyword('location.zipCode', { faker, args: [] });
    console.log('location.zipCode', result);
    assertDomainKeywordResult('location.zipCode', result);
  });
});
