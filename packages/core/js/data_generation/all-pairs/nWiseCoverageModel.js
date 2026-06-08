import { combinations, cartesianProduct, serializeTuple } from './nWiseShared.js';

export class NWiseCoverageModel {
  constructor(parameters, strength) {
    this.parameters = parameters;
    this.strength = strength;
    this.coverageTargets = this.createCoverageTargets();
    this.coverage = this.createCoverageForTargets(this.coverageTargets);
  }

  createCoverageTargets({ parameterLimit = this.parameters.length } = {}) {
    const parameterIndexes = Array.from({ length: parameterLimit }, (_, index) => index);
    const subsets = combinations(parameterIndexes, this.strength);

    return subsets.map((subset) => {
      const tuples = cartesianProduct(subset.map((parameterIndex) => this.parameters[parameterIndex].values)).map(
        (values) => ({
          key: serializeTuple(values),
          values,
        })
      );

      return {
        subset,
        key: serializeTuple(subset),
        tuples,
        tupleKeys: new Set(tuples.map((tuple) => tuple.key)),
      };
    });
  }

  createCoverageForTargets(targets) {
    const coverage = new Map();
    for (const target of targets) {
      coverage.set(target.key, new Set());
    }
    return coverage;
  }

  resetCoverage() {
    this.coverage = this.createCoverageForTargets(this.coverageTargets);
  }

  createRecordFromTuple(tuple) {
    const record = new Map();
    tuple.subset.forEach((parameterIndex, valueIndex) => {
      record.set(this.parameters[parameterIndex].name, tuple.values[valueIndex]);
    });
    return record;
  }

  createDefaultRecord(parameterLimit = this.parameters.length) {
    const record = new Map();
    for (let index = 0; index < parameterLimit; index += 1) {
      record.set(this.parameters[index].name, this.parameters[index].values[0]);
    }
    return record;
  }

  generateFullFactorialRecords(parameterLimit = this.parameters.length) {
    return cartesianProduct(this.parameters.slice(0, parameterLimit).map((parameter) => parameter.values)).map(
      (values) => {
        const record = new Map();
        for (let index = 0; index < parameterLimit; index += 1) {
          record.set(this.parameters[index].name, values[index]);
        }
        for (let index = parameterLimit; index < this.parameters.length; index += 1) {
          record.set(this.parameters[index].name, this.parameters[index].values[0]);
        }
        return record;
      }
    );
  }

  getTotalTargetTupleCount(targets = this.coverageTargets) {
    return targets.reduce((total, target) => total + target.tuples.length, 0);
  }

  getTupleKeyForRecord(record, subset) {
    const values = [];
    for (const parameterIndex of subset) {
      const parameterName = this.parameters[parameterIndex].name;
      if (!record.has(parameterName)) {
        return null;
      }
      values.push(record.get(parameterName));
    }
    return serializeTuple(values);
  }

  calculateCoverageScore(record, targets = this.coverageTargets, coverage = this.coverage) {
    let score = 0;

    for (const target of targets) {
      const tupleKey = this.getTupleKeyForRecord(record, target.subset);
      if (tupleKey && target.tupleKeys.has(tupleKey) && !coverage.get(target.key).has(tupleKey)) {
        score += 1;
      }
    }

    return score;
  }

  updateCoverage(record, targets = this.coverageTargets, coverage = this.coverage) {
    for (const target of targets) {
      const tupleKey = this.getTupleKeyForRecord(record, target.subset);
      if (tupleKey && target.tupleKeys.has(tupleKey)) {
        coverage.get(target.key).add(tupleKey);
      }
    }
  }

  getFirstUncoveredTuple() {
    for (const target of this.coverageTargets) {
      const covered = this.coverage.get(target.key);
      for (const tuple of target.tuples) {
        if (!covered.has(tuple.key)) {
          return {
            subset: target.subset,
            values: tuple.values,
            tupleKey: tuple.key,
            subsetKey: target.key,
          };
        }
      }
    }
    return null;
  }

  isFullyCovered() {
    for (const target of this.coverageTargets) {
      if (this.coverage.get(target.key).size < target.tuples.length) {
        return false;
      }
    }
    return true;
  }

  getCoverageStats(totalRecords) {
    const totalTuples = this.getTotalTargetTupleCount();
    let coveredTuples = 0;

    for (const target of this.coverageTargets) {
      coveredTuples += this.coverage.get(target.key).size;
    }

    return {
      totalTuples,
      coveredTuples,
      coveragePercentage: totalTuples > 0 ? (coveredTuples / totalTuples) * 100 : 100,
      totalRecords,
      strength: this.strength,
    };
  }

  createParameterCoverageSlice(parameterLimit, includedParameterIndex) {
    const targets = this.createCoverageTargets({ parameterLimit }).filter((target) =>
      target.subset.includes(includedParameterIndex)
    );

    return {
      targets,
      coverage: this.createCoverageForTargets(targets),
    };
  }
}
