import { TestDataGenerator } from '../../../js/data_generation/testDataGenerator.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

/*

Acceptance tests to check the faker interface for Test Data Generation.

https://fakerjs.dev/api/

Faker API changes so create some examples here, and also use examples from our docs.

*/

describe('TestDataGenerator handles Faker API', () => {
  describe('TestDataGenerator can parse a block of helper faker rules', () => {
    test('rejects domain-prefixed helper command (domain.helpers.*)', () => {
      const inputText = `Faker\n    domain.helpers.arrayElement(['cat', 'dog'])`;
      const generator = new TestDataGenerator(faker, RandExp);

      generator.importSpec(inputText);
      generator.compile();

      expect(generator.isValid()).toBe(false);
      const messages = generator.errors().map((error) => String(error?.message || error));
      expect(messages.some((message) => message.includes('helpers_not_supported_in_domain'))).toBe(true);
      expect(messages.some((message) => message.includes('helpers.* is faker-only; use faker.helpers.*'))).toBe(true);
    });

    test('rejects canonical domain-prefixed helper command (awd.domain.helpers.*)', () => {
      const inputText = `Faker\n    awd.domain.helpers.arrayElement(['cat', 'dog'])`;
      const generator = new TestDataGenerator(faker, RandExp);

      generator.importSpec(inputText);
      generator.compile();

      expect(generator.isValid()).toBe(false);
      const messages = generator.errors().map((error) => String(error?.message || error));
      expect(messages.some((message) => message.includes('helpers_not_supported_in_domain'))).toBe(true);
      expect(messages.some((message) => message.includes('helpers.* is faker-only; use faker.helpers.*'))).toBe(true);
    });

    test('can parse a helper command into faker rule', () => {
      const inputText = `Faker
    helpers.arrayElement(['cat', 'dog', 'mouse'])`;
      const generator = new TestDataGenerator(faker, RandExp);

      generator.importSpec(inputText);
      generator.compile();

      expect(generator.isValid()).toBe(true);
      expect(generator.testDataRules()[0].name).toBe('Faker');
      expect(generator.testDataRules()[0].type).toBe('faker');
      expect(generator.testDataRules()[0].ruleSpec).toBe("helpers.arrayElement(['cat', 'dog', 'mouse'])");
      if (generator.testDataRules()[0].type === 'faker') {
        expect(generator.testDataRules()[0].fakerCommand).toBe('helpers.arrayElement');
      }
      expect(generator.testDataRules().length).toBe(1);
    });

    test('adding faker at the start is optional when parsing a faker command into faker rule', () => {
      const inputText = `Faker
    faker.helpers.arrayElement(['cat', 'dog', 'mouse'])`;
      const generator = new TestDataGenerator(faker, RandExp);

      generator.importSpec(inputText);
      generator.compile();

      expect(generator.isValid()).toBe(true);
      expect(generator.testDataRules()[0].name).toBe('Faker');
      expect(generator.testDataRules()[0].type).toBe('faker');
      expect(generator.testDataRules()[0].ruleSpec).toBe("faker.helpers.arrayElement(['cat', 'dog', 'mouse'])");
      expect(generator.testDataRules()[0].fakerCommand).toBe('helpers.arrayElement');
      expect(generator.testDataRules().length).toBe(1);
    });

    test('can parse a helper.fake command into faker rule', () => {
      const inputText = `Faker
    helpers.fake('Hi, my name is {{person.firstName}} {{person.lastName}}!')`;
      const generator = new TestDataGenerator(faker, RandExp);

      generator.importSpec(inputText);
      generator.compile();

      //console.log(generator.compilationReport())

      expect(generator.isValid()).toBe(true);
      expect(generator.testDataRules()[0].name).toBe('Faker');
      expect(generator.testDataRules()[0].type).toBe('faker');
      expect(generator.testDataRules()[0].ruleSpec).toBe(
        "helpers.fake('Hi, my name is {{person.firstName}} {{person.lastName}}!')"
      );
      if (generator.testDataRules()[0].type === 'faker') {
        expect(generator.testDataRules()[0].fakerCommand).toBe('helpers.fake');
      }
      expect(generator.testDataRules().length).toBe(1);
    });

    test('can parse a helper.mustache command into faker rule', () => {
      const inputText = `Sentence
helpers.mustache('I found {{count}} instances of "{{word}}".', {count: () => \`\${this.number.int()}\`,word: "this word",})`;

      console.log(inputText);

      const generator = new TestDataGenerator(faker, RandExp, { unsafeFakerExpressions: true });

      generator.importSpec(inputText);
      generator.compile();

      //console.log(generator.compilationReport())

      expect(generator.isValid()).toBe(true);
      expect(generator.testDataRules()[0].name).toBe('Sentence');
      expect(generator.testDataRules()[0].type).toBe('faker');
      expect(generator.testDataRules()[0].ruleSpec).toBe(
        `helpers.mustache('I found {{count}} instances of "{{word}}".', {count: () => \`\${this.number.int()}\`,word: "this word",})`
      );
      expect(generator.testDataRules()[0].fakerCommand).toBe('helpers.mustache');
      expect(generator.testDataRules().length).toBe(1);

      //console.log(generator.generate(3));
    });

    it.each([
      // most examples taken from faker api documentation
      // https://fakerjs.dev/api/helpers.html
      // any references to faker need to become this e.g. in multiple and mustache
      `helpers.arrayElement(['cat', 'dog', 'mouse'])`,
      `faker.helpers.arrayElements(['cat', 'dog', 'mouse'])`, // returns an array so might not be much use
      `helpers.arrayElements(['cat', 'dog', 'mouse'])`,
      `helpers.fake('Hi, my name is {{person.firstName}} {{person.lastName}}!')`,
      `helpers.fromRegExp('[a-d0-6]{2,8}')`,
      `helpers.fromRegExp(/bee+p/)`,
      `helpers.maybe(() => 'Hello World!', { probability: 0.9 }) ?? "default"`,
      `helpers.multiple(() => this.person.firstName())`, // returns an array so might not be much use
      `helpers.mustache('I found {{count}} instances of "{{word}}".', {count: () => \`\${this.number.int()}\`,word: "this word",})`,
      `helpers.mustache('{{ex}}, A {{adj}} {{noun}}.', {ex: \`\${this.word.interjection()}\`, adj: \`\${this.word.adjective()}\`, noun: \`\${this.word.noun()}\`})`,
      `helpers.rangeToNumber({ min: 1, max: 10 })`,
      `helpers.replaceCreditCardSymbols()`,
      `helpers.replaceCreditCardSymbols('1234-[4-9]-##!!-L')`,
      `helpers.replaceSymbols('Your pin is: #?*#?*')`, // 'Your pin is: 0T85L1'
      `helpers.shuffle(['a', 'b', 'c'], { inplace: true })`,
      `helpers.slugify("Hello world!")`,
      `helpers.uniqueArray(this.word.sample, 3)`,
      // 'sunny', 50% of the time, 'rainy' 40% of the time, 'snowy' 10% of the time
      `helpers.weightedArrayElement([{ weight: 5, value: 'sunny' }, { weight: 4, value: 'rainy' }, { weight: 1, value: 'snowy' }])`,
    ])('should be a valid helper faker rule [%s]', (helperLine) => {
      const inputText = 'Result\n' + helperLine;

      //console.log(inputText);

      const generator = new TestDataGenerator(faker, RandExp, { unsafeFakerExpressions: true });

      generator.importSpec(inputText);
      generator.compile();

      // console.log(generator.compilationReport())

      expect(generator.isValid()).toBe(true);
      expect(generator.testDataRules()[0].name).toBe('Result');
      expect(['domain', 'faker']).toContain(generator.testDataRules()[0].type);
      expect(generator.testDataRules()[0].ruleSpec).toBe(helperLine);
      expect(generator.testDataRules().length).toBe(1);

      //console.log(generator.generate(3));
    });
  });
});
