import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('internet domain keyword execution', () => {
  test('executes internet.color', () => {
    const result = executeDomainKeyword('internet.color', { faker, args: [] });
    console.log('internet.color', result);
    assertDomainKeywordResult('internet.color', result);
  });

  test('executes internet.displayName', () => {
    const result = executeDomainKeyword('internet.displayName', { faker, args: [] });
    console.log('internet.displayName', result);
    assertDomainKeywordResult('internet.displayName', result);
  });

  test('executes internet.domainName', () => {
    const result = executeDomainKeyword('internet.domainName', { faker, args: [] });
    console.log('internet.domainName', result);
    assertDomainKeywordResult('internet.domainName', result);
  });

  test('executes internet.domainSuffix', () => {
    const result = executeDomainKeyword('internet.domainSuffix', { faker, args: [] });
    console.log('internet.domainSuffix', result);
    assertDomainKeywordResult('internet.domainSuffix', result);
  });

  test('executes internet.domainWord', () => {
    const result = executeDomainKeyword('internet.domainWord', { faker, args: [] });
    console.log('internet.domainWord', result);
    assertDomainKeywordResult('internet.domainWord', result);
  });

  test('executes internet.email', () => {
    const result = executeDomainKeyword('internet.email', { faker, args: [] });
    console.log('internet.email', result);
    assertDomainKeywordResult('internet.email', result);
  });

  test('executes internet.emoji', () => {
    const result = executeDomainKeyword('internet.emoji', { faker, args: [] });
    console.log('internet.emoji', result);
    assertDomainKeywordResult('internet.emoji', result);
  });

  test('executes internet.exampleEmail', () => {
    const result = executeDomainKeyword('internet.exampleEmail', { faker, args: [] });
    console.log('internet.exampleEmail', result);
    assertDomainKeywordResult('internet.exampleEmail', result);
  });

  test('executes internet.httpMethod', () => {
    const result = executeDomainKeyword('internet.httpMethod', { faker, args: [] });
    console.log('internet.httpMethod', result);
    assertDomainKeywordResult('internet.httpMethod', result);
  });

  test('executes internet.httpStatusCode', () => {
    const result = executeDomainKeyword('internet.httpStatusCode', { faker, args: [] });
    console.log('internet.httpStatusCode', result);
    assertDomainKeywordResult('internet.httpStatusCode', result);
  });

  test('executes internet.ip', () => {
    const result = executeDomainKeyword('internet.ip', { faker, args: [] });
    console.log('internet.ip', result);
    assertDomainKeywordResult('internet.ip', result);
  });

  test('executes internet.ipv4', () => {
    const result = executeDomainKeyword('internet.ipv4', { faker, args: [] });
    console.log('internet.ipv4', result);
    assertDomainKeywordResult('internet.ipv4', result);
  });

  test('executes internet.ipv6', () => {
    const result = executeDomainKeyword('internet.ipv6', { faker, args: [] });
    console.log('internet.ipv6', result);
    assertDomainKeywordResult('internet.ipv6', result);
  });

  test('executes internet.jwt', () => {
    const result = executeDomainKeyword('internet.jwt', { faker, args: [] });
    console.log('internet.jwt', result);
    assertDomainKeywordResult('internet.jwt', result);
  });

  test('executes internet.jwtAlgorithm', () => {
    const result = executeDomainKeyword('internet.jwtAlgorithm', { faker, args: [] });
    console.log('internet.jwtAlgorithm', result);
    assertDomainKeywordResult('internet.jwtAlgorithm', result);
  });

  test('executes internet.mac', () => {
    const result = executeDomainKeyword('internet.mac', { faker, args: [] });
    console.log('internet.mac', result);
    assertDomainKeywordResult('internet.mac', result);
  });

  test('executes internet.password', () => {
    const result = executeDomainKeyword('internet.password', { faker, args: [] });
    console.log('internet.password', result);
    assertDomainKeywordResult('internet.password', result);
  });

  test('executes internet.port', () => {
    const result = executeDomainKeyword('internet.port', { faker, args: [] });
    console.log('internet.port', result);
    assertDomainKeywordResult('internet.port', result);
  });

  test('executes internet.protocol', () => {
    const result = executeDomainKeyword('internet.protocol', { faker, args: [] });
    console.log('internet.protocol', result);
    assertDomainKeywordResult('internet.protocol', result);
  });

  test('executes internet.url', () => {
    const result = executeDomainKeyword('internet.url', { faker, args: [] });
    console.log('internet.url', result);
    assertDomainKeywordResult('internet.url', result);
  });

  test('executes internet.userAgent', () => {
    const result = executeDomainKeyword('internet.userAgent', { faker, args: [] });
    console.log('internet.userAgent', result);
    assertDomainKeywordResult('internet.userAgent', result);
  });

  test('executes internet.username', () => {
    const result = executeDomainKeyword('internet.username', { faker, args: [] });
    console.log('internet.username', result);
    assertDomainKeywordResult('internet.username', result);
  });

  test('executes internet.userName', () => {
    const result = executeDomainKeyword('internet.userName', { faker, args: [] });
    console.log('internet.userName', result);
    assertDomainKeywordResult('internet.userName', result);
  });
});
