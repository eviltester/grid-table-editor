import { cartesianProduct } from './nWiseShared.js';
import { NWiseCoverageModel } from './nWiseCoverageModel.js';
import { evaluateConstraint } from '../schema-constraint-evaluator.js';

function createConstrainedCoverageModel(parameters, strength, validRecords) {
  const model = new NWiseCoverageModel(parameters, strength);
  model.coverageTargets = model.coverageTargets
    .map((target) => {
      const tupleKeySet = new Set();
      validRecords.forEach((record) => {
        const tupleKey = model.getTupleKeyForRecord(record, target.subset);
        if (tupleKey) {
          tupleKeySet.add(tupleKey);
        }
      });
      return {
        ...target,
        tuples: target.tuples.filter((tuple) => tupleKeySet.has(tuple.key)),
        tupleKeys: tupleKeySet,
      };
    })
    .filter((target) => target.tupleKeys.size > 0);
  model.coverage = model.createCoverageForTargets(model.coverageTargets);
  return model;
}

function createEnumConstraintRecord(recordMap) {
  const record = {};
  for (const [key, value] of recordMap) {
    record[key] = value;
  }
  return record;
}

function generateValidCombinationRecords(parameters, constraints = []) {
  const parameterValues = parameters.map((parameter) => parameter.values);
  return cartesianProduct(parameterValues)
    .map((values) => {
      const record = new Map();
      for (let index = 0; index < parameters.length; index += 1) {
        record.set(parameters[index].name, values[index]);
      }
      return record;
    })
    .filter((record) =>
      constraints.every((constraint) => evaluateConstraint(constraint, createEnumConstraintRecord(record)))
    );
}

function createCoveredRecordSetFromValidRecords(parameters, strength, constraints = []) {
  const validRecords = generateValidCombinationRecords(parameters, constraints);
  if (validRecords.length === 0) {
    return {
      ok: false,
      error: 'No valid enum combinations satisfy the schema constraints.',
    };
  }

  const model = createConstrainedCoverageModel(parameters, strength, validRecords);
  const selectedRecords = [];

  while (!model.isFullyCovered()) {
    let bestRecord = null;
    let bestScore = -1;
    for (const record of validRecords) {
      const score = model.calculateCoverageScore(record);
      if (score > bestScore) {
        bestScore = score;
        bestRecord = record;
      }
    }
    if (!bestRecord || bestScore <= 0) {
      break;
    }
    selectedRecords.push(bestRecord);
    model.updateCoverage(bestRecord);
  }

  return {
    ok: model.isFullyCovered(),
    error: model.isFullyCovered() ? '' : 'Unable to cover all valid constrained combinations.',
    validRecords,
    selectedRecords,
    model,
  };
}

export { createCoveredRecordSetFromValidRecords };
