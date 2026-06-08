import { createSeededRandom } from './nWiseShared.js';

/**
 * Bach AllPairs-style pairwise generator.
 *
 * This is a JavaScript implementation of the core Allpairs.pl heuristic:
 * sort parameters by value count, build one row at a time, and choose each
 * value by preferring least-used pairings against selected and future columns.
 */
export class BachAllPairsGenerator {
  constructor(parameters, { seed = 1 } = {}) {
    this.originalParameters = parameters;
    this.random = createSeededRandom(seed);
    this.parameters = this.createOrderedParameters(parameters);
    this.pairCounts = new Map();
    this.dataRecords = [];

    this.initializePairCounts();
  }

  createOrderedParameters(parameters) {
    return parameters
      .map((parameter, originalIndex) => ({
        ...parameter,
        originalIndex,
        values: this.shuffleValues(parameter.values),
      }))
      .sort((left, right) => right.values.length - left.values.length || left.originalIndex - right.originalIndex);
  }

  shuffleValues(values) {
    const shuffled = [...values];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(this.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  serializeTuple(first, second) {
    return JSON.stringify([first, second]);
  }

  getPairKey(leftIndex, rightIndex) {
    return `${leftIndex}-${rightIndex}`;
  }

  getPairCount(leftIndex, rightIndex, leftValue, rightValue) {
    const pairCounts = this.pairCounts.get(this.getPairKey(leftIndex, rightIndex));
    return pairCounts?.get(this.serializeTuple(leftValue, rightValue)) ?? 0;
  }

  initializePairCounts() {
    for (let leftIndex = 0; leftIndex < this.parameters.length - 1; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < this.parameters.length; rightIndex += 1) {
        const pairCounts = new Map();
        for (const leftValue of this.parameters[leftIndex].values) {
          for (const rightValue of this.parameters[rightIndex].values) {
            pairCounts.set(this.serializeTuple(leftValue, rightValue), 0);
          }
        }
        this.pairCounts.set(this.getPairKey(leftIndex, rightIndex), pairCounts);
      }
    }
  }

  generateDataSet() {
    this.dataRecords = [];
    this.resetCoverage();

    while (!this.isFullyCovered()) {
      const orderedValues = this.findNextOrderedRow();
      this.dataRecords.push(this.toOriginalOrderRecord(orderedValues));
      this.updateCoverageFromOrderedValues(orderedValues);
    }

    return this.dataRecords;
  }

  findNextOrderedRow() {
    const orderedValues = [];

    for (let parameterIndex = 0; parameterIndex < this.parameters.length; parameterIndex += 1) {
      orderedValues[parameterIndex] = this.selectBestValue(parameterIndex, orderedValues);
    }

    return orderedValues;
  }

  selectBestValue(parameterIndex, orderedValues) {
    let bestValue = this.parameters[parameterIndex].values[0];
    let bestScore = null;

    for (const value of this.parameters[parameterIndex].values) {
      const score = this.calculateChoiceScore(parameterIndex, value, orderedValues);
      if (!bestScore || this.compareScores(score, bestScore) < 0) {
        bestScore = score;
        bestValue = value;
      }
    }

    // TODO: Preserve Bach Allpairs "don't care" metadata for choices that add no new pair coverage.
    return bestValue;
  }

  calculateChoiceScore(parameterIndex, value, orderedValues) {
    const scores = [];

    for (let otherIndex = 0; otherIndex < this.parameters.length; otherIndex += 1) {
      if (otherIndex === parameterIndex) {
        scores.push(0);
      } else if (otherIndex < parameterIndex) {
        scores.push(this.getPairCount(otherIndex, parameterIndex, orderedValues[otherIndex], value));
      } else {
        scores.push(this.getBestFuturePairCount(parameterIndex, otherIndex, value));
      }
    }

    return scores.sort((left, right) => left - right);
  }

  getBestFuturePairCount(parameterIndex, futureIndex, value) {
    let bestCount = Number.POSITIVE_INFINITY;
    for (const futureValue of this.parameters[futureIndex].values) {
      const count = this.getPairCount(parameterIndex, futureIndex, value, futureValue);
      if (count < bestCount) {
        bestCount = count;
      }
    }
    return bestCount === Number.POSITIVE_INFINITY ? 0 : bestCount;
  }

  compareScores(leftScore, rightScore) {
    for (let index = 0; index < Math.max(leftScore.length, rightScore.length); index += 1) {
      const leftValue = leftScore[index] ?? 0;
      const rightValue = rightScore[index] ?? 0;
      if (leftValue !== rightValue) {
        return leftValue - rightValue;
      }
    }
    return 0;
  }

  toOriginalOrderRecord(orderedValues) {
    const orderedByOriginalIndex = this.parameters
      .map((parameter, orderedIndex) => ({
        name: parameter.name,
        value: orderedValues[orderedIndex],
        originalIndex: parameter.originalIndex,
      }))
      .sort((left, right) => left.originalIndex - right.originalIndex);

    const record = new Map();
    for (const assignment of orderedByOriginalIndex) {
      record.set(assignment.name, assignment.value);
    }
    return record;
  }

  updateCoverage(record) {
    const orderedValues = this.parameters.map((parameter) => record.get(parameter.name));
    this.updateCoverageFromOrderedValues(orderedValues);
  }

  updateCoverageFromOrderedValues(orderedValues) {
    for (let leftIndex = 0; leftIndex < this.parameters.length - 1; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < this.parameters.length; rightIndex += 1) {
        const tupleKey = this.serializeTuple(orderedValues[leftIndex], orderedValues[rightIndex]);
        const pairCounts = this.pairCounts.get(this.getPairKey(leftIndex, rightIndex));
        if (pairCounts.has(tupleKey)) {
          pairCounts.set(tupleKey, pairCounts.get(tupleKey) + 1);
        }
      }
    }
  }

  isFullyCovered() {
    for (const pairCounts of this.pairCounts.values()) {
      for (const count of pairCounts.values()) {
        if (count === 0) {
          return false;
        }
      }
    }
    return true;
  }

  resetCoverage() {
    for (const pairCounts of this.pairCounts.values()) {
      for (const tupleKey of pairCounts.keys()) {
        pairCounts.set(tupleKey, 0);
      }
    }
  }

  getCoverageStats() {
    let totalPairs = 0;
    let coveredPairs = 0;

    for (const pairCounts of this.pairCounts.values()) {
      totalPairs += pairCounts.size;
      for (const count of pairCounts.values()) {
        if (count > 0) {
          coveredPairs += 1;
        }
      }
    }

    return {
      totalPairs,
      coveredPairs,
      coveragePercentage: totalPairs > 0 ? (coveredPairs / totalPairs) * 100 : 100,
      totalRecords: this.dataRecords.length,
    };
  }

  exportDataRecords() {
    return this.dataRecords.map((record) => {
      const exportedRecord = {};
      for (const [key, value] of record) {
        exportedRecord[key] = value;
      }
      return exportedRecord;
    });
  }
}
