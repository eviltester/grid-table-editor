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

  test.each(['person.notACommand()', 'person.notACommand'])(
    'rejects unknown command-like input %s instead of falling through to regex',
    (ruleSpec) => {
      const compiler = new TestDataRulesCompiler(faker, RandExp);
      const rules = [{ name: 'Name', type: '', ruleSpec }];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(compiler.errors).toContainEqual(
        expect.objectContaining({
          code: 'compiler_validation_error',
          column: 'Name',
          message: expect.stringContaining('Unknown keyword: person.notACommand'),
        })
      );
    }
  );

  test('keeps non-command regex shorthand as regex', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'Code', type: '', ruleSpec: '[A-Z]{3}' }];

    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[A-Z]{3}' });
    expect(compiler.errors).toEqual([]);
  });

  test('keeps plain non-command text as literal shorthand', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'City', type: '', ruleSpec: 'London' }];

    compiler.compile(rules);

    expect(rules[0]).toMatchObject({ type: 'literal', ruleSpec: 'London' });
  });

  test('honors explicit regex and literal wrappers for command-looking text', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [
      { name: 'Regex', type: '', ruleSpec: 'regex(person.notACommand())' },
      { name: 'Literal', type: '', ruleSpec: 'literal(person.notACommand())' },
    ];

    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: 'person.notACommand()' });
    expect(rules[1]).toMatchObject({ type: 'literal', ruleSpec: 'person.notACommand()' });
    expect(compiler.errors).toEqual([]);
  });
});
