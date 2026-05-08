import { runFakerCommandSafely } from '../../../../../js/data_generation/faker/saferFakerCommandRunner.js';
import { faker } from '@faker-js/faker';

describe('SaferFakerCommandRunner', () => {
  test('should handle command without arguments', () => {
    const result = runFakerCommandSafely('person.firstName', null, faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('should handle command with empty parentheses', () => {
    const result = runFakerCommandSafely('person.firstName', '()', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('should handle command with simple numeric argument', () => {
    const result = runFakerCommandSafely('string.alpha', '(5)', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBe(5);
  });

  test('should handle command with object argument safely', () => {
    const result = runFakerCommandSafely('number.int', '({"min": 18, "max": 65})', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('number');
    expect(result.data).toBeGreaterThanOrEqual(18);
    expect(result.data).toBeLessThanOrEqual(65);
  });

  test('should handle command with array argument', () => {
    const result = runFakerCommandSafely('helpers.arrayElement', '(["red", "green", "blue"])', faker);

    expect(result.isError).toBe(false);
    expect(['red', 'green', 'blue']).toContain(result.data);
  });

  test('should handle command with multiple arguments', () => {
    const result = runFakerCommandSafely('number.int', '({"min": 1, "max": 100})', faker);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('number');
    expect(result.data).toBeGreaterThanOrEqual(1);
    expect(result.data).toBeLessThanOrEqual(100);
  });

  test('should reject potentially unsafe syntax', () => {
    // This should fail safely instead of executing dangerous code
    const result = runFakerCommandSafely('person.firstName', '(() => process.exit(1))', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toContain('Cannot safely parse arguments');
  });

  test('should handle non-existent functions', () => {
    const result = runFakerCommandSafely('nonexistent.function', '()', faker);

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toContain('Could not find function');
  });

  test('should handle property accessors', () => {
    const result = runFakerCommandSafely('airline.airplane', '()', faker, ['name']);

    expect(result.isError).toBe(false);
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);
  });
});
