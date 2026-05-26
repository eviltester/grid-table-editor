import { KNOWN_FAKER_COMMANDS } from '../../../js/gui_components/shared/faker-commands.js';
import {
  FAKER_COMMAND_HELP_METADATA,
  getFakerCommandHelp,
} from '../../../js/gui_components/shared/faker-command-help-metadata.js';

describe('faker command help metadata', () => {
  test('contains help entries for all curated faker commands', () => {
    const fakerCommands = KNOWN_FAKER_COMMANDS.filter((command) => command !== 'RegEx');
    fakerCommands.forEach((command) => {
      expect(FAKER_COMMAND_HELP_METADATA[command]).toBeDefined();
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
    expect(airline.docsUrl).toBe('https://fakerjs.dev/api/airline');

    expect(helper).toBeDefined();
    expect(helper.summary.length).toBeGreaterThan(0);
    expect(helper.docsUrl).toBe('https://fakerjs.dev/api/helpers');
  });

  test('includes params when signatures are available and supports fallback summaries', () => {
    const firstName = getFakerCommandHelp('person.firstName');
    const nestedPropertyAccess = getFakerCommandHelp('airline.airplane.name');
    const imageDataUri = getFakerCommandHelp('image.dataUri');

    expect(firstName.params).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'sex', optional: true, type: "'female' | 'male'" })])
    );
    expect(firstName.example.length).toBeGreaterThan(0);

    expect(imageDataUri.params).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'options', optional: true, type: 'object' })])
    );
    expect(imageDataUri.example.length).toBeGreaterThan(0);

    expect(nestedPropertyAccess).toBeDefined();
    expect(nestedPropertyAccess.summary.length).toBeGreaterThan(0);
    expect(Array.isArray(nestedPropertyAccess.params)).toBe(true);
  });

  test('includes curated helper descriptions and examples', () => {
    const mustache = getFakerCommandHelp('helpers.mustache');
    const arrayElement = getFakerCommandHelp('helpers.arrayElement');
    const rangeToNumber = getFakerCommandHelp('helpers.rangeToNumber');

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
    expect(rangeToNumber.examples).toContain('helpers.rangeToNumber({ min: 1, max: 2 })');
  });
});
