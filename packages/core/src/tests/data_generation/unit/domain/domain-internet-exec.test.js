import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('internet domain keyword execution', () => {
  test('executes internet.color', () => {
    const result = executeDomainKeyword('internet.color', { faker, args: [] });
    console.log('internet.color', result);
    expectMeaningfulString(result);
  });

  test('executes internet.displayName', () => {
    const result = executeDomainKeyword('internet.displayName', { faker, args: [] });
    console.log('internet.displayName', result);
    expectMeaningfulString(result);
  });

  test('executes internet.domainName', () => {
    const result = executeDomainKeyword('internet.domainName', { faker, args: [] });
    console.log('internet.domainName', result);
    expectMeaningfulString(result);
  });

  test('executes internet.domainSuffix', () => {
    const result = executeDomainKeyword('internet.domainSuffix', { faker, args: [] });
    console.log('internet.domainSuffix', result);
    expectMeaningfulString(result);
  });

  test('executes internet.domainWord', () => {
    const result = executeDomainKeyword('internet.domainWord', { faker, args: [] });
    console.log('internet.domainWord', result);
    expectMeaningfulString(result);
  });

  test('executes internet.email', () => {
    const result = executeDomainKeyword('internet.email', { faker, args: [] });
    console.log('internet.email', result);
    expect(result).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('executes internet.emoji', () => {
    const result = executeDomainKeyword('internet.emoji', { faker, args: [] });
    console.log('internet.emoji', result);
    expectMeaningfulString(result);
  });

  test('executes internet.exampleEmail', () => {
    const result = executeDomainKeyword('internet.exampleEmail', { faker, args: [] });
    console.log('internet.exampleEmail', result);
    expectMeaningfulString(result);
  });

  test('executes internet.httpMethod', () => {
    const result = executeDomainKeyword('internet.httpMethod', { faker, args: [] });
    console.log('internet.httpMethod', result);
    expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']).toContain(result);
  });

  test('executes internet.httpStatusCode', () => {
    const result = executeDomainKeyword('internet.httpStatusCode', { faker, args: [] });
    console.log('internet.httpStatusCode', result);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(599);
  });

  test('executes internet.ip', () => {
    const result = executeDomainKeyword('internet.ip', { faker, args: [] });
    console.log('internet.ip', result);
    expectMeaningfulString(result);
  });

  test('executes internet.ipv4', () => {
    const result = executeDomainKeyword('internet.ipv4', { faker, args: [] });
    console.log('internet.ipv4', result);
    expect(result).toMatch(/^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/);
  });

  test('executes internet.ipv6', () => {
    const result = executeDomainKeyword('internet.ipv6', { faker, args: [] });
    console.log('internet.ipv6', result);
    expectMeaningfulString(result);
  });

  test('executes internet.jwt', () => {
    const result = executeDomainKeyword('internet.jwt', { faker, args: [] });
    console.log('internet.jwt', result);
    expectMeaningfulString(result);
  });

  test('executes internet.jwtAlgorithm', () => {
    const result = executeDomainKeyword('internet.jwtAlgorithm', { faker, args: [] });
    console.log('internet.jwtAlgorithm', result);
    expectMeaningfulString(result);
  });

  test('executes internet.mac', () => {
    const result = executeDomainKeyword('internet.mac', { faker, args: [] });
    console.log('internet.mac', result);
    expectMeaningfulString(result);
  });

  test('executes internet.password', () => {
    const result = executeDomainKeyword('internet.password', { faker, args: [] });
    console.log('internet.password', result);
    expectMeaningfulString(result);
  });

  test('executes internet.port', () => {
    const result = executeDomainKeyword('internet.port', { faker, args: [] });
    console.log('internet.port', result);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(65535);
  });

  test('executes internet.protocol', () => {
    const result = executeDomainKeyword('internet.protocol', { faker, args: [] });
    console.log('internet.protocol', result);
    expectMeaningfulString(result);
  });

  test('executes internet.url', () => {
    const result = executeDomainKeyword('internet.url', { faker, args: [] });
    console.log('internet.url', result);
    expect(result).toMatch(/^https?:\/\//);
  });

  test('executes internet.userAgent', () => {
    const result = executeDomainKeyword('internet.userAgent', { faker, args: [] });
    console.log('internet.userAgent', result);
    expectMeaningfulString(result);
  });

  test('executes internet.username', () => {
    const result = executeDomainKeyword('internet.username', { faker, args: [] });
    console.log('internet.username', result);
    expectMeaningfulString(result);
  });

  test('executes internet.userName', () => {
    const result = executeDomainKeyword('internet.userName', { faker, args: [] });
    console.log('internet.userName', result);
    expectMeaningfulString(result);
  });
});
