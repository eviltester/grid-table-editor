import { dataResponse, errorResponse, RuleResponse } from '../ruleResponse.js';
import { runFakerCommand } from './fakerCommandRunner.js';

/*
    Support for much of the faker APi

    http://marak.github.io/faker.js/
    https://github.com/Marak/faker.js

    e.g.

    faker.person.firstName
    faker.helpers.fake("{{name.lastName}}, {{name.firstName}}")
    faker.lorem.paragraph
 */

export class FakerCommand {
  constructor(aCommand, options = {}) {
    this.givenCommand = aCommand;
    this.options = options;

    this.fakerFunctionCallHasArgs = false;
    this.fakerFunctionName = '';
    this.fakerFunctionCallArgs = '';
    this.propertyAccessors = []; // Property chain for object-returning functions (e.g., [name, iataTypeCode] for airline.airplane.name)

    this.validationResult = errorResponse('Not Parsed');
  }

  parse() {
    // split into function name and arguments
    var parts = [];

    this.fakerFunctionCallHasArgs = false;
    this.fakerFunctionName;
    this.fakerFunctionCallArgs = '';

    var parsedCommand = this.givenCommand;
    if (parsedCommand.startsWith('faker.')) {
      parsedCommand = parsedCommand.replace('faker.', '');
    }

    if (parsedCommand.includes('(')) {
      // it has arguments, get rid of them at the moment
      // parsed command name
      this.fakerFunctionName = parsedCommand.split('(')[0];
      this.fakerFunctionCallHasArgs = true;
      this.fakerFunctionCallArgs = parsedCommand.substr(this.fakerFunctionName.length);
      parts = this.fakerFunctionName.split('.');
    } else {
      parts = parsedCommand.split('.');
      this.fakerFunctionName = parsedCommand;
      this.fakerFunctionCallHasArgs = false;
      this.fakerFunctionCallArgs = '';
    }

    if (parts.length === 0 || parts[0].length === 0) {
      this.validationResult = errorResponse('Syntax Error: No faker API command found');
      return this.validationResult;
    }

    if (parts.length === 1) {
      this.validationResult = errorResponse(
        'Syntax Error: No faker API command found - commands have a minimum of two parts module.command'
      );
      return this.validationResult;
    }

    this.validationResult = new RuleResponse(false, 'Parsed but Not Compiled', '');
    return this.validationResult;
  }

  compile(withFaker) {
    // we can only compile if we parsed it successfully
    if (this.validationResult.isError) {
      return this.validationResult;
    }

    const fakerFunction = this.findFakerFunction(this.fakerFunctionName, withFaker);

    if (fakerFunction.fakerFunction === undefined) {
      this.validationResult = errorResponse(
        'Could not find Faker API Command ' + this.fakerFunctionName + ` {${fakerFunction.commandName}}`
      );
      return this.validationResult;
    }

    if (typeof fakerFunction.fakerFunction === 'function') {
      this.validationResult = dataResponse('');
      // compiled command name
      this.fakerFunctionName = fakerFunction.commandName;
      // Store property accessors if any (for accessing properties on object-returning functions)
      this.propertyAccessors = fakerFunction.propertyAccessors || [];
      return this.validationResult;
    }
  }

  // TODO: create a class for this FakerFunction object
  // returns an object {fakerFunction: theFunctionFound, commandName: theFakerCommandMatchingTheFunction, propertyAccessors: []}
  findFakerFunction(forCommand, withFaker) {
    var fakerThing = withFaker;
    var parts = forCommand.split('.');

    var command = '';
    var commandConjoiner = '';
    var foundFunctionIndex = -1;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      const possibleFakerCommandRegex = new RegExp('^([A-Za-z]*)$');
      if (possibleFakerCommandRegex.test(part)) {
        if (foundFunctionIndex !== -1) {
          break;
        }

        command = command + commandConjoiner;
        command = command + part;
        commandConjoiner = '.';

        fakerThing = fakerThing[part];
        if (fakerThing === undefined) {
          break;
        }

        // Check if we've found a function (and we haven't yet recorded finding one)
        if (foundFunctionIndex === -1 && typeof fakerThing === 'function') {
          foundFunctionIndex = i;
        }
      } else {
        fakerThing = undefined;
        break;
      }
    }

    // If we found a function but there are more parts, those are property accessors
    const propertyAccessors = [];
    if (foundFunctionIndex !== -1 && foundFunctionIndex < parts.length - 1) {
      for (let j = foundFunctionIndex + 1; j < parts.length; j++) {
        propertyAccessors.push(parts[j]);
      }
      command = parts.slice(0, foundFunctionIndex + 1).join('.');
      fakerThing = this.findFakerFunction(command, withFaker).fakerFunction;
    }

    return { fakerFunction: fakerThing, commandName: command, propertyAccessors };
  }

  validate(againstFaker) {
    // if it failed parsing and compilation then fail it automatically
    if (this.validationResult.isError) {
      return this.validationResult;
    }

    const executionResult = this.execute(againstFaker);
    this.validationResult = new RuleResponse(
      executionResult.isError,
      'Invalid Faker API Call ' + executionResult.errorMessage,
      executionResult.data
    );
    return this.validationResult;
  }

  // returns a RuleResponse object that also says if an error happened
  execute(usingFaker) {
    if (this.validationResult.isError) {
      return this.validationResult;
    }

    return runFakerCommand(
      this.fakerFunctionName,
      this.fakerFunctionCallHasArgs ? this.fakerFunctionCallArgs : null,
      usingFaker,
      this.propertyAccessors,
      this.options
    );
  }

  isValid() {
    return !this.isError();
  }

  isError() {
    return this.validationResult.isError;
  }

  validationError() {
    return this.validationResult.errorMessage;
  }
}
