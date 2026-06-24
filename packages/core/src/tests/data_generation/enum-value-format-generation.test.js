import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { DomainTestDataGenerator } from '../../../js/data_generation/domain/domainTestDataGenerator.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';

function compileAndGenerate(ruleSpec, expectedCanonicalRuleSpec, expectedValues) {
  const rule = new TestDataRule('EnumValue', ruleSpec);
  const compiler = new TestDataRulesCompiler();

  compiler.compile([rule]);
  compiler.validate();

  expect(rule.type).toBe('domain');
  expect(rule.ruleSpec).toBe(expectedCanonicalRuleSpec);
  expect(compiler.isValid()).toBe(true);
  expect(compiler.validationErrors()).toBe('');

  const generator = new DomainTestDataGenerator();
  const result = generator.generateFrom(rule);

  expect(result.isError).toBe(false);
  expect(expectedValues).toContain(result.data);
}

describe('enum value format generation', () => {
  test('normalizes and generates unquoted enum function values', () => {
    compileAndGenerate('enum(GET,POST,PUT,DELETE)', 'datatype.enum("GET", "POST", "PUT", "DELETE")', [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ]);
  });

  test('normalizes and generates mixed quoted and unquoted enum function values', () => {
    compileAndGenerate(
      'enum("application/json",xml,"text/plain")',
      'datatype.enum("application/json", "xml", "text/plain")',
      ['application/json', 'xml', 'text/plain']
    );
  });

  test('normalizes and generates quoted enum values that contain commas', () => {
    compileAndGenerate(
      'enum("Active, Running","Inactive, Stopped","Pending, Waiting")',
      'datatype.enum("Active, Running", "Inactive, Stopped", "Pending, Waiting")',
      ['Active, Running', 'Inactive, Stopped', 'Pending, Waiting']
    );
  });
});
