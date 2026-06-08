import { PairwiseGenerator } from './pairwiseGenerator.js';
import { NWiseAlgorithm, NWiseGenerator } from './nWiseGenerator.js';
import { dataResponse, errorResponse } from '../ruleResponse.js';
import { EnumParser } from '../utils/enumParser.js';
import { PairwiseTestDataGenerator } from './pairwiseTestDataGenerator.js';

export const CombinationAlgorithm = Object.freeze({
  PAIRWISE: 'pairwise',
  ...NWiseAlgorithm,
});

export const SUPPORTED_COMBINATION_ALGORITHMS = new Set(Object.values(CombinationAlgorithm));

export class CombinationsTestDataGenerator extends PairwiseTestDataGenerator {
  constructor(faker = null, RandExp = null, options = {}) {
    super(faker, RandExp, options);
    this.combinationGenerator = null;
    this.combinationOptions = {
      strength: 2,
      algorithm: CombinationAlgorithm.PAIRWISE,
      seed: 1,
      candidateCount: 20,
      runs: 1,
    };
  }

  initializeFromRules(rules, options = {}) {
    this.resetGenerationState();
    this.combinationGenerator = null;
    this.combinationOptions = {
      ...this.combinationOptions,
      ...options,
      strength: Number.parseInt(options.strength ?? this.combinationOptions.strength, 10),
      algorithm: options.algorithm || this.combinationOptions.algorithm,
    };

    try {
      this.orderedRules = [...rules];
      const { enumRules, nonEnumRules } = rules.reduce(
        (acc, rule) => {
          if (this.isRuleType(rule, 'enum')) {
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

      if (!SUPPORTED_COMBINATION_ALGORITHMS.has(this.combinationOptions.algorithm)) {
        return errorResponse(`Unsupported combination generation algorithm: ${this.combinationOptions.algorithm}`);
      }
      if (!Number.isInteger(this.combinationOptions.strength) || this.combinationOptions.strength < 2) {
        return errorResponse('Combination generation strength must be an integer of at least 2');
      }
      if (this.enumRules.length < this.combinationOptions.strength) {
        return errorResponse(
          `Combination generation strength ${this.combinationOptions.strength} requires at least ${this.combinationOptions.strength} ENUM parameters`
        );
      }
      if (
        this.combinationOptions.algorithm === CombinationAlgorithm.PAIRWISE &&
        this.combinationOptions.strength !== 2
      ) {
        return errorResponse('The current pairwise implementation only supports strength 2');
      }

      const parameters = this.convertEnumRulesToParameters(this.enumRules);
      const enumCombinations = this.generateEnumCombinations(parameters);

      this.dataRecords = this.generateCompleteDataRecords(enumCombinations);
      this.currentRecordIndex = 0;

      return dataResponse(`Generated ${this.dataRecords.length} combination data records`);
    } catch (error) {
      return errorResponse(error.message);
    }
  }

  resetGenerationState() {
    super.resetGenerationState();
    this.combinationGenerator = null;
  }

  generateEnumCombinations(parameters) {
    if (this.combinationOptions.algorithm === CombinationAlgorithm.PAIRWISE) {
      this.pairwiseGenerator = new PairwiseGenerator(parameters);
      this.combinationGenerator = this.pairwiseGenerator;
      return this.pairwiseGenerator.generateDataSet();
    }

    this.combinationGenerator = new NWiseGenerator(parameters, {
      strength: this.combinationOptions.strength,
      algorithm: this.combinationOptions.algorithm,
      seed: this.combinationOptions.seed,
      candidateCount: this.combinationOptions.candidateCount,
      runs: this.combinationOptions.runs,
    });
    this.combinationGenerator.generateDataSet();
    return this.combinationGenerator.dataRecords;
  }

  convertEnumRulesToParameters(enumRules) {
    return enumRules
      .map((rule) => ({
        name: rule.name,
        values: EnumParser.extractEnumValues(rule.ruleSpec),
      }))
      .filter((parameter) => parameter.values.length > 0);
  }

  generateAllDataRecordsAsRows() {
    if (!this.combinationGenerator) {
      return errorResponse('Combination generator not initialized');
    }

    const headers = this.orderedRules.map((rule) => rule.name);
    const rows = [headers];
    for (const record of this.dataRecords) {
      rows.push(headers.map((header) => record[header] ?? ''));
    }

    return dataResponse({
      data: rows,
      stats: this.getStats(),
    });
  }

  getStats() {
    if (!this.combinationGenerator) {
      return { available: false };
    }

    return {
      available: true,
      algorithm: this.combinationOptions.algorithm,
      strength: this.combinationOptions.strength,
      ...this.combinationGenerator.getCoverageStats(),
    };
  }
}
