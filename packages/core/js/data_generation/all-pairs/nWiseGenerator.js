import { NWiseCoverageModel } from './nWiseCoverageModel.js';
import { N_WISE_STRATEGIES } from './nWiseStrategies.js';
import {
  cloneRecords,
  computeMemoryDelta,
  createSeededRandom,
  NWiseAlgorithm,
  readProcessMemoryUsage,
  SUPPORTED_N_WISE_ALGORITHMS,
} from './nWiseShared.js';

export { NWiseAlgorithm };

function createInitialBenchmarkStats({ algorithm, strength, parameters, runs }) {
  return {
    algorithm,
    strength,
    parameterCount: parameters.length,
    valueCounts: parameters.map((parameter) => parameter.values.length),
    rowCount: 0,
    totalTuples: 0,
    coveredTuples: 0,
    coveragePercentage: 0,
    runtimeMs: 0,
    runs,
    heapUsedBeforeBytes: null,
    heapUsedAfterBytes: null,
    heapUsedDeltaBytes: null,
    rssBeforeBytes: null,
    rssAfterBytes: null,
    rssDeltaBytes: null,
  };
}

function createMeasurementSnapshot() {
  return {
    startedAtMs: Date.now(),
    memoryBefore: readProcessMemoryUsage(),
  };
}

function completeMeasurementSnapshot(snapshot) {
  const memoryAfter = readProcessMemoryUsage();
  return {
    runtimeMs: Date.now() - snapshot.startedAtMs,
    memoryBefore: snapshot.memoryBefore,
    memoryAfter,
  };
}

/**
 * N-wise combinatorial matching generator.
 *
 * The generator acts as the application service for multiple covering-array
 * strategies. Coverage bookkeeping lives in NWiseCoverageModel and each
 * algorithm stays isolated behind N_WISE_STRATEGIES.
 */
export class NWiseGenerator {
  constructor(parameters, options = {}) {
    this.parameters = this.validateParameters(parameters);
    this.options = {
      strength: 2,
      algorithm: NWiseAlgorithm.GREEDY,
      seed: 1,
      candidateCount: 20,
      runs: 1,
      ...options,
    };
    this.strength = this.validateStrength(this.options.strength);
    this.algorithm = this.validateAlgorithm(this.options.algorithm);
    this.seed = Number.isInteger(this.options.seed) ? this.options.seed : 1;
    this.candidateCount = Math.max(1, Number.parseInt(this.options.candidateCount, 10) || 20);
    this.runs = Math.max(1, Number.parseInt(this.options.runs, 10) || 1);
    this.random = createSeededRandom(this.seed);
    this.model = new NWiseCoverageModel(this.parameters, this.strength);
    this.dataRecords = [];
    this.benchmarkStats = {
      ...createInitialBenchmarkStats({
        algorithm: this.algorithm,
        strength: this.strength,
        parameters: this.parameters,
        runs: this.algorithm === NWiseAlgorithm.AETG ? this.runs : 1,
      }),
      totalTuples: this.model.getTotalTargetTupleCount(),
    };
  }

  validateParameters(parameters) {
    if (!Array.isArray(parameters) || parameters.length === 0) {
      throw new Error('NWiseGenerator requires at least one parameter.');
    }

    const names = new Set();
    return parameters.map((parameter, index) => {
      const name = String(parameter?.name || '').trim();
      if (!name) {
        throw new Error(`NWiseGenerator parameter at index ${index} requires a name.`);
      }
      if (names.has(name)) {
        throw new Error(`NWiseGenerator parameter names must be unique: ${name}`);
      }
      names.add(name);

      if (!Array.isArray(parameter?.values) || parameter.values.length === 0) {
        throw new Error(`NWiseGenerator parameter "${name}" requires at least one value.`);
      }

      return {
        name,
        values: [...parameter.values],
      };
    });
  }

  validateStrength(strength) {
    if (!Number.isInteger(strength)) {
      throw new Error('NWiseGenerator strength must be an integer.');
    }
    if (strength < 1) {
      throw new Error('NWiseGenerator strength must be at least 1.');
    }
    if (strength > this.parameters.length) {
      throw new Error('NWiseGenerator strength cannot exceed the number of parameters.');
    }
    return strength;
  }

