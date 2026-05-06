import { EnumTestDataGenerator } from '../../../../packages/core/js/data_generation/enum/enumTestDataGenerator.js';
import { TestDataRule } from '../../../../packages/core/js/data_generation/testDataRule.js';

describe('EnumTestDataGenerator', () => {
  describe('generates values from enum rules', () => {
    test('generates from simple comma-separated enum', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Status', 'Active,Inactive,Pending');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(false);
      expect(['Active', 'Inactive', 'Pending']).toContain(result.data);
    });

    test('generates from awd datatype.enum format', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Color', 'datatype.enum("Red", "Blue", "Green")');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(false);
      expect(['Red', 'Blue', 'Green']).toContain(result.data);
    });

    test('generates from enum format', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Size', 'enum("S", "M", "L")');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(false);
      expect(['S', 'M', 'L']).toContain(result.data);
    });

    test('generates from unquoted enum format', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('HttpMethod', 'enum(GET,POST,PUT,DELETE)');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(false);
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(result.data);
    });

    test('generates from mixed quoted and unquoted enum format', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Type', 'enum(basic,"with space",advanced)');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(false);
      expect(['basic', 'with space', 'advanced']).toContain(result.data);
    });

    test('generates consistent values from same rule', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Binary', 'Yes,No');
      rule.type = 'enum';

      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = generator.generateFrom(rule);
        expect(result.isError).toBe(false);
        expect(['Yes', 'No']).toContain(result.data);
        results.push(result.data);
      }

      // Should have both values at some point
      expect(results).toContain('Yes');
      expect(results).toContain('No');
    });

    test('handles malformed enum gracefully', () => {
      const generator = new EnumTestDataGenerator();
      const rule = new TestDataRule('Bad', 'datatype.enum(unclosed');
      rule.type = 'enum';

      const result = generator.generateFrom(rule);

      expect(result.isError).toBe(true);
      expect(result.errorMessage).toContain('Enum Generation Error');
    });
  });

  describe('format detection', () => {
    test('detects awd enum formats', () => {
      const generator = new EnumTestDataGenerator();

      expect(generator.isAwdEnumFormat('enum("A", "B")')).toBe(true);
      expect(generator.isAwdEnumFormat('datatype.enum("A", "B")')).toBe(true);
      expect(generator.isAwdEnumFormat('awd.datatype.enum("A", "B")')).toBe(true);
      expect(generator.isAwdEnumFormat('A,B,C')).toBe(false);
    });
  });
});
