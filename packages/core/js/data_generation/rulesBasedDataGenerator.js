import { FakerTestDataGenerator } from './faker/fakerTestDataGenerator.js';
import { RegexTestDataGenerator } from './regex/regexTestDataGenerator.js';
import { LiteralTestDataGenerator } from './literal/literalTestDataGenerator.js';
import { EnumTestDataGenerator } from './enum/enumTestDataGenerator.js';
import { DomainTestDataGenerator } from './domain/domainTestDataGenerator.js';
import { dataResponse } from './ruleResponse.js';

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

  generateFromRules(thisMany, fromRules) {
    // given some rules
    // generate thisMany instances
    // data is row of values where the first row is the headers
    const data = [];

    const headers = fromRules.map((rule) => rule.name);
    data.push(headers);

    for (var row = 0; row < thisMany; row++) {
      const aRow = this.generateRandomRow(fromRules);
      data.push(aRow);
    }

    return data;
  }

  generateRandomRow(fromRules) {
    const aRow = fromRules.map((rule) => {
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

    return aRow;
  }
}

class DefaultTestDataGenerator {
  constructor() {}

  generateFrom(aRule) {
    return dataResponse(aRule.ruleSpec);
  }
}
