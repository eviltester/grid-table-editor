import { runFakerCommand } from '../../../../../js/data_generation/faker/fakerCommandRunner.js';
import { faker } from '@faker-js/faker';

describe('Hybrid Faker Command Runner', () => {
  test('should use safe method for simple object arguments', () => {
    const result = runFakerCommand('number.int', '({"min": 18, "max": 65})', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('number');
    expect(result.data).toBeGreaterThanOrEqual(18);
    expect(result.data).toBeLessThanOrEqual(65);
  });

  test('should use safe method for js-style object literal arguments', () => {
    const result = runFakerCommand('helpers.mustache', '("{{name}}", { name: "Ada" })', faker);

    expect(result.isError).toBe(false);
    expect(result.data).toBe('Ada');
  });

  test('should use safe method for array arguments', () => {
    const result = runFakerCommand('helpers.arrayElement', '(["red", "green", "blue"])', faker);

    expect(result.isError).toBe(false);
    expect(['red', 'green', 'blue']).toContain(result.data);
  });

  test('should report malformed array helper params with an array example', () => {
    const result = runFakerCommand('helpers.arrayElement', '(["red", "green")', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toBe(
      'helpers.arrayElement requires an array argument, e.g. helpers.arrayElement(["A", "B", "C"]).'
    );
  });

  test('should report non-array array helper params with an array example', () => {
    const result = runFakerCommand('helpers.arrayElement', '("red")', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toBe(
      'helpers.arrayElement requires an array argument, e.g. helpers.arrayElement(["A", "B", "C"]).'
    );
  });

  test('should use safe method for simple string arguments', () => {
    const result = runFakerCommand('string.alpha', '(5)', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBe(5);
  });

  test('should use safe method for no arguments', () => {
    const result = runFakerCommand('person.firstName', null, faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('should fall back to Function for complex expressions with this references', () => {
    // This has to use fallback because of the `this.` reference which can't be parsed by JSON
    const result = runFakerCommand('helpers.multiple', '(() => this.person.firstName())', faker, [], {
      unsafeFakerExpressions: true,
    });

    expect(result.isError).toBe(false);
    expect(Array.isArray(result.data)).toBe(true);
  });

  test('should fall back to Function for arrow functions', () => {
    // This needs fallback due to arrow function syntax
    const result = runFakerCommand('helpers.maybe', '(() => "Hello World!", { probability: 0.9 })', faker, [], {
      unsafeFakerExpressions: true,
    });

    expect(result.isError).toBe(false);
    // Result should be either "Hello World!" or undefined
    expect(result.data === 'Hello World!' || result.data === undefined).toBe(true);
  });

  test('should block dangerous patterns even in fallback', () => {
    const result = runFakerCommand('person.firstName', '(require("fs"))', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toContain('Security:');
  });

  test('should block process access even in fallback', () => {
    const result = runFakerCommand('person.firstName', '(process.exit(1))', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toContain('Security');
  });

  test('should block forbidden helper commands even with simple literal args', () => {
    const result = runFakerCommand('helpers.objectKey', '({"red":"#f00"})', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toContain('Forbidden faker command');
  });

  test('should handle property accessors with safe method', () => {
    const result = runFakerCommand('airline.airplane', '()', faker, ['name']);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });
});
