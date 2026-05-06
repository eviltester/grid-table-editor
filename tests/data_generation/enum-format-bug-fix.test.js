import { TestDataRulesCompiler } from '../../packages/core/js/data_generation/testDataRulesCompiler.js';
import { EnumTestDataGenerator } from '../../packages/core/js/data_generation/enum/enumTestDataGenerator.js';
import { TestDataRule } from '../../packages/core/js/data_generation/testDataRule.js';

describe('Enum Format Bug Fix Integration', () => {
  test('unquoted enum() format works in normal data generation', () => {
    // Create a rule with unquoted enum format that was failing before
    const rule = new TestDataRule('HttpMethod', 'enum(GET,POST,PUT,DELETE)');

    // Compile the rule to detect the type
    const compiler = new TestDataRulesCompiler();
    compiler.compile([rule]);

    // Verify it was detected as enum type
    expect(rule.type).toBe('enum');

    // Validate the rule
    compiler.validate();
    expect(compiler.isValid()).toBe(true);
    expect(compiler.validationErrors()).toBe('');

    // Generate data from the rule
    const generator = new EnumTestDataGenerator();
    const result = generator.generateFrom(rule);

    // Verify generation worked and returned valid data
    expect(result.isError).toBe(false);
    expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(result.data);
  });

  test('mixed quoted and unquoted enum() format works', () => {
    const rule = new TestDataRule('ContentType', 'enum("application/json",xml,"text/plain")');

    const compiler = new TestDataRulesCompiler();
    compiler.compile([rule]);

    expect(rule.type).toBe('enum');
    compiler.validate();
    expect(compiler.isValid()).toBe(true);

    const generator = new EnumTestDataGenerator();
    const result = generator.generateFrom(rule);

    expect(result.isError).toBe(false);
    expect(['application/json', 'xml', 'text/plain']).toContain(result.data);
  });

  test('quoted enum() format still works as before', () => {
    const rule = new TestDataRule('Status', 'enum("Active, Running","Inactive, Stopped","Pending, Waiting")');

    const compiler = new TestDataRulesCompiler();
    compiler.compile([rule]);

    expect(rule.type).toBe('enum');
    compiler.validate();
    expect(compiler.isValid()).toBe(true);

    const generator = new EnumTestDataGenerator();
    const result = generator.generateFrom(rule);

    expect(result.isError).toBe(false);
    expect(['Active, Running', 'Inactive, Stopped', 'Pending, Waiting']).toContain(result.data);
  });
});
