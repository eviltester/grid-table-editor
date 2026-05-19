import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('airline domain keyword execution', () => {
  const airlineKeywords = [
    'airline.aircraftType',
    'airline.airline',
    'airline.airline.iataCode',
    'airline.airline.name',
    'airline.airplane',
    'airline.airplane.iataTypeCode',
    'airline.airplane.name',
    'airline.airport',
    'airline.airport.iataCode',
    'airline.airport.name',
    'airline.flightNumber',
    'airline.recordLocator',
    'airline.seat',
  ];

  test.each(airlineKeywords)('executes %s', (keyword) => {
    const result = executeDomainKeyword(keyword, { faker, args: [] });
    assertDomainKeywordResult(keyword, result);
  });
});
