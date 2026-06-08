import { pickRandom, shuffleItems } from './nWiseShared.js';

function completeRecord(model, parameters, partialRecord) {
  const record = new Map(partialRecord);

  for (const parameter of parameters) {
    if (record.has(parameter.name)) {
      continue;
    }

    let bestValue = parameter.values[0];
    let bestScore = -1;

    for (const value of parameter.values) {
      record.set(parameter.name, value);
      const score = model.calculateCoverageScore(record);
      if (score > bestScore) {
        bestScore = score;
        bestValue = value;
      }
    }

    record.set(parameter.name, bestValue);
  }

  return record;
}

function completeRecordInRandomOrder(model, parameters, partialRecord, random) {
  const record = new Map(partialRecord);
  const remaining = shuffleItems(
    parameters.filter((parameter) => !record.has(parameter.name)),
    random
  );

  for (const parameter of remaining) {
    let bestValues = [];
    let bestScore = -1;

    for (const value of parameter.values) {
      record.set(parameter.name, value);
      const score = model.calculateCoverageScore(record);
      if (score > bestScore) {
        bestScore = score;
        bestValues = [value];
      } else if (score === bestScore) {
        bestValues.push(value);
      }
    }

    record.set(parameter.name, pickRandom(bestValues, random) ?? parameter.values[0]);
  }

  return record;
}

function selectMostOpenTarget(model, random) {
  let bestTargets = [];
  let bestOpenCount = -1;

  for (const target of model.coverageTargets) {
    const openCount = target.tuples.length - model.coverage.get(target.key).size;
    if (openCount > bestOpenCount) {
      bestOpenCount = openCount;
      bestTargets = [target];
    } else if (openCount === bestOpenCount && openCount > 0) {
      bestTargets.push(target);
    }
  }

  return pickRandom(bestTargets, random) ?? null;
}

function selectRandomOpenTuple(model, target, random) {
  if (!target) {
    return null;
  }

  const openTuples = target.tuples.filter((tuple) => !model.coverage.get(target.key).has(tuple.key));
  const tuple = pickRandom(openTuples, random);

  return tuple
    ? {
        subset: target.subset,
        values: tuple.values,
        tupleKey: tuple.key,
        subsetKey: target.key,
      }
    : null;
}

function generateGreedyRecords(context) {
  const { model, dataRecords } = context;

  while (!model.isFullyCovered()) {
    const uncovered = model.getFirstUncoveredTuple();
    if (!uncovered) {
      break;
    }

    const record = completeRecord(model, context.parameters, model.createRecordFromTuple(uncovered));
    dataRecords.push(record);
    model.updateCoverage(record);
  }
}

function selectBestPictBinding(context, record) {
  let bestBindings = [];
  let bestScore = -1;

  for (const parameter of context.parameters) {
    if (record.has(parameter.name)) {
      continue;
    }

    for (const value of parameter.values) {
      record.set(parameter.name, value);
      const score = context.model.calculateCoverageScore(record);
      record.delete(parameter.name);

      if (score > bestScore) {
        bestScore = score;
        bestBindings = [{ parameter, value }];
      } else if (score === bestScore) {
        bestBindings.push({ parameter, value });
      }
    }
  }

  return pickRandom(bestBindings, context.random);
}

function generatePictGcdRecords(context) {
  const { model, dataRecords } = context;

  while (!model.isFullyCovered()) {
    let record = new Map();

    while (record.size < context.parameters.length) {
      if (record.size === 0) {
        const seedTuple = selectRandomOpenTuple(model, selectMostOpenTarget(model, context.random), context.random);
        if (!seedTuple) {
          break;
        }
        record = model.createRecordFromTuple(seedTuple);
      } else {
        const bestBinding = selectBestPictBinding(context, record);
        if (!bestBinding) {
          break;
        }
        record.set(bestBinding.parameter.name, bestBinding.value);
      }
    }

    record = completeRecord(model, context.parameters, record);
    dataRecords.push(record);
    model.updateCoverage(record);
  }
}

function generateAetgRecords(context) {
  const { model, dataRecords, candidateCount, random } = context;

  while (!model.isFullyCovered()) {
    let bestCandidate = null;
    let bestScore = -1;

    for (let candidateIndex = 0; candidateIndex < candidateCount; candidateIndex += 1) {
      const seedTuple = selectRandomOpenTuple(model, selectMostOpenTarget(model, random), random);
      if (!seedTuple) {
        break;
      }

      const candidate = completeRecordInRandomOrder(
        model,
        context.parameters,
        model.createRecordFromTuple(seedTuple),
        random
      );
      const score = model.calculateCoverageScore(candidate);

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate) {
      break;
    }

    dataRecords.push(bestCandidate);
    model.updateCoverage(bestCandidate);
  }
}

function generateIpogRecords(context) {
  const { model } = context;
  let activeParameterCount = context.strength;
  context.dataRecords = model.generateFullFactorialRecords(activeParameterCount);

  for (let parameterIndex = activeParameterCount; parameterIndex < context.parameters.length; parameterIndex += 1) {
    activeParameterCount = parameterIndex + 1;
    const slice = model.createParameterCoverageSlice(activeParameterCount, parameterIndex);

    for (const record of context.dataRecords) {
      let bestValue = context.parameters[parameterIndex].values[0];
      let bestScore = -1;

      for (const value of context.parameters[parameterIndex].values) {
        record.set(context.parameters[parameterIndex].name, value);
        const score = model.calculateCoverageScore(record, slice.targets, slice.coverage);
        if (score > bestScore) {
          bestScore = score;
          bestValue = value;
        }
      }

      record.set(context.parameters[parameterIndex].name, bestValue);
      model.updateCoverage(record, slice.targets, slice.coverage);
    }

    for (const target of slice.targets) {
      const covered = slice.coverage.get(target.key);
      for (const tuple of target.tuples) {
        if (covered.has(tuple.key)) {
          continue;
        }

        const record = model.createDefaultRecord(activeParameterCount);
        target.subset.forEach((targetParameterIndex, valueIndex) => {
          record.set(context.parameters[targetParameterIndex].name, tuple.values[valueIndex]);
        });
        context.dataRecords.push(record);
        model.updateCoverage(record, slice.targets, slice.coverage);
      }
    }
  }

  model.resetCoverage();
  for (const record of context.dataRecords) {
    model.updateCoverage(record);
  }
}

export const N_WISE_STRATEGIES = Object.freeze({
  greedy: generateGreedyRecords,
  'pict-gcd': generatePictGcdRecords,
  aetg: generateAetgRecords,
  ipog: generateIpogRecords,
});
