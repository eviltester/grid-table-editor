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

  test('parses quoted, boolean, null and number args', () => {
    const parsedKeyword = parseKeywordInvocation('example.fn("value", true, null, 2.5)');
    expect(parsedKeyword.keyword).toBe('example.fn');
    expect(parsedKeyword.args).toEqual(['value', true, null, 2.5]);
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.fn']);
  });

  test('parses array args', () => {
    const parsedKeyword = parseKeywordInvocation('example.list([1,2,"three"])');
    expect(parsedKeyword.keyword).toBe('example.list');
    expect(parsedKeyword.args).toEqual([[1, 2, 'three']]);
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.list']);
  });

  test('returns error for missing closing parenthesis', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,10');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword invocation: missing closing parenthesis']);
  });

  test('returns error for missing opening parenthesis', () => {
    const parsedKeyword = parseKeywordInvocation('number.int1,10)');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword invocation: missing opening parenthesis']);
  });

  test('returns error for missing argument after comma', () => {
    const parsedKeyword = parseKeywordInvocation('number.int(1,)');
    expect(parsedKeyword.errors).toEqual(['Invalid keyword arguments: missing argument after comma']);
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

  test('returns unknown keyword for unknown keyword with named args', () => {
    const parsedKeyword = parseKeywordInvocation('example.fn(min=1)');
    expect(parsedKeyword.errors).toEqual(['Unknown keyword: example.fn']);
  });
});
