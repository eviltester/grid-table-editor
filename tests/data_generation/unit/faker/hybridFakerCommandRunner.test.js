import { runFakerCommand } from '../../../../packages/core/js/data_generation/faker/fakerCommandRunner.js';
import { faker } from '@faker-js/faker';

describe('Hybrid Faker Command Runner', () => {
  test('should use safe method for simple object arguments', () => {
    const result = runFakerCommand('number.int', '({"min": 18, "max": 65})', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('number');
    expect(result.data).toBeGreaterThanOrEqual(18);
    expect(result.data).toBeLessThanOrEqual(65);
  });

  test('should use safe method for array arguments', () => {
    const result = runFakerCommand('helpers.arrayElement', '(["red", "green", "blue"])', faker);

    expect(result.isError).toBe(false);
    expect(['red', 'green', 'blue']).toContain(result.data);
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
    const result = runFakerCommand('helpers.multiple', '(() => this.person.firstName())', faker);

    expect(result.isError).toBe(false);
    expect(Array.isArray(result.data)).toBe(true);
  });

  test('should fall back to Function for arrow functions', () => {
    // This needs fallback due to arrow function syntax
    const result = runFakerCommand('helpers.maybe', '(() => "Hello World!", { probability: 0.9 })', faker);

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

  test('should handle property accessors with safe method', () => {
    const result = runFakerCommand('airline.airplane', '()', faker, ['name']);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });
});
