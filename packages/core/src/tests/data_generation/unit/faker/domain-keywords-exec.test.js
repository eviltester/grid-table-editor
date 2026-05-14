import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('domain keyword execution', () => {
  describe('person', () => {
    test('executes person.firstName', () => {
      const result = executeDomainKeyword('person.firstName', { faker });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('internet', () => {
    test('executes internet.email', () => {
      const result = executeDomainKeyword('internet.email', { faker });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('date', () => {
    test('executes date.recent', () => {
      const result = executeDomainKeyword('date.recent', { faker });
      expect(result instanceof Date).toBe(true);
    });
  });

  describe('airline', () => {
    test('executes airline.airplane.name', () => {
      const result = executeDomainKeyword('airline.airplane.name', { faker });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('executes airline.airplane.iataTypeCode', () => {
      const result = executeDomainKeyword('airline.airplane.iataTypeCode', { faker });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('string', () => {
    test('executes string.alpha', () => {
      const result = executeDomainKeyword('string.alpha', { faker, args: [6] });
      expect(typeof result).toBe('string');
      expect(result.length).toBe(6);
    });
  });

  describe('number', () => {
    test('executes number.int', () => {
      const result = executeDomainKeyword('number.int', { faker, args: [1, 10] });
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('literal', () => {
    test('executes literal.value', () => {
      const result = executeDomainKeyword('literal.value', {
        args: ['Pending'],
        customDelegates: {
          'literal.value': ({ args: runtimeArgs }) => runtimeArgs[0],
        },
      });
      expect(result).toBe('Pending');
    });
  });
});
