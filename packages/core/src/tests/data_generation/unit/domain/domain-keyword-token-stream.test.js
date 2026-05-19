import { DomainKeywordTokenStream } from '../../../../../js/domain/parser/DomainKeywordTokenStream.js';

describe('DomainKeywordTokenStream', () => {
  test('match returns false for empty token streams without throwing', () => {
    const stream = new DomainKeywordTokenStream([]);
    expect(() => stream.match('identifier')).not.toThrow();
    expect(stream.match('identifier')).toBe(false);
  });
});
