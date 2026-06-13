import { RulesParser } from './rulesParser.js';
import { RulesBasedDataGenerator } from './rulesBasedDataGenerator.js';
import { TestDataRulesCompiler } from './testDataRulesCompiler.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';
import { validateConstraintsAgainstRules } from './schema-constraint-validator.js';

/*
    This is the main entry point for data generation.

    Used by the CLI and the Web.

    Given a specification of data via importSpec, the data would
    then be compiled and could then generate.
*/
export class TestDataGenerator {
  constructor(aFaker, aRandExp, options = {}) {
    this.faker = aFaker;
    this.RandExp = aRandExp;
    this.options = options;
    this.rulesParser = new RulesParser(aFaker, aRandExp, options);
    this.generator = new RulesBasedDataGenerator(aFaker, aRandExp, options);
    this.compiler = new TestDataRulesCompiler(aFaker, aRandExp, options);
    this.runtimeErrors = [];
  }

  importSpec(textContent) {
    this.runtimeErrors = [];
    this.rulesParser.parseText(textContent);
  }

  compile() {
    this.runtimeErrors = [];
    // validate and assign rules
    this.compiler.compile(this.rulesParser.testDataRules.rules);
    this.compiler.validate();
    this.compiler.errors.push(
      ...validateConstraintsAgainstRules(
        this.rulesParser.testDataRules.constraints,
        this.rulesParser.testDataRules.rules
      )
    );
  }

  compilationReport() {
    return this.compiler.compilationReport();
  }

  testDataRules() {
    return this.rulesParser.testDataRules.rules;
  }

  isValid() {
    return this.errors().length === 0;
  }

  errors() {
    return this.rulesParser.errors.concat(this.compiler.errors, this.runtimeErrors);
  }

  generate(thisMany) {
    this.runtimeErrors = [];
    const generated = this.generator.generateFromRules(thisMany, this.rulesParser.testDataRules.rules, {
      constraints: this.rulesParser.testDataRules.constraints,
      maxAttempts: 1000,
    });
    if (generated.some((row, index) => index > 0 && row === null)) {
      this.runtimeErrors = [SchemaParsingErrors.constraintGenerationFailed()];
      return [generated[0], ...generated.slice(1).map((row) => row || [])];
    }
    return generated;
  }

  generateHeadersArray() {
    return this.rulesParser.testDataRules.rules.map((rule) => rule.name);
  }

  generateRow() {
    this.runtimeErrors = [];
    const runStartedAt = new Date();
    const generatedRow = this.generator.generateRandomRow(this.rulesParser.testDataRules.rules, {
      constraints: this.rulesParser.testDataRules.constraints,
      maxAttempts: 1000,
      rowIndex: 0,
      runStartedAt,
    });
    if (!generatedRow) {
      this.runtimeErrors = [SchemaParsingErrors.constraintGenerationFailed()];
      return [];
    }
    return generatedRow;
  }

  schemaConstraints() {
    return Array.isArray(this.rulesParser?.testDataRules?.constraints)
      ? this.rulesParser.testDataRules.constraints
      : [];
  }

  generationErrors() {
    return this.runtimeErrors.slice();
  }
}
