import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

describe('date domain keyword execution', () => {
  test('executes date.anytime', () => {
    const result = executeDomainKeyword('date.anytime', { faker, args: [] });
    console.log('date.anytime', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.between', () => {
    const from = new Date('2020-01-01T00:00:00.000Z');
    const to = new Date('2020-01-31T00:00:00.000Z');
    const result = executeDomainKeyword('date.between', { faker, args: [from.getTime(), to.getTime()] });
    console.log('date.between(from,to)', result);
    expect(result.getTime()).toBeGreaterThanOrEqual(from.getTime());
    expect(result.getTime()).toBeLessThanOrEqual(to.getTime());
  });

  test('executes date.between with named arguments', () => {
    const parsed = parseKeywordInvocation('date.between(from=1577836800000, to=1580428800000)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result.getTime()).toBeGreaterThanOrEqual(1577836800000);
    expect(result.getTime()).toBeLessThanOrEqual(1580428800000);
  });

  test('executes date.betweens', () => {
    const from = new Date('2020-02-01T00:00:00.000Z');
    const to = new Date('2020-02-29T00:00:00.000Z');
    const result = executeDomainKeyword('date.betweens', {
      faker,
      args: [3, from.getTime(), to.getTime()],
    });
    console.log('date.betweens(count=3,from,to)', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    for (const value of result) {
      expect(value.getTime()).toBeGreaterThanOrEqual(from.getTime());
      expect(value.getTime()).toBeLessThanOrEqual(to.getTime());
    }
  });

  test('executes date.betweens with named arguments', () => {
    const parsed = parseKeywordInvocation('date.betweens(count=3, from=1580515200000, to=1582934400000)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    for (const value of result) {
      expect(value.getTime()).toBeGreaterThanOrEqual(1580515200000);
      expect(value.getTime()).toBeLessThanOrEqual(1582934400000);
    }
  });

  test('executes date.birthdate', () => {
    const result = executeDomainKeyword('date.birthdate', { faker, args: [] });
    console.log('date.birthdate', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.future', () => {
    const result = executeDomainKeyword('date.future', { faker, args: [] });
    console.log('date.future', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.month', () => {
    const result = executeDomainKeyword('date.month', { faker, args: [] });
    console.log('date.month', result);
    expect(result).toMatch(/^[A-Za-z]+$/);
  });

  test('executes date.past', () => {
    const result = executeDomainKeyword('date.past', { faker, args: [] });
    console.log('date.past', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.recent', () => {
    const result = executeDomainKeyword('date.recent', { faker, args: [] });
    console.log('date.recent', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.soon', () => {
    const result = executeDomainKeyword('date.soon', { faker, args: [] });
    console.log('date.soon', result);
    expect(result).toBeInstanceOf(Date);
  });

  test('executes date.timeZone', () => {
    const result = executeDomainKeyword('date.timeZone', { faker, args: [] });
    console.log('date.timeZone', result);
    expect(result).toMatch(/^[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+)+$/);
  });

  test('executes date.weekday', () => {
    const result = executeDomainKeyword('date.weekday', { faker, args: [] });
    console.log('date.weekday', result);
    expect(result).toMatch(/^[A-Za-z]+$/);
  });
});
