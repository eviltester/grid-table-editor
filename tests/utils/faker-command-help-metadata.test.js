import { KNOWN_FAKER_COMMANDS } from '../../js/gui_components/faker-commands.js';
import {
  FAKER_COMMAND_HELP_METADATA,
  getFakerCommandHelp,
} from '../../js/gui_components/faker-command-help-metadata.js';

describe('faker command help metadata', () => {
  test('contains help entries for all curated faker commands', () => {
    const fakerCommands = KNOWN_FAKER_COMMANDS.filter((command) => command !== 'RegEx');
    fakerCommands.forEach((command) => {
      expect(FAKER_COMMAND_HELP_METADATA[command]).toBeDefined();
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

  test('strips inline comments from parameter types', () => {
    const allEntries = Object.values(FAKER_COMMAND_HELP_METADATA);
    allEntries.forEach((entry) => {
      (entry.params || []).forEach((param) => {
        const type = String(param.type || '');
        expect(type).not.toContain('/**');
        expect(type).not.toContain('*/');
        expect(type.toLowerCase()).not.toContain('when true this will generate');
      });
    });
  });
});
