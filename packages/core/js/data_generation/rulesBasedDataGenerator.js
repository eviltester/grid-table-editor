import { FakerTestDataGenerator } from './faker/fakerTestDataGenerator.js';
import { RegexTestDataGenerator } from './regex/regexTestDataGenerator.js';
import { LiteralTestDataGenerator } from './literal/literalTestDataGenerator.js';
import { EnumTestDataGenerator } from './enum/enumTestDataGenerator.js';
import { DomainTestDataGenerator } from './domain/domainTestDataGenerator.js';
import { dataResponse } from './ruleResponse.js';
import { evaluateConstraint } from './schema-constraint-evaluator.js';

export class RulesBasedDataGenerator {
  constructor(aFaker, RandExp, options = {}) {
    this.faker = aFaker;
    this.RandExp = RandExp;
    this.options = options;

    this.fakerGenerator = new FakerTestDataGenerator(aFaker, options);
    this.regexGenerator = new RegexTestDataGenerator(RandExp);
    this.literalGenerator = new LiteralTestDataGenerator();
    this.enumGenerator = new EnumTestDataGenerator();
    this.domainGenerator = new DomainTestDataGenerator(aFaker);
    this.defaultGenerator = new DefaultTestDataGenerator();
  }

  generateFromRules(thisMany, fromRules, options = {}) {
    // given some rules
    // generate thisMany instances
    // data is row of values where the first row is the headers
    const data = [];

    const headers = fromRules.map((rule) => rule.name);
    data.push(headers);

    for (var row = 0; row < thisMany; row++) {
      const aRow = this.generateRandomRow(fromRules, options);
      data.push(aRow);
    }

    return data;
  }

  generateRandomRow(fromRules, { constraints = [], maxAttempts = 1 } = {}) {
    const rules = Array.isArray(fromRules) ? fromRules : [];
    const safeConstraints = Array.isArray(constraints) ? constraints : [];
    const committedGeneratorState = this.captureGeneratorStates();

    const createRow = () =>
      rules.map((rule) => {
        var dataGen = '';
        var generator;
        var value;

        switch (rule.type) {
          case 'faker': // is faker?
            generator = this.fakerGenerator;
            break;

          case 'regex':
            generator = this.regexGenerator;
            break;

          case 'literal':
            generator = this.literalGenerator;
            break;

          case 'enum':
            generator = this.enumGenerator;
            break;
          case 'domain':
            generator = this.domainGenerator;
            break;

          default:
            console.warn(`${rule.name} has Unidentified rule type ${rule.type} with spec ${rule.ruleSpec}`);
            generator = this.defaultGenerator;
        }

        value = generator.generateFrom(rule);

        if (value.isError) {
          dataGen = '**ERROR**';
        } else {
          dataGen = value.data;
        }

        return dataGen;
      });

    for (let attempt = 0; attempt < Math.max(1, maxAttempts); attempt += 1) {
      this.restoreGeneratorStates(committedGeneratorState);
      const generatedRow = createRow();
      if (safeConstraints.length === 0) {
        return generatedRow;
      }
      const record = Object.fromEntries(rules.map((rule, index) => [rule.name, generatedRow[index]]));
      const isValid = safeConstraints.every((constraint) => evaluateConstraint(constraint, record));
      if (isValid) {
        return generatedRow;
      }
    }

    this.restoreGeneratorStates(committedGeneratorState);
    return null;
  }

  captureGeneratorStates() {
    return {
      domainGenerator:
        typeof this.domainGenerator?.captureState === 'function' ? this.domainGenerator.captureState() : null,
    };
  }

  resetState() {
    if (typeof this.domainGenerator?.resetState === 'function') {
      this.domainGenerator.resetState();
    }
  }

  restoreGeneratorStates(snapshot = {}) {
    if (typeof this.domainGenerator?.restoreState === 'function') {
      this.domainGenerator.restoreState(snapshot?.domainGenerator || null);
    }
  }
}

class DefaultTestDataGenerator {
  constructor() {}

  generateFrom(aRule) {
    return dataResponse(aRule.ruleSpec);
  }
}
