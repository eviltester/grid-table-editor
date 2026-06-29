import { KNOWN_FAKER_COMMANDS } from '../../../js/gui_components/shared/faker-commands.js';
import {
  getFakerCommandHelp,
  FAKER_HELPER_KEYWORD_DEFINITIONS,
  buildFakerHelperHelpMetadata,
} from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';

describe('faker command help metadata', () => {
  test('contains direct metadata entries only for faker-only helper commands', () => {
    const fakerCommands = KNOWN_FAKER_COMMANDS.filter((command) => command.startsWith('helpers.'));
    expect(fakerCommands).toEqual(Object.keys(FAKER_HELPER_KEYWORD_DEFINITIONS));
    const helperMetadata = buildFakerHelperHelpMetadata();
    fakerCommands.forEach((command) => {
      expect(helperMetadata[command]).toBeDefined();
    });
    expect(helperMetadata['person.firstName']).toBeUndefined();
  });

  test('normalizes helper metadata directly from helper definitions', () => {
    const helperMetadata = buildFakerHelperHelpMetadata();
    expect(Object.keys(helperMetadata)).toEqual(Object.keys(FAKER_HELPER_KEYWORD_DEFINITIONS));
    Object.values(FAKER_HELPER_KEYWORD_DEFINITIONS).forEach((definition) => {
      expect(Array.isArray(definition.usageExamples)).toBe(true);
      expect(definition.usageExamples.length).toBeGreaterThan(0);
      definition.usageExamples.forEach((usageExample) => {
        expect(usageExample.functionCall).toEqual(expect.any(String));
        expect(Object.prototype.hasOwnProperty.call(usageExample, 'sampleReturnValue')).toBe(true);
        expect(usageExample.sampleReturnValue).not.toBeUndefined();
        expect(usageExample.description).toEqual(expect.any(String));
      });
    });
  });

  test('contains docsUrl for all curated faker commands', () => {
    const fakerCommands = KNOWN_FAKER_COMMANDS.filter((command) => command !== 'RegEx');
    fakerCommands.forEach((command) => {
      const help = getFakerCommandHelp(command);
      expect(help).toBeDefined();
      expect(String(help.docsUrl || '').trim().length).toBeGreaterThan(0);
    });
  });

  test('includes docs url and non-empty summary for sample commands', () => {
    const airline = getFakerCommandHelp('airline.recordLocator');
    const helper = getFakerCommandHelp('helpers.arrayElement');

    expect(airline).toBeDefined();
    expect(airline.summary.length).toBeGreaterThan(0);
    expect(airline.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/airline');
    expect(airline.fakerDocsUrl).toBe('https://fakerjs.dev/api/airline');

    expect(helper).toBeDefined();
    expect(helper.summary.length).toBeGreaterThan(0);
    expect(helper.docsUrl).toBe('https://fakerjs.dev/api/helpers');
    expect(helper.fakerDocsUrl).toBe('');
  });

  test('falls back to domain keyword help for domain-backed faker commands', () => {
    const firstName = getFakerCommandHelp('person.firstName');
    const nestedPropertyAccess = getFakerCommandHelp('airline.airplane.name');
    const imageDataUri = getFakerCommandHelp('image.dataUri');
    const uuid = getFakerCommandHelp('string.uuid');

    expect(firstName.params).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'sex', optional: true, type: 'female|male' })])
    );
    expect(firstName.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: expect.any(String),
          sampleReturnValue: expect.anything(),
          description: expect.any(String),
        }),
      ])
    );
    expect(firstName.validator).toBeDefined();
    expect(buildFakerHelperHelpMetadata()['person.firstName']).toBeUndefined();

    expect(Array.isArray(imageDataUri.params)).toBe(true);
    expect(imageDataUri.usageExamples.length).toBeGreaterThan(0);

    expect(uuid.summary).toContain('Returns a UUID');
    expect(uuid.params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'version', optional: true, type: '4|7' }),
        expect.objectContaining({ name: 'refDate', optional: true, type: 'string|number|date' }),
      ])
    );
    expect(uuid.params.find((param) => param.name === 'version')?.description).toContain(
      'version 7 is used automatically'
    );
    expect(uuid.params.find((param) => param.name === 'refDate')?.description).toContain(
      'Providing refDate with version 4 is invalid'
    );

    expect(nestedPropertyAccess).toBeDefined();
    expect(nestedPropertyAccess.summary.length).toBeGreaterThan(0);
    expect(Array.isArray(nestedPropertyAccess.params)).toBe(true);
  });

  test('includes curated helper descriptions and examples', () => {
    const mustache = getFakerCommandHelp('helpers.mustache');
    const arrayElement = getFakerCommandHelp('helpers.arrayElement');
    const rangeToNumber = getFakerCommandHelp('helpers.rangeToNumber');
    const multiple = getFakerCommandHelp('helpers.multiple');

    expect(mustache.summary).toContain('Replaces {{placeholder}} tokens');
    expect(mustache.params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'data',
          description: expect.stringContaining('replacement values'),
        }),
      ])
    );
    expect(mustache.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: 'helpers.mustache("Hello {{name}}", { name: "Ada" })',
        }),
      ])
    );

    expect(arrayElement.summary).toContain('one random element');
    expect(arrayElement.params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'array',
          positionalOnly: true,
        }),
      ])
    );
    expect(arrayElement.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: 'helpers.arrayElement(["A", "B", "C"])',
        }),
      ])
    );

    expect(rangeToNumber.params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'numberOrRange',
          positionalOnly: true,
          description: expect.stringContaining('range object'),
        }),
      ])
    );
    expect(rangeToNumber.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: 'helpers.rangeToNumber({ min: 1, max: 2 })',
          sampleReturnValue: 1,
        }),
      ])
    );

    expect(multiple.returnType).toBe('array');
  });

  test('runtime faker help metadata does not expose legacy example fields', () => {
    const helper = getFakerCommandHelp('helpers.arrayElement');
    const domainBacked = getFakerCommandHelp('person.firstName');

    [helper, domainBacked].forEach((help) => {
      expect(help).toBeDefined();
      expect(Object.prototype.hasOwnProperty.call(help, 'example')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(help, 'examples')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(help, 'exampleReturnValues')).toBe(false);
    });
  });
});
