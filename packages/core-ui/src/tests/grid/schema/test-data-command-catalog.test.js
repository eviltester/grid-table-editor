import { describe, it, expect, beforeEach } from '@jest/globals';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import {
  identifyFakerCommands,
  getFakerCommands,
  getDomainCommands,
  getTabulatorCommandEditorValues,
  getAgGridCommandEditorValues,
  getMethodPickerOptions,
} from '../../../../js/gui_components/app/test-data-grid/schema/index.js';

describe('Test Data Command Catalog', () => {
  beforeEach(() => {
    // Reset and reinitialize faker commands before each test
    identifyFakerCommands();
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

    it('should hide non-scalar domain commands in type dropdown for new rows', () => {
      const values = getTabulatorCommandEditorValues('');
      const domainOptions = values
        .slice(values.findIndex((entry) => entry.value === '__domain_section__') + 1)
        .map((entry) => entry.value);
      expect(domainOptions).toContain('number.int');
      expect(domainOptions).not.toContain('science.chemicalElement');
      expect(domainOptions).not.toContain('finance.currency');
    });

    it('should include selected non-scalar domain command when editing existing row', () => {
      const values = getTabulatorCommandEditorValues('science.chemicalElement');
      const domainOptions = values
        .slice(values.findIndex((entry) => entry.value === '__domain_section__') + 1)
        .map((entry) => entry.value);
      expect(domainOptions).toContain('science.chemicalElement');
      expect(domainOptions).not.toContain('finance.currency');
    });

    it('should label faker/domain sections to reflect helpers split and ordering', () => {
      const values = getTabulatorCommandEditorValues('');
      const fakerSection = values.find((entry) => entry.value === '__faker_section__');
      const domainSection = values.find((entry) => entry.value === '__domain_section__');
      const fakerSectionIndex = values.findIndex((entry) => entry.value === '__faker_section__');
      const domainSectionIndex = values.findIndex((entry) => entry.value === '__domain_section__');
      expect(fakerSection?.label).toBe('-- faker (helpers) --');
      expect(domainSection?.label).toBe('-- domain --');
      expect(domainSectionIndex).toBeGreaterThanOrEqual(0);
      expect(fakerSectionIndex).toBeGreaterThan(domainSectionIndex);
    });

    it('should include domain commands in AG Grid command editor values', () => {
      const values = getAgGridCommandEditorValues('');
      expect(values).toContain('helpers.fake');
      expect(values).toContain('number.int');
      expect(values).toContain('person.firstName');
      expect(values).not.toContain('science.chemicalElement');
    });

    it('should provide picker options with schema help metadata', () => {
      const values = getMethodPickerOptions('');
      const domainEntry = values.find((entry) => entry.command === 'number.int');
      const fakerEntry = values.find((entry) => entry.command === 'helpers.arrayElement');
      expect(domainEntry?.sourceType).toBe('domain');
      expect(fakerEntry?.sourceType).toBe('faker');
      expect(Array.isArray(domainEntry?.helpModel?.params)).toBe(true);
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
