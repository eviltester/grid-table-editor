import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

function runWithSeed(seed, keyword, args) {
  faker.seed(seed);
  return executeDomainKeyword(keyword, { faker, args });
}

describe('string domain keyword execution', () => {
  test('executes string.alpha', () => {
    const result = runWithSeed(1001, 'string.alpha', []);
    expectMeaningfulString(result);
  });

  test('string.alpha length, casing, and exclude args affect output', () => {
    const lengthResult = runWithSeed(1002, 'string.alpha', [8]);
    expect(lengthResult).toHaveLength(8);

    const lower = runWithSeed(1003, 'string.alpha', [6, 'lower']);
    expect(lower).toMatch(/^[a-z]+$/);

    const upper = runWithSeed(1003, 'string.alpha', [6, 'upper']);
    expect(upper).toMatch(/^[A-Z]+$/);
    expect(lower).not.toBe(upper);

    const excluded = runWithSeed(1004, 'string.alpha', [12, undefined, ['a', 'b', 'c']]);
    expect(excluded).not.toMatch(/[abc]/);
  });

  test('executes string.alphanumeric', () => {
    const result = runWithSeed(1010, 'string.alphanumeric', []);
    expectMeaningfulString(result);
  });

  test('string.alphanumeric length, casing, and exclude args affect output', () => {
    const lengthResult = runWithSeed(1011, 'string.alphanumeric', [9]);
    expect(lengthResult).toHaveLength(9);

    const lower = runWithSeed(1012, 'string.alphanumeric', [8, 'lower']);
    expect(lower).toMatch(/^[a-z0-9]+$/);

    const upper = runWithSeed(1012, 'string.alphanumeric', [8, 'upper']);
    expect(upper).toMatch(/^[A-Z0-9]+$/);
    expect(lower).not.toBe(upper);

    const excluded = runWithSeed(1013, 'string.alphanumeric', [20, undefined, ['a', '1']]);
    expect(excluded).not.toContain('a');
    expect(excluded).not.toContain('1');
  });

  test('executes string.binary', () => {
    const result = runWithSeed(1020, 'string.binary', []);
    expectMeaningfulString(result);
  });

  test('string.binary length and prefix args affect output', () => {
    const lengthResult = runWithSeed(1021, 'string.binary', [10]);
    expect(lengthResult).toMatch(/^0b[01]+$/);
    expect(lengthResult.slice(2)).toHaveLength(10);

    const prefixed = runWithSeed(1022, 'string.binary', [6, '#']);
    expect(prefixed).toMatch(/^#[01]+$/);
    expect(prefixed.slice(1)).toHaveLength(6);
  });

  test('executes string.fromCharacters', () => {
    const result = runWithSeed(1030, 'string.fromCharacters', [['a']]);
    expectMeaningfulString(result);
  });

  test('string.fromCharacters supports string/array characters and length', () => {
    const fromString = runWithSeed(1031, 'string.fromCharacters', ['abc', 12]);
    expect(fromString).toHaveLength(12);
    expect(fromString).toMatch(/^[abc]+$/);

    const fromArray = runWithSeed(1032, 'string.fromCharacters', [['x', 'y'], 10]);
    expect(fromArray).toHaveLength(10);
    expect(fromArray).toMatch(/^[xy]+$/);
  });

  test('executes string.hexadecimal', () => {
    const result = runWithSeed(1040, 'string.hexadecimal', []);
    expectMeaningfulString(result);
  });

  test('string.hexadecimal casing, length, and prefix args affect output', () => {
    const lower = runWithSeed(1041, 'string.hexadecimal', ['lower', 8]);
    expect(lower).toMatch(/^0x[0-9a-f]+$/);
    expect(lower.slice(2)).toHaveLength(8);

    const upper = runWithSeed(1041, 'string.hexadecimal', ['upper', 8]);
    expect(upper).toMatch(/^0x[0-9A-F]+$/);
    expect(lower).not.toBe(upper);

    const prefixed = runWithSeed(1042, 'string.hexadecimal', ['lower', 6, '#']);
    expect(prefixed).toMatch(/^#[0-9a-f]+$/);
    expect(prefixed.slice(1)).toHaveLength(6);
  });

  test('executes string.nanoid', () => {
    const result = runWithSeed(1050, 'string.nanoid', []);
    expectMeaningfulString(result);
  });

  test('string.nanoid length arg affects output', () => {
    const result = runWithSeed(1051, 'string.nanoid', [10]);
    expect(result).toHaveLength(10);
  });

  test('executes string.numeric', () => {
    const result = runWithSeed(1060, 'string.numeric', []);
    expectMeaningfulString(result);
  });

  test('string.numeric length, allowLeadingZeros, and exclude args affect output', () => {
    const lengthResult = runWithSeed(1061, 'string.numeric', [7]);
    expect(lengthResult).toMatch(/^\d+$/);
    expect(lengthResult).toHaveLength(7);

    const noLeadingZeros = runWithSeed(1062, 'string.numeric', [12, false]);
    expect(noLeadingZeros[0]).not.toBe('0');

    const allowLeadingZeros = runWithSeed(1062, 'string.numeric', [12, true]);
    expect(allowLeadingZeros).toMatch(/^\d+$/);
    expect(noLeadingZeros).not.toBe(allowLeadingZeros);

    const excluded = runWithSeed(1063, 'string.numeric', [20, true, ['0']]);
    expect(excluded).not.toContain('0');
  });

  test('executes string.octal', () => {
    const result = runWithSeed(1070, 'string.octal', []);
    expectMeaningfulString(result);
  });

  test('string.octal length and prefix args affect output', () => {
    const lengthResult = runWithSeed(1071, 'string.octal', [9]);
    expect(lengthResult).toMatch(/^0o[0-7]+$/);
    expect(lengthResult.slice(2)).toHaveLength(9);

    const prefixed = runWithSeed(1072, 'string.octal', [5, '#']);
    expect(prefixed).toMatch(/^#[0-7]+$/);
    expect(prefixed.slice(1)).toHaveLength(5);
  });

  test('executes string.sample', () => {
    const result = runWithSeed(1080, 'string.sample', []);
    expectMeaningfulString(result);
  });

  test('string.sample length arg affects output', () => {
    const result = runWithSeed(1081, 'string.sample', [10]);
    expect(result).toHaveLength(10);
  });

  test('executes string.symbol', () => {
    const result = runWithSeed(1090, 'string.symbol', []);
    expectMeaningfulString(result);
  });

  test('string.symbol length arg affects output', () => {
    const result = runWithSeed(1091, 'string.symbol', [6]);
    expect(result).toHaveLength(6);
  });

  test('executes string.ulid', () => {
    const result = runWithSeed(1100, 'string.ulid', []);
    expectMeaningfulString(result);
  });

  test('string.ulid refDate arg affects timestamp prefix', () => {
    const ulidA = runWithSeed(1101, 'string.ulid', [1]);
    const ulidB = runWithSeed(1101, 'string.ulid', [2]);
    expect(ulidA).not.toBe(ulidB);
    expect(ulidA.slice(0, 10)).not.toBe(ulidB.slice(0, 10));
  });

  test('executes string.uuid', () => {
    const result = runWithSeed(1110, 'string.uuid', []);
    expectMeaningfulString(result);
  });

  test('string.uuid accepts documented version and refDate args', () => {
    const uuidV4 = runWithSeed(1111, 'string.uuid', [4]);
    const uuidV7A = runWithSeed(1111, 'string.uuid', [7, 1]);
    const uuidV7B = runWithSeed(1111, 'string.uuid', [7, 2]);

    expect(uuidV4).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(uuidV7A).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(uuidV7B).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(uuidV7A).not.toBe(uuidV7B);
  });
});
