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
    expect(airline.docsUrl).toBe('https://fakerjs.dev/api/airline');

    expect(helper).toBeDefined();
    expect(helper.summary.length).toBeGreaterThan(0);
    expect(helper.docsUrl).toBe('https://fakerjs.dev/api/helpers');
  });

  test('falls back to domain keyword help for domain-backed faker commands', () => {
    const firstName = getFakerCommandHelp('person.firstName');
    const nestedPropertyAccess = getFakerCommandHelp('airline.airplane.name');
    const imageDataUri = getFakerCommandHelp('image.dataUri');
    const uuid = getFakerCommandHelp('string.uuid');

    expect(firstName.params).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'sex', optional: true, type: 'string' })])
    );
    expect(firstName.example.length).toBeGreaterThan(0);
    expect(buildFakerHelperHelpMetadata()['person.firstName']).toBeUndefined();

    expect(Array.isArray(imageDataUri.params)).toBe(true);
    expect(imageDataUri.example.length).toBeGreaterThan(0);

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
    expect(mustache.examples).toContain('helpers.mustache("Hello {{name}}", { name: "Ada" })');

    expect(arrayElement.summary).toContain('one random element');
    expect(arrayElement.examples).toContain('helpers.arrayElement(["A", "B", "C"])');

    expect(rangeToNumber.params).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'numberOrRange',
          description: expect.stringContaining('range object'),
        }),
      ])
    );
    expect(rangeToNumber.example).toBe('2');
    expect(rangeToNumber.examples).toContain('helpers.rangeToNumber({ min: 1, max: 2 })');

    expect(multiple.returnType).toBe('array');
  });
});
