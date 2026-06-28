import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';

describe('domain compiler precedence', () => {
  test('classifies domain keyword rules as domain before faker', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'A', type: '', ruleSpec: 'number.int(1,10)' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('domain');
  });

  test('keeps explicitly typed faker rules as faker', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'A', type: 'faker', ruleSpec: 'person.fullName()' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('faker');
  });

  test('keeps recognized domain invocations as domain when param types are invalid', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'Method', type: '', ruleSpec: 'internet.httpMethod(commonOnly="true")' }];

    compiler.compile(rules);
    compiler.validate();

    expect(rules[0].type).toBe('domain');
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Method',
        message: expect.stringContaining('argument "commonOnly" must be boolean, not string'),
      })
    );
  });

  test('keeps malformed recognized domain invocations as domain instead of literal fallback', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'Method', type: '', ruleSpec: 'internet.httpMethod(commonOnly=true' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('domain');
    expect(compiler.errors).toEqual([]);
  });

  test('keeps malformed recognized faker invocations as faker instead of regex fallback', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'Code', type: '', ruleSpec: 'helpers.fromRegExp("("[A-Z]{2}[0-9]{2}")")' }];

    compiler.compile(rules);
    compiler.validate();

    expect(rules[0].type).toBe('faker');
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Code',
        message: expect.stringContaining('Unsafe faker rule syntax detected: requires complex argument parsing'),
      })
    );
  });

  test('rejects deprecated live faker commands that are not registered domain commands', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'Image', type: '', ruleSpec: 'image.urlLoremFlickr()' }];

    compiler.compile(rules);
    compiler.validate();

    expect(rules[0].type).toBe('domain');
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Image',
        message: expect.stringContaining('Unknown keyword: image.urlLoremFlickr'),
      })
    );
  });
});
