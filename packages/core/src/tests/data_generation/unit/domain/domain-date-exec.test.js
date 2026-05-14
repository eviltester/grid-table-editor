import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('date domain keyword execution', () => {
  test('executes date.anytime', () => {
    const result = executeDomainKeyword('date.anytime', { faker, args: [] });
    console.log('date.anytime', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.between', () => {
    // TODO(domain-args): define required `from` and `to` args in keyword help schema.
    expect(() => executeDomainKeyword('date.between', { faker, args: [] })).toThrow();
  });

  test('executes date.betweens', () => {
    // TODO(domain-args): define required `from` and `to` args (and optional `count`) in schema.
    expect(() => executeDomainKeyword('date.betweens', { faker, args: [] })).toThrow();
  });

  test('executes date.birthdate', () => {
    const result = executeDomainKeyword('date.birthdate', { faker, args: [] });
    console.log('date.birthdate', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.future', () => {
    const result = executeDomainKeyword('date.future', { faker, args: [] });
    console.log('date.future', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.month', () => {
    const result = executeDomainKeyword('date.month', { faker, args: [] });
    console.log('date.month', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.past', () => {
    const result = executeDomainKeyword('date.past', { faker, args: [] });
    console.log('date.past', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.recent', () => {
    const result = executeDomainKeyword('date.recent', { faker, args: [] });
    console.log('date.recent', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.soon', () => {
    const result = executeDomainKeyword('date.soon', { faker, args: [] });
    console.log('date.soon', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.timeZone', () => {
    const result = executeDomainKeyword('date.timeZone', { faker, args: [] });
    console.log('date.timeZone', result);
    expect(result).not.toBeUndefined();
  });

  test('executes date.weekday', () => {
    const result = executeDomainKeyword('date.weekday', { faker, args: [] });
    console.log('date.weekday', result);
    expect(result).not.toBeUndefined();
  });
});