  validateAlgorithm(algorithm) {
    if (!SUPPORTED_N_WISE_ALGORITHMS.has(algorithm)) {
      throw new Error(`Unsupported n-wise algorithm: ${algorithm}`);
    }
    return algorithm;
  }

  resetRunState(seedOffset = 0) {
    this.random = createSeededRandom(this.seed + seedOffset);
    this.dataRecords = [];
    this.model.resetCoverage();
  }

  createStrategyContext() {
    return {
      algorithm: this.algorithm,
      strength: this.strength,
      parameters: this.parameters,
      candidateCount: this.candidateCount,
      random: this.random,
      model: this.model,
      dataRecords: this.dataRecords,
    };
  }

  executeStrategyRun(seedOffset = 0) {
    this.resetRunState(seedOffset);

    if (this.strength === this.parameters.length) {
      this.dataRecords = this.model.generateFullFactorialRecords(this.parameters.length);
      this.model.resetCoverage();
      for (const record of this.dataRecords) {
        this.model.updateCoverage(record);
      }
      return this.dataRecords;
    }

    const strategy = N_WISE_STRATEGIES[this.algorithm];
    if (!strategy) {
      throw new Error(`Unsupported n-wise algorithm: ${this.algorithm}`);
    }

    const context = this.createStrategyContext();
    strategy(context);
    this.dataRecords = context.dataRecords;
    return this.dataRecords;
  }

  generateDataSet() {
    const snapshot = createMeasurementSnapshot();

    if (this.algorithm === NWiseAlgorithm.AETG && this.runs > 1 && this.strength !== this.parameters.length) {
      this.generateBestAetgRun();
    } else {
      this.executeStrategyRun();
    }

    this.updateBenchmarkStats(completeMeasurementSnapshot(snapshot));
    return this.dataRecords;
  }

  generateBestAetgRun() {
    let bestRecords = null;
    let bestStats = null;

    for (let runIndex = 0; runIndex < this.runs; runIndex += 1) {
      this.executeStrategyRun(runIndex);
      const stats = this.getCoverageStats();

      if (
        !bestRecords ||
        stats.coveredTuples > bestStats.coveredTuples ||
        (stats.coveredTuples === bestStats.coveredTuples && this.dataRecords.length < bestRecords.length)
      ) {
        bestRecords = cloneRecords(this.dataRecords);
        bestStats = stats;
      }
    }

    this.dataRecords = bestRecords || [];
    this.model.resetCoverage();
    for (const record of this.dataRecords) {
      this.model.updateCoverage(record);
    }
  }

  getCoverageStats() {
    return {
      ...this.model.getCoverageStats(this.dataRecords.length),
      algorithm: this.algorithm,
    };
  }

  updateBenchmarkStats(measurement) {
    const stats = this.getCoverageStats();

    this.benchmarkStats = {
      algorithm: this.algorithm,
      strength: this.strength,
      parameterCount: this.parameters.length,
      valueCounts: this.parameters.map((parameter) => parameter.values.length),
      rowCount: this.dataRecords.length,
      totalTuples: stats.totalTuples,
      coveredTuples: stats.coveredTuples,
      coveragePercentage: stats.coveragePercentage,
      runtimeMs: measurement.runtimeMs,
      runs: this.algorithm === NWiseAlgorithm.AETG ? this.runs : 1,
      heapUsedBeforeBytes: measurement.memoryBefore?.heapUsed ?? null,
      heapUsedAfterBytes: measurement.memoryAfter?.heapUsed ?? null,
      heapUsedDeltaBytes: computeMemoryDelta(measurement.memoryBefore, measurement.memoryAfter, 'heapUsed'),
      rssBeforeBytes: measurement.memoryBefore?.rss ?? null,
      rssAfterBytes: measurement.memoryAfter?.rss ?? null,
      rssDeltaBytes: computeMemoryDelta(measurement.memoryBefore, measurement.memoryAfter, 'rss'),
    };
  }

  getBenchmarkStats() {
    return { ...this.benchmarkStats };
  }

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
