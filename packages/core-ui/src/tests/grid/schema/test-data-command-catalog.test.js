import { describe, it, expect, beforeEach } from '@jest/globals';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import {
  identifyFakerCommands,
  getFakerCommands,
  getDomainCommands,
  getVisibleDomainCommandOptions,
  getMethodPickerOptions,
} from '../../../../js/gui_components/app/test-data-grid/schema/test-data-command-catalog.js';

describe('Test Data Command Catalog', () => {
  beforeEach(() => {
    // Reset and reinitialize faker commands before each test
    identifyFakerCommands();
  });

  it('exposes command-catalog helpers directly from the focused catalog module', () => {
    expect(typeof identifyFakerCommands).toBe('function');
    expect(typeof getMethodPickerOptions).toBe('function');
    expect(typeof getVisibleDomainCommandOptions).toBe('function');
  });

  describe('identifyFakerCommands and dropdown discovery', () => {
    it('should populate FAKER_COMMANDS array', () => {
      const commands = getFakerCommands();
      expect(commands.length).toBeGreaterThan(0);
      expect(commands.slice(0, 3)).toEqual(['enum', 'literal', 'regex']);
      expect(commands).not.toContain('FAKER');
      expect(commands).not.toContain('-------');
    });

    it('should include helper commands', () => {
      const commands = getFakerCommands();
      expect(commands).toContain('helpers.fake');
      expect(commands).toContain('helpers.arrayElement');
      expect(commands.every((command, index) => index < 3 || command.startsWith('helpers.'))).toBe(true);
    });

    it('should include approved helpers commands that return primitives', () => {
      const commands = getFakerCommands();
      // These helpers return usable test data values (strings, functions that generate strings, etc.)
      expect(commands).toContain('helpers.fake');
      expect(commands).toContain('helpers.mustache');
      expect(commands).toContain('helpers.fromRegExp');
      expect(commands).toContain('helpers.arrayElement');
    });

    it('should exclude bad helpers commands', () => {
      const commands = getFakerCommands();
      // These helpers are known to be unsuitable
      expect(commands).not.toContain('helpers.objectKey');
      expect(commands).not.toContain('helpers.objectValue');
      expect(commands).not.toContain('helpers.objectEntry');
      expect(commands).not.toContain('helpers.enumValue');
    });

    it('should sort commands by descending length to avoid prefix collisions', () => {
      const commands = getFakerCommands();
      // Find indices of commands with potential collision
      const arrayElementsIdx = commands.indexOf('arrayElements');
      const arrayElementIdx = commands.indexOf('arrayElement');

      if (arrayElementsIdx !== -1 && arrayElementIdx !== -1) {
        // Longer command should come first (lower index)
        expect(arrayElementsIdx).toBeLessThan(arrayElementIdx);
      }
    });

    it('should also populate domain commands for the domain dropdown section', () => {
      const domainCommands = getDomainCommands();
      expect(domainCommands.length).toBeGreaterThan(0);
      expect(domainCommands).toContain('number.int');
      expect(domainCommands).toContain('string.counterString');
      expect(domainCommands.some((command) => command.startsWith('helpers.'))).toBe(false);
    });

    it('should provide picker options with schema help metadata', () => {
      const values = getMethodPickerOptions('');
      const domainEntry = values.find((entry) => entry.command === 'number.int');
      const fakerEntry = values.find((entry) => entry.command === 'helpers.arrayElement');
      expect(domainEntry?.sourceType).toBe('domain');
      expect(fakerEntry?.sourceType).toBe('faker');
      expect(Array.isArray(domainEntry?.helpModel?.params)).toBe(true);
    });

    it('should keep non-scalar domain commands out of default picker options', () => {
      const values = getMethodPickerOptions('');
      const commands = values.map((entry) => entry.command);
      expect(commands).toContain('number.int');
      expect(commands).not.toContain('science.chemicalElement');
      expect(commands).not.toContain('finance.currency');
    });

    it('should include the current non-scalar domain command when editing an existing row', () => {
      const values = getMethodPickerOptions('science.chemicalElement');
      const commands = values.map((entry) => entry.command);
      expect(commands).toContain('science.chemicalElement');
      expect(commands).not.toContain('finance.currency');
    });
  });

  describe('Expanded object commands execute', () => {
    it('should execute airline.airplane.name as a string literal', () => {
      const generator = new TestDataGenerator(faker, RandExp);
      generator.importSpec('testColumn\nairline.airplane.name');
      generator.compile();

      expect(generator.isValid()).toBe(true);

      const row = generator.generateRow();
      expect(Array.isArray(row)).toBe(true);
      expect(typeof row?.[0]).toBe('string');
      expect(row?.[0]?.length).toBeGreaterThan(0);
    });

    it('should execute airline.airplane.iataTypeCode as a string literal', () => {
      const generator = new TestDataGenerator(faker, RandExp);
      generator.importSpec('testColumn\nairline.airplane.iataTypeCode');
      generator.compile();

      expect(generator.isValid()).toBe(true);

      const row = generator.generateRow();
      expect(Array.isArray(row)).toBe(true);
      expect(typeof row?.[0]).toBe('string');
      expect(row?.[0]?.length).toBeGreaterThan(0);
    });
  });
});
