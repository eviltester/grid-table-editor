import { TestDataRulesCompiler } from '../../packages/core/js/data_generation/testDataRulesCompiler.js';
import { EnumTestDataGenerator } from '../../packages/core/js/data_generation/enum/enumTestDataGenerator.js';
import { TestDataRule } from '../../packages/core/js/data_generation/testDataRule.js';

describe('User Reported Bug - HTTP Method enum(GET,POST,PUT,DELETE)', () => {
  test('reproduces and verifies fix for the exact user issue', () => {
    // Reproduce the exact user example that was failing
    const rule = new TestDataRule('HTTP Method', 'enum(GET,POST,PUT,DELETE)');

    // Test the compilation process
    const compiler = new TestDataRulesCompiler();
    compiler.compile([rule]);

    // Should be detected as enum type
    expect(rule.type).toBe('enum');

    // Should validate successfully
    compiler.validate();
    expect(compiler.isValid()).toBe(true);

    // Should generate valid data (not "**ERROR**")
    const generator = new EnumTestDataGenerator();
    const result = generator.generateFrom(rule);

    // Verify result is not an error
    expect(result.isError).toBe(false);
    expect(result.errorMessage).toBeFalsy(); // Should be undefined or empty

    // Verify generated data is one of the expected values
    expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(result.data);
    expect(result.data).not.toBe('**ERROR**');
    expect(typeof result.data).toBe('string');
    expect(result.data.length).toBeGreaterThan(0);

    // Test multiple generations to ensure consistency
    for (let i = 0; i < 10; i++) {
      const testResult = generator.generateFrom(rule);
      expect(testResult.isError).toBe(false);
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(testResult.data);
    }
  });
});
