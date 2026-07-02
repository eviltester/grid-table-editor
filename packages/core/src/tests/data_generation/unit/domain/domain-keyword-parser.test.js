import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

describe('domain keyword parser', () => {
  test('parses number.int(1,10) into keyword and args array', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,10)');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.args).toEqual([1, 10]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('parses invocation with no args', () => {
    const parsedKeyword = parseKeywordInvocation('internet.email');
    expect(parsedKeyword.keyword).toBe('internet.email');
    expect(parsedKeyword.args).toEqual([]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('parses quoted string args', () => {
    const parsedKeyword = parseKeywordInvocation('literal.value("Pending")');
    expect(parsedKeyword.keyword).toBe('literal.value');
    expect(parsedKeyword.args).toEqual(['Pending']);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('returns error for bareword arg values', () => {
    const parsedKeyword = parseKeywordInvocation('literal.value(Pending)');
    expect(parsedKeyword.errors).toEqual([
      'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    ]);
  });

  test('parses quoted, boolean and number args', () => {
    const parsedKeyword = parseKeywordInvocation('example.fn("value", true, 2.5)');
    expect(parsedKeyword.keyword).toBe('example.fn');
    expect(parsedKeyword.args).toEqual(['value', true, 2.5]);
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.fn']);
  });

  test('returns syntax error for null literal argument', () => {
    const parsedKeyword = parseKeywordInvocation('literal.value(null)');
    expect(parsedKeyword.errors).toEqual([
      'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    ]);
  });

  test('parses array args', () => {
    const parsedKeyword = parseKeywordInvocation('example.list([1,2,"three"])');
    expect(parsedKeyword.keyword).toBe('example.list');
    expect(parsedKeyword.args).toEqual([[1, 2, 'three']]);
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.list']);
  });

  test('returns error for missing closing parenthesis', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,10');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword invocation: missing closing parenthesis']);
  });

  test('returns error for missing opening parenthesis', () => {
    const parsedKeyword = parseKeywordInvocation('number.int1,10)');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword invocation: missing opening parenthesis']);
  });

  test('returns error for missing argument after comma', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,)');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: missing argument after comma']);
  });

  test('preserves recognized keyword prefix on malformed invocation syntax', () => {
    const parsedKeyword = parseKeywordInvocation('internet.httpMethod(commonOnly=true');
    expect(parsedKeyword.keyword).toBe('internet.httpMethod');
    expect(parsedKeyword.args).toEqual([]);
    expect(parsedKeyword.errors).toEqual(['Invalid keyword invocation: missing closing parenthesis']);
  });

  test('parses named args and maps to schema order', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(min=1,max=2)');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.args).toEqual([1, 2]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('parses named args with surrounding spaces', () => {
    const parsedKeyword = parseKeywordInvocation('number.int( min= 1,max = 2 )');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.args).toEqual([1, 2]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('rejects lorem.word params that Faker does not implement', () => {
    const parsedKeyword = parseKeywordInvocation('lorem.word(min=2, max=67)');
    expect(parsedKeyword.keyword).toBe('lorem.word');
    expect(parsedKeyword.args).toEqual([]);
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: unknown named argument "min"']);
  });

  test('parses named args with broader spacing combinations', () => {
    const first = parseKeywordInvocation('number.int(min =1, max=2)');
    expect(first.keyword).toBe('number.int');
    expect(first.args).toEqual([1, 2]);
    expect(first.errors).toEqual([]);

    const second = parseKeywordInvocation('number.int( min = 1 , max = 2 )');
    expect(second.keyword).toBe('number.int');
    expect(second.args).toEqual([1, 2]);
    expect(second.errors).toEqual([]);
  });

  test('parses mixed positional then named args', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,max=2)');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.args).toEqual([1, 2]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('parses single object arg as named options for options-based domain keywords', () => {
    const parsedKeyword = parseKeywordInvocation('number.int({"min":18,"max":65})');
    expect(parsedKeyword.keyword).toBe('number.int');
    expect(parsedKeyword.args).toEqual([18, 65, undefined]);
    expect(parsedKeyword.errors).toEqual([]);
  });

  test('returns error when positional arg appears after named arg', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(min=1,2)');
    expect(parsedKeyword.errors).toEqual([
      'Invalid keyword arguments: positional arguments must come before named arguments',
    ]);
  });

  test('returns error for unknown named arg', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(min=1,unknown=2)');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: unknown named argument "unknown"']);
  });

  test('returns error when named arg duplicates positional slot', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,min=2)');
    expect(parsedKeyword.errors).toEqual([
      'Invalid keyword arguments: argument "min" is already set by positional value',
    ]);
  });

  test('returns error for too many positional args in positional-only invocation', () => {
    const parsedKeyword = parseKeywordInvocation('number.binary(1,2,3)');
    expect(parsedKeyword.errors).toEqual([
      'Invalid keyword arguments: too many positional arguments. Expected at most 2, received 3',
    ]);
  });

  test('returns unknown keyword for unknown keyword with named args', () => {
    const parsedKeyword = parseKeywordInvocation('example.fn(min=1)');
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.fn']);
  });

  test('returns error for unsafe object key "__proto__"', () => {
    const parsedKeyword = parseKeywordInvocation('number.int({"__proto__":{"polluted":true}})');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: unsafe object key "__proto__" is not allowed']);
  });

  test('returns error for unsafe object key "constructor"', () => {
    const parsedKeyword = parseKeywordInvocation('number.int({"constructor":{"prototype":{"polluted":true}}})');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: unsafe object key "constructor" is not allowed']);
  });

  test('returns error for unsafe object key "prototype"', () => {
    const parsedKeyword = parseKeywordInvocation('number.int({prototype:1})');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: unsafe object key "prototype" is not allowed']);
  });
});
