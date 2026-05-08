import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { TestDataRule } from '@anywaydata/core/data_generation/testDataRule.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

describe('Pairwise Data Structure Fix', () => {
  test('should handle the nested data structure correctly when creating GenericDataTable', () => {
    // Create enum rules
    const rules = [
      new TestDataRule('Color', 'enum("red","blue","green")'),
      new TestDataRule('Size', 'enum("small","large")'),
    ];

    rules.forEach((rule) => rule.setType('enum'));

    // Generate data using PairwiseTestDataGenerator
    const generator = new PairwiseTestDataGenerator();
    const initResult = generator.initializeFromRules(rules);
    expect(initResult.isError).toBe(false);

    const dataResult = generator.generateAllDataRecordsAsRows();
    expect(dataResult.isError).toBe(false);

    // This is the fix: accessing dataResult.data.data instead of dataResult.data
    const dataTable = new GenericDataTable();
    const [headers, ...rows] = dataResult.data.data; // Fixed: nested data access
    dataTable.setHeaders(headers);
    rows.forEach((row) => {
      dataTable.appendDataRow(row);
    });

    // Should not throw and should return a valid data table
    expect(dataTable).toBeDefined();
    expect(dataTable.getHeaders()).toEqual(['Color', 'Size']);
    expect(dataTable.getRowCount()).toBeGreaterThan(0);

    // Verify data contains expected enum values
    const colorValues = [];
    const sizeValues = [];
    for (let i = 0; i < dataTable.getRowCount(); i++) {
      const row = dataTable.getRow(i);
      colorValues.push(row[0]);
      sizeValues.push(row[1]);
    }

    expect(colorValues).toContain('red');
    expect(colorValues).toContain('blue');
    expect(colorValues).toContain('green');

    expect(sizeValues).toContain('small');
    expect(sizeValues).toContain('large');
  });

  test('PairwiseTestDataGenerator returns correct nested data structure', () => {
    const rules = [new TestDataRule('Color', 'enum("red","blue")'), new TestDataRule('Size', 'enum("small","large")')];

    rules.forEach((rule) => rule.setType('enum'));

    const generator = new PairwiseTestDataGenerator();
    const initResult = generator.initializeFromRules(rules);
    expect(initResult.isError).toBe(false);

    const dataResult = generator.generateAllDataRecordsAsRows();
    expect(dataResult.isError).toBe(false);
    expect(dataResult.data).toBeDefined();
    expect(dataResult.data.data).toBeDefined(); // Nested data structure
    expect(dataResult.data.stats).toBeDefined();

    // Verify the data structure we're expecting
    const [headers, ...rows] = dataResult.data.data;
    expect(headers).toEqual(['Color', 'Size']);
    expect(rows.length).toBe(4); // 2x2 full coverage for small example
  });

  test('demonstrates the original error would occur with wrong data access', () => {
    const rules = [new TestDataRule('Color', 'enum("red","blue")'), new TestDataRule('Size', 'enum("small","large")')];

    rules.forEach((rule) => rule.setType('enum'));

    const generator = new PairwiseTestDataGenerator();
    generator.initializeFromRules(rules);
    const dataResult = generator.generateAllDataRecordsAsRows();

    // This would cause the "object is not iterable" error
    expect(() => {
      const [first] = dataResult.data; // Wrong: trying to destructure object
      void first;
    }).toThrow();

    // But this works correctly (the fix)
    expect(() => {
      const [first] = dataResult.data.data; // Correct: accessing nested array
      void first;
    }).not.toThrow();
  });
});
