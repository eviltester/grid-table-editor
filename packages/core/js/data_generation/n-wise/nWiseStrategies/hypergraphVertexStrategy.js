import {
  completeRecord,
  countMatchingTupleVertices,
  createRecordFromVertices,
  getUncoveredTuplesWithVertices,
  hydrateVertex,
  pickBestGraphVertex,
} from './shared.js';

function canExtendHyperedge(tuple, selectedVertices, vertex) {
  const vertices = [...selectedVertices, vertex];
  return countMatchingTupleVertices(tuple, vertices) === vertices.length;
}

function scoreHypergraphVertex(context, selectedVertices, vertex, uncoveredTuples) {
  let incidentHyperedges = 0;
  let extensionPotential = 0;

  for (const tuple of uncoveredTuples) {
    const tuplePosition = tuple.subset.indexOf(vertex.parameterIndex);
    if (tuplePosition === -1 || tuple.values[tuplePosition] !== vertex.value) {
      continue;
    }

    const matches = countMatchingTupleVertices(tuple, selectedVertices);
    if (matches !== selectedVertices.length) {
      continue;
    }

    incidentHyperedges += 1;
    extensionPotential += tuple.subset.length - (matches + 1);
  }

  const record = createRecordFromVertices(context, [...selectedVertices, vertex]);
  return incidentHyperedges * 1000 + extensionPotential * 10 + context.model.calculateCoverageScore(record);
}

export function generateHypergraphVertexRecords(context) {
  const { model, dataRecords, random } = context;

  while (!model.isFullyCovered()) {
    const uncoveredTuples = getUncoveredTuplesWithVertices(context);
    if (uncoveredTuples.length === 0) {
      break;
    }

    const selectedVertices = [];
    const selectedParameters = new Set();

    while (selectedVertices.length < context.parameters.length) {
      const candidates = [];

      for (let parameterIndex = 0; parameterIndex < context.parameters.length; parameterIndex += 1) {
        if (selectedParameters.has(parameterIndex)) {
          continue;
        }

        for (const value of context.parameters[parameterIndex].values) {
          const vertex = hydrateVertex(context.parameters, parameterIndex, value);
          const compatibleWithSelection =
            selectedVertices.length === 0 ||
            uncoveredTuples.some((tuple) => canExtendHyperedge(tuple, selectedVertices, vertex));

          if (compatibleWithSelection) {
            candidates.push(vertex);
          }
        }
      }

      if (candidates.length === 0) {
        break;
      }

      const selectedVertex = pickBestGraphVertex(
        candidates,
        (vertex) => scoreHypergraphVertex(context, selectedVertices, vertex, uncoveredTuples),
        random
      );

      if (!selectedVertex) {
        break;
      }

      selectedVertices.push(selectedVertex);
      selectedParameters.add(selectedVertex.parameterIndex);
    }

    const record = createRecordFromVertices(context, selectedVertices);
    const completedRecord = completeRecord(model, context.parameters, record);
    dataRecords.push(completedRecord);
    model.updateCoverage(completedRecord);
  }
}
