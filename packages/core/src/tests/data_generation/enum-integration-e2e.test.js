import { generateFromTextSpec } from '../../index.js';

describe('Enum Integration End-to-End', () => {
  describe('enum data generation works end-to-end', () => {
    test('simple comma-separated enum generates valid data', () => {
      const schemaText = `Status
Active,Inactive,Pending`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 10,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Status']);
      expect(result.rows).toHaveLength(10);

      result.rows.forEach((row) => {
        expect(['Active', 'Inactive', 'Pending']).toContain(row[0]);
      });
    });

    test('awd enum format generates valid data', () => {
      const schemaText = `Priority
datatype.enum("High", "Medium", "Low")`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 10,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Priority']);
      expect(result.rows).toHaveLength(10);

      result.rows.forEach((row) => {
        expect(['High', 'Medium', 'Low']).toContain(row[0]);
      });
    });

    test('single-value explicit enum stays typed as enum and generates that value', () => {
      const schemaText = `Status
enum("Open")`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 5,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Status']);
      expect(result.rows).toHaveLength(5);

      result.rows.forEach((row) => {
        expect(row[0]).toBe('Open');
      });
    });

    test('mixed schema with enum, faker, and regex works', () => {
      const schemaText = `Name
person.firstName
Status
Active,Inactive
Code
[A-Z]{3}`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 5,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Name', 'Status', 'Code']);
      expect(result.rows).toHaveLength(5);

      result.rows.forEach((row) => {
        expect(typeof row[0]).toBe('string'); // Name (faker)
        expect(['Active', 'Inactive']).toContain(row[1]); // Status (enum)
        expect(row[2]).toMatch(/^[A-Z]{3}$/); // Code (regex)
      });
    });

    test('enum with spaces and special characters', () => {
      const schemaText = `Category
enum("Home & Garden", "Sports & Outdoors", "Arts & Crafts")`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 10,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Category']);

      result.rows.forEach((row) => {
        expect(['Home & Garden', 'Sports & Outdoors', 'Arts & Crafts']).toContain(row[0]);
      });
    });

    test('multiple enum columns work independently', () => {
      const schemaText = `Size
Small,Medium,Large
Color
Red,Blue,Green`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 20,
        outputFormat: 'json',
      });

      expect(result.ok).toBe(true);
      expect(result.headers).toEqual(['Size', 'Color']);
      expect(result.rows).toHaveLength(20);

      // Check we get variety in both columns
      const sizes = new Set(result.rows.map((r) => r[0]));
      const colors = new Set(result.rows.map((r) => r[1]));

      expect(sizes.size).toBeGreaterThan(1); // Should have multiple sizes
      expect(colors.size).toBeGreaterThan(1); // Should have multiple colors

      result.rows.forEach((row) => {
        expect(['Small', 'Medium', 'Large']).toContain(row[0]);
        expect(['Red', 'Blue', 'Green']).toContain(row[1]);
      });
    });

    test('enum validation catches errors', () => {
      const schemaText = `BadEnum
SingleValue`;

      const result = generateFromTextSpec({
        textSpec: schemaText,
        rowCount: 5,
        outputFormat: 'json',
      });

      // Single value should be treated as regex, not enum, so it should still work
      expect(result.ok).toBe(true);

      result.rows.forEach((row) => {
        expect(row[0]).toBe('SingleValue'); // Regex will match literal text
      });
    });
  });
});
