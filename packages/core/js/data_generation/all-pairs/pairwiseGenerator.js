/**
 * Pairwise Combinatorial Matching Data Generator
 *
 * Generates a minimal data set that ensures every pair of parameter values
 * appears together in at least one data record. Uses a greedy algorithm for
 * efficient set cover approximation.
 *
 * Time Complexity: O(n² × v² × log(pairs))
 * Space Complexity: O(n² × v²)
 * where n = parameters, v = average values per parameter
 */
export class PairwiseGenerator {
  constructor(parameters) {
    this.parameters = parameters; // [{name, values}, ...]
    this.allPairs = new Map(); // Map<string, Set<string>>
    this.dataRecords = [];
    this.coverage = new Map();

    this.initializeAllPairs();
  }

  serializeTuple(first, second) {
    return JSON.stringify([first, second]);
  }

  deserializeTuple(tupleKey) {
    return JSON.parse(tupleKey);
  }

  /**
   * Generate all possible pairs between parameters
   * Creates a map of parameter pairs to all possible value combinations
   */
  initializeAllPairs() {
    for (let i = 0; i < this.parameters.length; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const param1 = this.parameters[i];
        const param2 = this.parameters[j];
        const pairKey = this.serializeTuple(param1.name, param2.name);

        const valuePairs = new Set();
        for (const val1 of param1.values) {
          for (const val2 of param2.values) {
            valuePairs.add(this.serializeTuple(val1, val2));
          }
        }

        this.allPairs.set(pairKey, valuePairs);
        this.coverage.set(pairKey, new Set());
      }
    }
  }

  /**
   * Generate minimal data set using greedy set cover algorithm
   * Returns array of data records where each record is a Map<paramName, value>
   */
  generateDataSet() {
    this.dataRecords = [];
    this.resetCoverage();

    // Continue until all pairs are covered
    while (!this.isFullyCovered()) {
      const bestRecord = this.findBestRecord();
      this.dataRecords.push(bestRecord);
      this.updateCoverage(bestRecord);
    }

    return this.dataRecords;
  }

  /**
   * Find the data record that covers the most uncovered pairs (greedy approach)
   */
  findBestRecord() {
    let bestScore = -1;
    let bestRecord = null;

    // Try all possible combinations of first uncovered pair
    const firstUncoveredPair = this.getFirstUncoveredPair();
    if (!firstUncoveredPair) {
      // Fallback: generate random data record
      return this.generateRandomRecord();
    }

    const baseRecords = this.generateRecordsForPair(firstUncoveredPair);

    for (const baseRecord of baseRecords) {
      // Complete the data record and calculate score
      const completedRecord = this.completeRecord(baseRecord);
      const score = this.calculateCoverageScore(completedRecord);

      if (score > bestScore) {
        bestScore = score;
        bestRecord = completedRecord;
      }
    }

    return bestRecord || this.generateRandomRecord();
  }

  /**
   * Get the first uncovered pair to use as a starting point
   */
  getFirstUncoveredPair() {
    for (const [pairKey, valuePairs] of this.allPairs) {
      const covered = this.coverage.get(pairKey);
      for (const valuePair of valuePairs) {
        if (!covered.has(valuePair)) {
          const [param1, param2] = this.deserializeTuple(pairKey);
          const [val1, val2] = this.deserializeTuple(valuePair);
          return { param1, param2, val1, val2 };
        }
      }
    }
    return null;
  }

  /**
   * Generate all possible data records that cover a specific pair
   */
  generateRecordsForPair({ param1, param2, val1, val2 }) {
    const records = [];
    const baseRecord = new Map();
    baseRecord.set(param1, val1);
    baseRecord.set(param2, val2);
    records.push(baseRecord);
    return records;
  }

  /**
   * Complete a partial data record by filling in missing parameters
   * Uses greedy approach to maximize pair coverage
   */
  completeRecord(partialRecord) {
    const record = new Map(partialRecord);

    // Fill in remaining parameters
    for (const param of this.parameters) {
      if (!record.has(param.name)) {
        let bestValue = param.values[0];
        let bestScore = -1;

        // Try each possible value and pick the one that covers most pairs
        for (const value of param.values) {
          record.set(param.name, value);
          const score = this.calculateCoverageScore(record);
          if (score > bestScore) {
            bestScore = score;
            bestValue = value;
          }
        }

        record.set(param.name, bestValue);
      }
    }

    return record;
  }

  /**
   * Calculate how many new pairs this data record would cover
   */
  calculateCoverageScore(record) {
    let score = 0;

    for (let i = 0; i < this.parameters.length; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const param1 = this.parameters[i];
        const param2 = this.parameters[j];
        const pairKey = this.serializeTuple(param1.name, param2.name);

        const val1 = record.get(param1.name);
        const val2 = record.get(param2.name);
        const valuePair = this.serializeTuple(val1, val2);

        const covered = this.coverage.get(pairKey);
        if (!covered.has(valuePair)) {
          score++;
        }
      }
    }

    return score;
  }

  /**
   * Update coverage tracking after adding a data record
   */
  updateCoverage(record) {
    for (let i = 0; i < this.parameters.length; i++) {
      for (let j = i + 1; j < this.parameters.length; j++) {
        const param1 = this.parameters[i];
        const param2 = this.parameters[j];
        const pairKey = this.serializeTuple(param1.name, param2.name);

        const val1 = record.get(param1.name);
        const val2 = record.get(param2.name);
        const valuePair = this.serializeTuple(val1, val2);

        this.coverage.get(pairKey).add(valuePair);
      }
    }
  }

  /**
   * Check if all pairs are covered
   */
  isFullyCovered() {
    for (const [pairKey, valuePairs] of this.allPairs) {
      const covered = this.coverage.get(pairKey);
      if (covered.size < valuePairs.size) {
        return false;
      }
    }
    return true;
  }

  /**
   * Reset coverage tracking
   */
  resetCoverage() {
    for (const pairKey of this.allPairs.keys()) {
      this.coverage.set(pairKey, new Set());
    }
  }

  /**
   * Generate a random data record (fallback)
   */
  generateRandomRecord() {
    const record = new Map();
    for (const param of this.parameters) {
      const randomIndex = Math.floor(Math.random() * param.values.length);
      record.set(param.name, param.values[randomIndex]);
    }
    return record;
  }

  /**
   * Get coverage statistics
   */
  getCoverageStats() {
    let totalPairs = 0;
    let coveredPairs = 0;

    for (const [pairKey, valuePairs] of this.allPairs) {
      totalPairs += valuePairs.size;
      coveredPairs += this.coverage.get(pairKey).size;
    }

    return {
      totalPairs,
      coveredPairs,
      coveragePercentage: totalPairs > 0 ? (coveredPairs / totalPairs) * 100 : 100,
      totalRecords: this.dataRecords.length,
    };
  }

  /**
   * Export data records as array of objects (for integration with existing data formats)
   */
  exportDataRecords() {
    return this.dataRecords.map((record) => {
      const obj = {};
      for (const [key, value] of record) {
        obj[key] = value;
      }
      return obj;
    });
  }
}
