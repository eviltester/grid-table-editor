import { PairwiseGenerator } from '@anywaydata/core/data_generation/n-wise/pairwiseGenerator.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { TestDataRule, RuleType } from '@anywaydata/core/data_generation/testDataRule.js';
import { faker } from '@faker-js/faker';
import {
  assertNoCommonErrorPatternsInRows,
  assertNoCommonErrorPatternsInValue,
} from '../utils/outputQualityAssertions.js';

describe('Pairwise Combinatorial Matching Data Generation', () => {
  describe('PairwiseGenerator', () => {
    test('should generate minimal data set for simple 3x3 parameters', () => {
      const parameters = [
        { name: 'Browser', values: ['Chrome', 'Firefox', 'Safari'] },
        { name: 'OS', values: ['Windows', 'Mac', 'Linux'] },
        { name: 'Device', values: ['Desktop', 'Mobile', 'Tablet'] },
      ];

      const generator = new PairwiseGenerator(parameters);
      const dataRecords = generator.generateDataSet();

      // Should generate fewer than full cartesian product (3x3x3=27)
      expect(dataRecords.length).toBeLessThan(27);
      expect(dataRecords.length).toBeGreaterThan(0);

      // Verify structure
      expect(dataRecords[0]).toBeInstanceOf(Map);
      expect(dataRecords[0].size).toBe(3);

      // Check coverage
      const stats = generator.getCoverageStats();
      expect(stats.coveragePercentage).toBeCloseTo(100, 1);
      const exported = generator.exportDataRecords();
      for (const record of exported) {
        assertNoCommonErrorPatternsInValue(record.Browser);
        assertNoCommonErrorPatternsInValue(record.OS);
        assertNoCommonErrorPatternsInValue(record.Device);
      }

      console.log(`Generated ${dataRecords.length} data records (vs ${27} full cartesian)`);
      console.log(`Coverage: ${stats.coveragePercentage.toFixed(1)}%`);
    });

    test('should handle uneven parameter sizes', () => {
      const parameters = [
        { name: 'Color', values: ['Red', 'Green'] },
        { name: 'Size', values: ['Small', 'Medium', 'Large', 'XLarge'] },
        { name: 'Material', values: ['Cotton', 'Polyester', 'Wool'] },
      ];

      const generator = new PairwiseGenerator(parameters);
      const dataRecords = generator.generateDataSet();

      // Full cartesian would be 2x4x3=24
      expect(dataRecords.length).toBeLessThan(24);
      expect(dataRecords.length).toBeGreaterThan(3);

      const stats = generator.getCoverageStats();
      expect(stats.coveragePercentage).toBeCloseTo(100, 1);
      const exported = generator.exportDataRecords();
      for (const record of exported) {
        expect(['Red', 'Green']).toContain(record.Color);
        expect(['Small', 'Medium', 'Large', 'XLarge']).toContain(record.Size);
        expect(['Cotton', 'Polyester', 'Wool']).toContain(record.Material);
      }
    });

    test('should verify all pairs are actually covered', () => {
      const parameters = [
        { name: 'A', values: ['A1', 'A2'] },
        { name: 'B', values: ['B1', 'B2'] },
        { name: 'C', values: ['C1', 'C2'] },
      ];

      const generator = new PairwiseGenerator(parameters);
      generator.generateDataSet();

      // Manually verify specific pairs are covered
      const exported = generator.exportDataRecords();

      // Check A-B pairs
      const aPairs = new Set();
      const bPairs = new Set();
      const cPairs = new Set();

      for (const record of exported) {
        aPairs.add(`${record.A}:${record.B}`);
        bPairs.add(`${record.B}:${record.C}`);
        cPairs.add(`${record.A}:${record.C}`);
      }

      // Should have all 4 A-B combinations
      expect(aPairs.has('A1:B1')).toBe(true);
      expect(aPairs.has('A1:B2')).toBe(true);
      expect(aPairs.has('A2:B1')).toBe(true);
      expect(aPairs.has('A2:B2')).toBe(true);
    });

    test('should handle large parameter spaces efficiently', () => {
      const parameters = [
        { name: 'Param1', values: ['A', 'B', 'C', 'D', 'E'] },
        { name: 'Param2', values: ['1', '2', '3', '4'] },
        { name: 'Param3', values: ['X', 'Y', 'Z'] },
        { name: 'Param4', values: ['Red', 'Blue'] },
        { name: 'Param5', values: ['Hot', 'Cold', 'Warm'] },
      ];

      const startTime = Date.now();
      const generator = new PairwiseGenerator(parameters);
      const dataRecords = generator.generateDataSet();
      const endTime = Date.now();

      // Full cartesian: 5x4x3x2x3 = 360
      expect(dataRecords.length).toBeLessThan(360);
      expect(dataRecords.length).toBeGreaterThan(10);

      const stats = generator.getCoverageStats();
      expect(stats.coveragePercentage).toBeGreaterThan(99);

      console.log(`Large test: ${dataRecords.length} data records in ${endTime - startTime}ms`);
    });
  });

  describe('PairwiseTestDataGenerator Integration', () => {
    test('should integrate with TestDataRule system', () => {
      const rules = [
        new TestDataRule('Browser', 'Chrome,Firefox,Safari'),
        new TestDataRule('OS', 'Windows,Mac,Linux'),
        new TestDataRule('Device', 'Desktop,Mobile'),
      ];

      // Set rule types to enum for pairwise generation
      rules.forEach((rule) => rule.setType(RuleType.ENUM));

      const generator = new PairwiseTestDataGenerator();
      const initResult = generator.initializeFromRules(rules);

      expect(initResult.isError).toBe(false);
      expect(generator.canGeneratePairwise(rules)).toBe(true);
    });

    test('should generate data records as data rows', () => {
      const rules = [new TestDataRule('Color', 'Red,Green,Blue'), new TestDataRule('Size', 'Small,Large')];
      rules.forEach((rule) => rule.setType(RuleType.ENUM));

      const generator = new PairwiseTestDataGenerator();
      generator.initializeFromRules(rules);

      const result = generator.generateAllDataRecordsAsRows();

      expect(result.data && typeof result.data).toBe('object');
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(result.data.data[0]).toEqual(['Color', 'Size']); // Headers
      expect(result.data.data.length).toBeGreaterThan(1); // Has data rows
      expect(result.data.stats.coveragePercentage).toBeCloseTo(100, 1);
      assertNoCommonErrorPatternsInRows(result.data.data.slice(1));
    });

    test('should handle mixed rule types gracefully', () => {
      const rules = [
        new TestDataRule('EnumParam1', 'A,B,C'),
        new TestDataRule('EnumParam2', 'X,Y'),
        new TestDataRule('LiteralParam', 'FixedValue'),
        new TestDataRule('BoolParam', ''),
      ];

      rules[0].setType(RuleType.ENUM);
      rules[1].setType(RuleType.ENUM);
      rules[2].setType(RuleType.LITERAL);
      rules[3].setType(RuleType.BOOLEAN);

      const generator = new PairwiseTestDataGenerator();
      const initResult = generator.initializeFromRules(rules);

      expect(initResult.isError).toBe(false);

      const result = generator.generateAllDataRecordsAsRows();
      expect(result.data.data.length).toBeGreaterThan(1);

      // Check that all columns are present (2 enum + 2 non-enum)
      expect(result.data.data[0]).toEqual(['EnumParam1', 'EnumParam2', 'LiteralParam', 'BoolParam']);

      // Check that enum values appear in combinations while non-enum values are random
      const dataRows = result.data.data.slice(1); // Skip headers
      dataRows.forEach((row) => {
        expect(['A', 'B', 'C']).toContain(row[0]); // EnumParam1
        expect(['X', 'Y']).toContain(row[1]); // EnumParam2
        expect(row[2]).toBe('FixedValue'); // LiteralParam
        expect(['true', 'false']).toContain(row[3]); // BoolParam
      });
      assertNoCommonErrorPatternsInRows(dataRows);
    });

    test('should provide meaningful error for insufficient parameters', () => {
      const rules = [new TestDataRule('OnlyOne', 'value1,value2')];
      rules[0].setType(RuleType.ENUM);

      const generator = new PairwiseTestDataGenerator();

      expect(generator.canGeneratePairwise(rules)).toBe(false);

      const initResult = generator.initializeFromRules(rules);
      expect(initResult.isError).toBe(true);
      expect(initResult.errorMessage).toContain('at least 2 ENUM parameters');
    });

    test('should clear previous generation state before failed re-initialization', () => {
      const validRules = [new TestDataRule('Color', 'Red,Green'), new TestDataRule('Size', 'Small,Large')];
      validRules.forEach((rule) => rule.setType(RuleType.ENUM));

      const generator = new PairwiseTestDataGenerator();
      const firstInit = generator.initializeFromRules(validRules);
      expect(firstInit.isError).toBe(false);

      const firstRows = generator.generateAllDataRecordsAsRows();
      expect(firstRows.isError).toBe(false);
      expect(firstRows.data.data.length).toBeGreaterThan(1);
      expect(generator.getStats().available).toBe(true);

      const invalidRules = [new TestDataRule('OnlyOne', 'value1,value2')];
      invalidRules[0].setType(RuleType.ENUM);
      const secondInit = generator.initializeFromRules(invalidRules);

      expect(secondInit.isError).toBe(true);
      expect(generator.dataRecords).toEqual([]);
      expect(generator.currentRecordIndex).toBe(0);
      expect(generator.getStats()).toEqual({ available: false });
      expect(generator.generateAllDataRecordsAsRows().isError).toBe(true);
    });

    test('should generate pairwise data from canonical plain rule objects', () => {
      const rules = [
        { name: 'Literal Example', type: 'literal', ruleSpec: 'Pending Review' },
        { name: 'Enum Example', type: 'enum', ruleSpec: 'enum("Open","In Progress","Closed")' },
        { name: 'Enum Example 2', type: 'enum', ruleSpec: 'enum("High","Medium","Low")' },
        { name: 'Regex Example', type: 'regex', ruleSpec: '[A-Z]{3}-\\d{4}' },
        { name: 'Domain Example', type: 'faker', ruleSpec: 'person.fullName' },
      ];

      const generator = new PairwiseTestDataGenerator();
      const initResult = generator.initializeFromRules(rules);
      expect(initResult.isError).toBe(false);

      const result = generator.generateAllDataRecordsAsRows();
      expect(result.isError).toBe(false);
      expect(result.data.data[0]).toEqual([
        'Literal Example',
        'Enum Example',
        'Enum Example 2',
        'Regex Example',
        'Domain Example',
      ]);
      expect(result.data.data.length).toBeGreaterThan(1);
      assertNoCommonErrorPatternsInRows(result.data.data.slice(1));
    });

    test('should generate domain values for mixed enum+domain pairwise schemas', () => {
      const rules = [
        { name: 'HTTP Method', type: 'enum', ruleSpec: 'enum(GET,POST)' },
        { name: 'Content Type', type: 'enum', ruleSpec: 'enum("application/json","text/plain")' },
        { name: 'Email Address', type: 'domain', ruleSpec: 'internet.email' },
      ];

      const generator = new PairwiseTestDataGenerator(faker);
      const initResult = generator.initializeFromRules(rules);
      expect(initResult.isError).toBe(false);

      const result = generator.generateAllDataRecordsAsRows();
      expect(result.isError).toBe(false);

      const [headers, ...rows] = result.data.data;
      expect(headers).toEqual(['HTTP Method', 'Content Type', 'Email Address']);
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row) => {
        expect(['GET', 'POST']).toContain(row[0]);
        expect(['application/json', 'text/plain']).toContain(row[1]);
        expect(typeof row[2]).toBe('string');
        expect(row[2]).not.toMatch(/^random_Email Address_/);
        expect(row[2]).toContain('@');
      });
      assertNoCommonErrorPatternsInRows(rows);
    });
  });

  describe('Real-world scenarios', () => {
    test('Web application testing scenario', () => {
      const parameters = [
        { name: 'Browser', values: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
        { name: 'OS', values: ['Windows', 'Mac', 'Linux'] },
        { name: 'Resolution', values: ['1920x1080', '1366x768', '1024x768'] },
        { name: 'UserType', values: ['Admin', 'User', 'Guest'] },
      ];

      const generator = new PairwiseGenerator(parameters);
      const dataRecords = generator.generateDataSet();
      const exported = generator.exportDataRecords();

      // Full cartesian: 4x3x3x3 = 108
      console.log('\n=== Web Application Testing Scenario ===');
      console.log(`Full cartesian product: ${4 * 3 * 3 * 3} combinations`);
      console.log(`Pairwise generated: ${dataRecords.length} data records`);
      console.log(`Reduction: ${((1 - dataRecords.length / (4 * 3 * 3 * 3)) * 100).toFixed(1)}%`);

      console.log('\nSample data records:');
      exported.slice(0, 5).forEach((record, i) => {
        console.log(`${i + 1}: ${JSON.stringify(record)}`);
      });

      const stats = generator.getCoverageStats();
      console.log(`\nCoverage: ${stats.coveragePercentage.toFixed(1)}% of ${stats.totalPairs} pairs`);
    });

    test('API testing with different parameters', () => {
      const parameters = [
        { name: 'Method', values: ['GET', 'POST', 'PUT', 'DELETE'] },
        { name: 'ContentType', values: ['JSON', 'XML', 'FormData'] },
        { name: 'Auth', values: ['Bearer', 'Basic', 'None'] },
        { name: 'ResponseCode', values: ['200', '400', '401', '500'] },
      ];

      const generator = new PairwiseGenerator(parameters);
      const dataRecords = generator.generateDataSet();

      console.log('\n=== API Testing Scenario ===');
      console.log(`Generated ${dataRecords.length} data records vs ${4 * 3 * 3 * 4} full cartesian`);

      // Verify critical combinations are present
      const exported = generator.exportDataRecords();
      const hasPostJson = exported.some((rec) => rec.Method === 'POST' && rec.ContentType === 'JSON');
      const hasDeleteAuth = exported.some((rec) => rec.Method === 'DELETE' && rec.Auth === 'Bearer');
      for (const record of exported) {
        assertNoCommonErrorPatternsInValue(record.Method);
        assertNoCommonErrorPatternsInValue(record.ContentType);
        assertNoCommonErrorPatternsInValue(record.Auth);
        assertNoCommonErrorPatternsInValue(record.ResponseCode);
      }

      expect(hasPostJson).toBe(true);
      expect(hasDeleteAuth).toBe(true);
    });
  });
});
