import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

describe('internet.httpMethod domain keyword execution', () => {
  test('routes execution through the domain keyword interface', () => {
    const result = executeDomainKeyword('internet.httpMethod', { faker, args: [] });
    expect(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'TRACE', 'CONNECT']).toContain(result);
  });

  test('supports named parameters through the parser and execution interface', () => {
    const parsed = parseKeywordInvocation('internet.httpMethod(commonOnly=true, excludes="head, delete")');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(['GET', 'POST', 'PUT']).toContain(result);
  });

  test('surfaces helper validation errors through the execution interface', () => {
    expect(() =>
      executeDomainKeyword('internet.httpMethod', {
        faker,
        args: [true, 'get, head, post, put, delete'],
      })
    ).toThrow('Invalid argument for excludes: no HTTP methods remain after exclusions.');
  });
});
