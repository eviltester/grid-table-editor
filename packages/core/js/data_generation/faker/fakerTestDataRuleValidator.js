import { FakerCommand } from './fakerCommand.js';
import { extractFakerCommandCandidate, isKnownFakerCommand } from '../../faker/faker-commands.js';

// requires faker.js which should be passed in via constructor
// faker can be imported in different ways

//  https://fakerjs.dev/guide/#environments
// https://cdn.skypack.dev/@faker-js/faker

// use a moduleNameMapper in jest to allow importing from https
// see package.json for the jest config
//import { faker } from '@faker-js/faker';
//import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v9.7.0";

class FakerTestDataRuleValidator {
  constructor(aFaker, options = {}) {
    this.validationError = '';
    this.faker = aFaker;
    this.options = options;
    this.lastParsed = null;
  }

  recordLastParsed(ruleSpec, error = '') {
    const command = extractFakerCommandCandidate(ruleSpec);
    this.lastParsed = {
      command,
      recognized: isKnownFakerCommand(command),
      error: String(error || ''),
    };
  }

  setValidationError(error) {
    this.validationError = String(error || '');
    if (this.lastParsed) {
      this.lastParsed.error = this.validationError;
    }
  }

  validate(aTestDataRule) {
    this.validationError = '';
    this.lastParsed = null;
    const ruleSpec = String(aTestDataRule?.ruleSpec || '');
    this.recordLastParsed(ruleSpec);

    // is it a faker function?
    try {
      const fakerCommand = new FakerCommand(ruleSpec, this.options);
      fakerCommand.parse();
      fakerCommand.compile(this.faker);
      const whatDidWeGet = fakerCommand.validate(this.faker);

      if (whatDidWeGet !== undefined && whatDidWeGet !== null && whatDidWeGet.isError === false) {
        aTestDataRule.type = 'faker';
        aTestDataRule.fakerCommand = fakerCommand.fakerFunctionName;
        this.recordLastParsed(fakerCommand.fakerFunctionName);
        return true;
      } else {
        this.setValidationError(whatDidWeGet?.errorMessage);
        return false;
      }
    } catch (err) {
      this.setValidationError(err);
      return false;
    }
  }

  isValid() {
    return this.validationError.length == 0;
  }

  getValidationError() {
    return this.validationError;
  }
}

export { FakerTestDataRuleValidator };
