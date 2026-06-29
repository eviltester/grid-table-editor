import { FakerCommand } from './fakerCommand.js';
import {
  extractFakerCommandCandidate,
  isForbiddenFakerCommand,
  isSupportedFakerRuleCommand,
} from '../../faker/faker-commands.js';

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
      recognized: isSupportedFakerRuleCommand(command),
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
    const commandCandidate = this.lastParsed?.command || '';

    if (isForbiddenFakerCommand(commandCandidate)) {
      this.setValidationError(
        `Forbidden faker command: ${commandCandidate}. This command is known but not allowed through the API.`
      );
      return false;
    }

    if (!isSupportedFakerRuleCommand(commandCandidate)) {
      this.setValidationError(
        `Unknown faker command: ${commandCandidate}. Use a supported domain command or faker helper.`
      );
      return false;
    }

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
    return this.validationError.length === 0;
  }

  getValidationError() {
    return this.validationError;
  }
}

export { FakerTestDataRuleValidator };
