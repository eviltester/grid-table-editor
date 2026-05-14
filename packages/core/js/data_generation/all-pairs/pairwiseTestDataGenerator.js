import { PairwiseGenerator } from './pairwiseGenerator.js';
import { dataResponse, errorResponse } from '../ruleResponse.js';
import { EnumParser } from '../utils/enumParser.js';

/**
 * Pairwise Matching Data Generator
 * Integrates pairwise combinatorial matching with the existing rules-based data generation system
 */
export class PairwiseTestDataGenerator {
  constructor(faker = null, RandExp = null, options = {}) {
    this.options = {
      enableLogging: false,
      ...options,
    };
    this.pairwiseGenerator = null;
    this.dataRecords = [];
    this.currentRecordIndex = 0;
    this.orderedRules = [];
    this.enumRules = []; // Rules that participate in pairwise combinations
    this.nonEnumRules = []; // Rules that generate random values per row

    // Store generators for non-enum rule generation
    this.faker = faker;
    this.RandExp = RandExp;

    // Initialize generators if available
    if (faker) {
      this.fakerGenerator = this.createFakerGenerator();
    }
    if (RandExp) {
      this.randExpGenerator = this.createRandExpGenerator();
    }
  }

  /**
   * Initialize pairwise generation from rules
   * Only ENUM rules participate in pairwise combinations
   * Other rule types generate random values per row
   */
  initializeFromRules(rules) {
    try {
      this.orderedRules = [...rules];
      // Separate enum rules from non-enum rules in a single iteration
      const { enumRules, nonEnumRules } = rules.reduce(
        (acc, rule) => {
          if (rule.isType('enum')) {
            acc.enumRules.push(rule);
          } else {
            acc.nonEnumRules.push(rule);
          }
          return acc;
        },
        { enumRules: [], nonEnumRules: [] }
      );

      this.enumRules = enumRules;
      this.nonEnumRules = nonEnumRules;

      if (this.enumRules.length < 2) {
        return errorResponse('Pairwise testing requires at least 2 ENUM parameters');
      }

      // Convert only enum rules to pairwise parameters
      const parameters = this.convertEnumRulesToParameters(this.enumRules);

      this.pairwiseGenerator = new PairwiseGenerator(parameters);
      const enumCombinations = this.pairwiseGenerator.generateDataSet();

      // Generate complete data records by adding random values for non-enum rules
      this.dataRecords = this.generateCompleteDataRecords(enumCombinations);
      this.currentRecordIndex = 0;

      if (this.options.enableLogging) {
        const stats = this.pairwiseGenerator.getCoverageStats();
        console.log(
          `Generated ${this.dataRecords.length} data records with ${stats.coveragePercentage.toFixed(1)}% pairwise coverage`
        );
      }

      return dataResponse(`Generated ${this.dataRecords.length} pairwise data records`);
    } catch (error) {
      return errorResponse(error.message);
    }
  }

  /**
   * Convert ENUM rules to AllPairs parameter format
   * Only processes ENUM rule types for pairwise combinations
   */
  convertEnumRulesToParameters(enumRules) {
    const parameters = [];

    for (const rule of enumRules) {
      const param = {
        name: rule.name,
        values: EnumParser.extractEnumValues(rule.ruleSpec),
      };

      if (param.values.length > 0) {
        parameters.push(param);
      }
    }

    return parameters;
  }

  /**
   * Create a faker generator helper
   */
  createFakerGenerator() {
    if (!this.faker) return null;

    // Create a simple generator that uses faker
    return {
      generateFrom: (rule) => {
        try {
          const parts = rule.ruleSpec.split('.');
          let fakerFunction = this.faker;

          for (const part of parts) {
            if (fakerFunction && fakerFunction[part]) {
              fakerFunction = fakerFunction[part];
            } else {
              return { isError: true, errorMessage: `Faker function not found: ${rule.ruleSpec}` };
            }
          }

          if (typeof fakerFunction === 'function') {
            return { data: fakerFunction.call(this.faker), isError: false };
          }

          return { isError: true, errorMessage: `${rule.ruleSpec} is not a function` };
        } catch (error) {
          return { isError: true, errorMessage: error.message };
        }
      },
    };
  }

  /**
   * Create a regex generator helper
   */
  createRandExpGenerator() {
    if (!this.RandExp) return null;

    return {
      generateFrom: (rule) => {
        try {
          const randExp = new this.RandExp(rule.ruleSpec);
          return { data: randExp.gen(), isError: false };
        } catch (error) {
          return { isError: true, errorMessage: error.message };
        }
      },
    };
  }

