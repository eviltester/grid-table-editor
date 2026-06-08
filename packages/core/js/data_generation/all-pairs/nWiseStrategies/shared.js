import { pickRandom, shuffleItems } from '../nWiseShared.js';

export function completeRecord(model, parameters, partialRecord) {
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

export function completeRecordInRandomOrder(model, parameters, partialRecord, random) {
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

export function selectMostOpenTarget(model, random) {
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

export function selectRandomOpenTuple(model, target, random) {
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

export function createVertexId(vertex) {
  return `${vertex.parameterIndex}:${vertex.value}`;
}

export function hydrateVertex(parameters, parameterIndex, value) {
  return {
    parameterIndex,
    parameterName: parameters[parameterIndex].name,
    value,
  };
}

export function getUncoveredTuplesWithVertices(context) {
  const tuples = [];

  for (const target of context.model.coverageTargets) {
    const covered = context.model.coverage.get(target.key);
    for (const tuple of target.tuples) {
      if (covered.has(tuple.key)) {
        continue;
      }

      tuples.push({
        subset: target.subset,
        values: tuple.values,
        tupleKey: tuple.key,
        subsetKey: target.key,
        vertices: target.subset.map((parameterIndex, valueIndex) =>
          hydrateVertex(context.parameters, parameterIndex, tuple.values[valueIndex])
        ),
      });
    }
  }

  return tuples;
}

export function pickBestGraphVertex(vertices, scoreLookup, random) {
  let bestVertices = [];
  let bestScore = -1;

  for (const vertex of vertices) {
    const score = scoreLookup(vertex);
    if (score > bestScore) {
      bestScore = score;
      bestVertices = [vertex];
    } else if (score === bestScore) {
      bestVertices.push(vertex);
    }
  }

  return pickRandom(bestVertices, random) ?? null;
}

export function createRecordFromVertices(context, vertices) {
  const record = new Map();
  for (const vertex of vertices) {
    record.set(context.parameters[vertex.parameterIndex].name, vertex.value);
  }
  return record;
}

export function countMatchingTupleVertices(tuple, selectedVertices) {
  let matches = 0;

  for (const vertex of selectedVertices) {
    const tuplePosition = tuple.subset.indexOf(vertex.parameterIndex);
    if (tuplePosition !== -1 && tuple.values[tuplePosition] === vertex.value) {
      matches += 1;
    }
  }

  return matches;
}
