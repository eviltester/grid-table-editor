import { NWiseCoverageModel } from '../../packages/core/js/data_generation/n-wise/nWiseCoverageModel.js';
import { EXPERIMENTAL_N_WISE_STRATEGIES } from './experimentalNWiseStrategies.js';
import {
  cloneRecords,
  computeMemoryDelta,
  createSeededRandom,
  ExperimentalNWiseAlgorithm,
  readProcessMemoryUsage,
  SUPPORTED_EXPERIMENTAL_N_WISE_ALGORITHMS,
} from './experimentalNWiseShared.js';

export { ExperimentalNWiseAlgorithm };

function createInitialBenchmarkStats({ algorithm, strength, parameters }) {
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
    runs: 1,
    heapUsedBeforeBytes: null,
    heapUsedAfterBytes: null,
    heapUsedDeltaBytes: null,
    rssBeforeBytes: null,
    rssAfterBytes: null,
    rssDeltaBytes: null,
    rowsGeneratedByGraphPhase: 0,
    rowsGeneratedByFallback: 0,
    lookaheadEvaluations: 0,
    candidateEvaluations: 0,
    seedEdgesConsidered: 0,
    phaseSwitchRow: null,
  };
}

function createStrategyBenchmarkDetails() {
  return {
    rowsGeneratedByGraphPhase: 0,
    rowsGeneratedByFallback: 0,
    lookaheadEvaluations: 0,
    candidateEvaluations: 0,
    seedEdgesConsidered: 0,
    phaseSwitchRow: null,
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

export class ExperimentalNWiseGenerator {
  constructor(parameters, options = {}) {
    this.parameters = this.validateParameters(parameters);
    this.options = {
      strength: 2,
      algorithm: ExperimentalNWiseAlgorithm.MULTIPARTITE_GRAPH_WALK,
      seed: 1,
      candidateCount: 20,
      ...options,
    };
    this.strength = this.validateStrength(this.options.strength);
    this.algorithm = this.validateAlgorithm(this.options.algorithm);
    this.seed = Number.isInteger(this.options.seed) ? this.options.seed : 1;
    this.candidateCount = Math.max(1, Number.parseInt(this.options.candidateCount, 10) || 20);
    this.random = createSeededRandom(this.seed);
    this.model = new NWiseCoverageModel(this.parameters, this.strength);
    this.dataRecords = [];
    this.strategyBenchmarkDetails = createStrategyBenchmarkDetails();
    this.benchmarkStats = {
      ...createInitialBenchmarkStats({
        algorithm: this.algorithm,
        strength: this.strength,
        parameters: this.parameters,
      }),
      totalTuples: this.model.getTotalTargetTupleCount(),
    };
  }

  validateParameters(parameters) {
    if (!Array.isArray(parameters) || parameters.length === 0) {
      throw new Error('ExperimentalNWiseGenerator requires at least one parameter.');
    }

    const names = new Set();
    return parameters.map((parameter, index) => {
      const name = String(parameter?.name || '').trim();
      if (!name) {
        throw new Error(`ExperimentalNWiseGenerator parameter at index ${index} requires a name.`);
      }
      if (names.has(name)) {
        throw new Error(`ExperimentalNWiseGenerator parameter names must be unique: ${name}`);
      }
      names.add(name);

      if (!Array.isArray(parameter?.values) || parameter.values.length === 0) {
        throw new Error(`ExperimentalNWiseGenerator parameter "${name}" requires at least one value.`);
      }

      return {
        name,
        values: [...parameter.values],
      };
    });
  }

  validateStrength(strength) {
    if (!Number.isInteger(strength)) {
      throw new Error('ExperimentalNWiseGenerator strength must be an integer.');
    }
    if (strength < 1) {
      throw new Error('ExperimentalNWiseGenerator strength must be at least 1.');
    }
    if (strength > this.parameters.length) {
      throw new Error('ExperimentalNWiseGenerator strength cannot exceed the number of parameters.');
    }
    return strength;
  }

  validateAlgorithm(algorithm) {
    if (!SUPPORTED_EXPERIMENTAL_N_WISE_ALGORITHMS.has(algorithm)) {
      throw new Error(`Unsupported experimental n-wise algorithm: ${algorithm}`);
    }
    return algorithm;
  }

  resetRunState() {
    this.random = createSeededRandom(this.seed);
    this.dataRecords = [];
    this.model.resetCoverage();
    this.strategyBenchmarkDetails = createStrategyBenchmarkDetails();
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
      benchmarkDetails: this.strategyBenchmarkDetails,
    };
  }

  executeStrategyRun() {
    this.resetRunState();

    if (this.strength === this.parameters.length) {
      this.dataRecords = this.model.generateFullFactorialRecords(this.parameters.length);
      this.model.resetCoverage();
      for (const record of this.dataRecords) {
        this.model.updateCoverage(record);
      }
      return this.dataRecords;
    }

    const strategy = EXPERIMENTAL_N_WISE_STRATEGIES[this.algorithm];
    if (!strategy) {
      throw new Error(`Unsupported experimental n-wise algorithm: ${this.algorithm}`);
    }

    const context = this.createStrategyContext();
    strategy(context);
    this.dataRecords = context.dataRecords;
    return this.dataRecords;
  }

  generateDataSet() {
    const snapshot = createMeasurementSnapshot();
    this.executeStrategyRun();
    this.updateBenchmarkStats(completeMeasurementSnapshot(snapshot));
    return this.dataRecords;
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
      runs: 1,
      heapUsedBeforeBytes: measurement.memoryBefore?.heapUsed ?? null,
      heapUsedAfterBytes: measurement.memoryAfter?.heapUsed ?? null,
      heapUsedDeltaBytes: computeMemoryDelta(measurement.memoryBefore, measurement.memoryAfter, 'heapUsed'),
      rssBeforeBytes: measurement.memoryBefore?.rss ?? null,
      rssAfterBytes: measurement.memoryAfter?.rss ?? null,
      rssDeltaBytes: computeMemoryDelta(measurement.memoryBefore, measurement.memoryAfter, 'rss'),
      rowsGeneratedByGraphPhase: this.strategyBenchmarkDetails.rowsGeneratedByGraphPhase,
      rowsGeneratedByFallback: this.strategyBenchmarkDetails.rowsGeneratedByFallback,
      lookaheadEvaluations: this.strategyBenchmarkDetails.lookaheadEvaluations,
      candidateEvaluations: this.strategyBenchmarkDetails.candidateEvaluations,
      seedEdgesConsidered: this.strategyBenchmarkDetails.seedEdgesConsidered,
      phaseSwitchRow: this.strategyBenchmarkDetails.phaseSwitchRow,
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

export function cloneExperimentalRecords(records) {
  return cloneRecords(records);
}