  /**
   * Generate complete data records by combining enum pairs with random values
   * for non-enum rules
   */
  generateCompleteDataRecords(enumCombinations) {
    return enumCombinations.map((enumRecord) => {
      const completeRecord = {};

      // Preserve original schema order across enum and non-enum columns.
      for (const rule of this.orderedRules) {
        if (rule.isType('enum')) {
          completeRecord[rule.name] = enumRecord.get(rule.name);
        } else {
          completeRecord[rule.name] = this.generateRandomValueForRule(rule);
        }
      }

      return completeRecord;
    });
  }

  /**
   * Generate a random value for a non-enum rule
   */
  generateRandomValueForRule(rule) {
    switch (rule.type) {
      case 'literal':
        return rule.ruleSpec;

      case 'boolean':
        return Math.random() < 0.5 ? 'true' : 'false';

      case 'faker':
        return this.generateFakerValue(rule);

      case 'regex':
        return this.generateRegexValue(rule);

      default:
        return `random_${rule.name}_${Math.floor(Math.random() * 1000)}`;
    }
  }

  /**
   * Generate a value using faker.js
   */
  generateFakerValue(rule) {
    try {
      // Use the same generator logic as the regular test data generator
      if (this.fakerGenerator) {
        const result = this.fakerGenerator.generateFrom(rule);
        return result.data ?? rule.ruleSpec;
      }

      // Fallback: try to execute faker command directly
      const parts = rule.ruleSpec.split('.');
      if (parts.length >= 2 && this.faker) {
        let fakerFunction = this.faker;
        for (const part of parts) {
          if (fakerFunction && fakerFunction[part]) {
            fakerFunction = fakerFunction[part];
          } else {
            return `faker_${rule.ruleSpec}_${Math.floor(Math.random() * 1000)}`;
          }
        }

        if (typeof fakerFunction === 'function') {
          return fakerFunction.call(this.faker);
        }
      }

      return `faker_${rule.ruleSpec}_${Math.floor(Math.random() * 1000)}`;
    } catch (error) {
      return `faker_${rule.ruleSpec}_${Math.floor(Math.random() * 1000)}`;
    }
  }

  /**
   * Generate a value using regex
   */
  generateRegexValue(rule) {
    try {
      if (this.randExpGenerator) {
        const result = this.randExpGenerator.generateFrom(rule);
        return result.data ?? rule.ruleSpec;
      }

      // Fallback: try to use RandExp directly
      if (this.RandExp) {
        const randExp = new this.RandExp(rule.ruleSpec);
        return randExp.gen();
      }

      return `regex_match_${Math.floor(Math.random() * 1000)}`;
    } catch (error) {
      return `regex_match_${Math.floor(Math.random() * 1000)}`;
    }
  }

  /**
   * Generate a specific data record by index
   */
  generateDataRecord(index) {
    if (!this.dataRecords || !Number.isInteger(index) || index < 0 || index >= this.dataRecords.length) {
      return errorResponse('No pairwise data records available');
    }

    const record = this.dataRecords[index];
    return dataResponse({
      recordIndex: index,
      totalRecords: this.dataRecords.length,
      dataRecord: record,
    });
  }

  /**
   * Generate next data record in sequence
   */
  generateNextDataRecord() {
    if (this.currentRecordIndex >= this.dataRecords.length) {
      this.currentRecordIndex = 0; // Wrap around
    }

    const result = this.generateDataRecord(this.currentRecordIndex);
    this.currentRecordIndex++;
    return result;
  }

  /**
   * Generate all data records as data rows (compatible with existing system)
   */
  generateAllDataRecordsAsRows() {
    if (!this.pairwiseGenerator) {
      return errorResponse('Pairwise generator not initialized');
    }

    const headers = this.orderedRules.map((rule) => rule.name);

    const rows = [headers]; // First row is headers
    for (const record of this.dataRecords) {
      const row = headers.map((header) => record[header] ?? '');
      rows.push(row);
    }

    return dataResponse({
      data: rows,
      stats: this.pairwiseGenerator.getCoverageStats(),
    });
  }

  /**
   * Check if pairwise generation is available for the given rules
   * Requires at least 2 ENUM rules for pairwise combinations
   */
  canGeneratePairwise(rules) {
    const enumRules = rules.filter((rule) => rule.isType('enum'));
    return enumRules.length >= 2;
  }

  /**
   * Get coverage and generation statistics
   */
  getStats() {
    if (!this.pairwiseGenerator) {
      return { available: false };
    }

    return {
      available: true,
      ...this.pairwiseGenerator.getCoverageStats(),
    };
  }
}
