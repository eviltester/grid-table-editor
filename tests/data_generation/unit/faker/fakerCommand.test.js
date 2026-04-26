import { FakerCommand } from '../../../../js/data_generation/faker/fakerCommand.js';
import { faker } from '@faker-js/faker';

describe('Can parse, compile, validate and execute Faker commands', () => {
  describe('can parse commands', () => {
    test('can parse commands without faker prefix', () => {
      const command = new FakerCommand('string.alpha(4)');
      const validation = command.parse();
      expect(command.fakerFunctionName).toBe('string.alpha');
      expect(command.fakerFunctionCallHasArgs).toBe(true);
      expect(command.fakerFunctionCallArgs).toBe('(4)');
      expect(validation.isError).toBe(false);
    });

    test('can parse commands without arguments', () => {
      const command = new FakerCommand('person.fullName');
      const validation = command.parse();
      expect(command.fakerFunctionName).toBe('person.fullName');
      expect(command.fakerFunctionCallHasArgs).toBe(false);
      expect(command.fakerFunctionCallArgs).toBe('');
      expect(validation.isError).toBe(false);
    });

    test('can parse commands which are prefixed with faker', () => {
      const command = new FakerCommand('faker.string.alpha(4)');
      const validation = command.parse();
      expect(command.fakerFunctionName).toBe('string.alpha');
      expect(command.fakerFunctionCallHasArgs).toBe(true);
      expect(command.fakerFunctionCallArgs).toBe('(4)');
      expect(validation.isError).toBe(false);
    });

    test('can identify syntax error empty command', () => {
      const command = new FakerCommand('');
      const validation = command.parse();
      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe('Syntax Error: No faker API command found');

      expect(command.fakerFunctionName).toBe('');
      expect(command.fakerFunctionCallHasArgs).toBe(false);
      expect(command.fakerFunctionCallArgs).toBe('');
    });

    test('can identify syntax error faker commands have two parts', () => {
      const command = new FakerCommand('module command');
      const validation = command.parse();
      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe(
        'Syntax Error: No faker API command found - commands have a minimum of two parts module.command'
      );

      expect(command.fakerFunctionName).toBe('module command');
      expect(command.fakerFunctionCallHasArgs).toBe(false);
      expect(command.fakerFunctionCallArgs).toBe('');
    });
  });

  describe('Can compile commands to get more detailed validation errors', () => {
    test('can identify commands that do not exist', () => {
      const command = new FakerCommand('internet.ea');
      command.parse();
      const validation = command.compile(faker);

      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe('Could not find Faker API Command internet.ea {internet.ea}');
    });

    test('can identify modules that do not exist', () => {
      const command = new FakerCommand('parson.fullName');
      command.parse();
      const validation = command.compile(faker);

      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe('Could not find Faker API Command parson.fullName {parson}');
    });

    test('will report invalid parts that are not valid', () => {
      const command = new FakerCommand('person.1234.fullName');
      command.parse();
      const validation = command.compile(faker);

      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe('Could not find Faker API Command person.1234.fullName {person}');
      expect(command.fakerFunctionName).toBe('person.1234.fullName');
    });

    test('will fail when extra separators e.g. person..fullName', () => {
      const command = new FakerCommand('person..fullName');
      command.parse();
      const validation = command.compile(faker);

      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe('Could not find Faker API Command person..fullName {person.}');
      expect(command.fakerFunctionName).toBe('person..fullName');
    });
  });

  describe('Can validate to identify execution errors', () => {
    test('can identify commands that do not exist', () => {
      const command = new FakerCommand('string.alpha(4');
      command.parse();
      command.compile(faker);
      const validation = command.validate(faker);

      expect(validation.isError).toBe(true);
      expect(validation.errorMessage).toBe(
        'Invalid Faker API Call Error running Commmand string.alpha(4 ERR: SyntaxError: missing ) after argument list'
      );
    });

    test('can retreive validation from command', () => {
      const command = new FakerCommand('string.alpha(4');
      command.parse();
      command.compile(faker);
      command.validate(faker);

      expect(command.isError()).toBe(true);
      expect(command.isValid()).toBe(false);
      expect(command.validationError()).toBe(
        'Invalid Faker API Call Error running Commmand string.alpha(4 ERR: SyntaxError: missing ) after argument list'
      );
    });
  });

  describe('Can execute and generate data', () => {
    test('can generate data using faker', () => {
      const command = new FakerCommand('string.alpha(4)');
      command.parse();
      command.compile(faker);
      const validation = command.validate(faker);
      const execution = command.execute(faker);

      expect(validation.isError).toBe(false);
      expect(execution.isError).toBe(false);
      expect(execution.data.length).toBe(4);
    });
  });
});
