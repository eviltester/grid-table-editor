import { describe, it, expect, beforeEach } from '@jest/globals';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '../../packages/core/js/data_generation/testDataGenerator';
import {
  probeCommandReturnType,
  identifyFakerCommands,
  getFakerCommands,
} from '../../packages/core-ui/js/gui_components/testdatadefn.js';

describe('Faker Dropdown Literal Commands', () => {
  beforeEach(() => {
    // Reset and reinitialize faker commands before each test
    identifyFakerCommands();
  });

  describe('probeCommandReturnType', () => {
    it('should identify primitive-returning commands', () => {
      const type = probeCommandReturnType('person.firstName', faker);
      expect(type).toBe('primitive');
    });

    it('should identify object-returning commands', () => {
      const type = probeCommandReturnType('airline.airplane', faker);
      expect(type).toBe('object');
    });

    it('should handle commands that error gracefully', () => {
      const type = probeCommandReturnType('nonexistent.command', faker);
      expect(type).toBeNull();
    });
  });

  describe('identifyFakerCommands and dropdown discovery', () => {
    it('should populate FAKER_COMMANDS array', () => {
      const commands = getFakerCommands();
      expect(commands.length).toBeGreaterThan(0);
      expect(commands).toContain('RegEx');
    });

    it('should include primitive-returning commands', () => {
      const commands = getFakerCommands();
      expect(commands).toContain('person.firstName');
      expect(commands).toContain('person.lastName');
    });

    it('should expand airline.airplane to explicit leaf commands', () => {
      const commands = getFakerCommands();
      expect(commands).toContain('airline.airplane.name');
      expect(commands).toContain('airline.airplane.iataTypeCode');
      expect(commands).not.toContain('airline.airplane');
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
