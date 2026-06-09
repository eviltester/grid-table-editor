import {
  completeRecord,
  createRecordFromVertices,
  createVertexId,
  getUncoveredTuplesWithVertices,
  hydrateVertex,
  pickBestGraphVertex,
} from './shared.js';

function buildCompatibilityGraph(uncoveredTuples) {
  const adjacency = new Map();
  const vertexWeights = new Map();

  for (const tuple of uncoveredTuples) {
    for (const vertex of tuple.vertices) {
      const vertexId = createVertexId(vertex);
      if (!adjacency.has(vertexId)) {
        adjacency.set(vertexId, new Set());
      }
      vertexWeights.set(vertexId, (vertexWeights.get(vertexId) || 0) + 1);
    }

    for (let index = 0; index < tuple.vertices.length; index += 1) {
      const leftId = createVertexId(tuple.vertices[index]);
      for (let nextIndex = index + 1; nextIndex < tuple.vertices.length; nextIndex += 1) {
        const rightId = createVertexId(tuple.vertices[nextIndex]);
        adjacency.get(leftId).add(rightId);
        adjacency.get(rightId).add(leftId);
      }
    }
  }

  return { adjacency, vertexWeights };
}

export function generateCompatibilityGraphRecords(context) {
  const { model, dataRecords, random } = context;

  while (!model.isFullyCovered()) {
    const uncoveredTuples = getUncoveredTuplesWithVertices(context);
    if (uncoveredTuples.length === 0) {
      break;
    }

    const { adjacency, vertexWeights } = buildCompatibilityGraph(uncoveredTuples);
    const seedTuple = pickBestGraphVertex(
      uncoveredTuples,
      (tuple) => tuple.vertices.reduce((total, vertex) => total + (vertexWeights.get(createVertexId(vertex)) || 0), 0),
      random
    );

    const cliqueVertices = seedTuple ? [...seedTuple.vertices] : [];
    const record = createRecordFromVertices(context, cliqueVertices);

    while (record.size < context.parameters.length) {
      const candidateVertices = [];

      for (let parameterIndex = 0; parameterIndex < context.parameters.length; parameterIndex += 1) {
        const parameterName = context.parameters[parameterIndex].name;
        if (record.has(parameterName)) {
          continue;
        }

        for (const value of context.parameters[parameterIndex].values) {
          const vertex = hydrateVertex(context.parameters, parameterIndex, value);
          const vertexId = createVertexId(vertex);
          const isCliqueCompatible = cliqueVertices.every((selectedVertex) =>
            adjacency.get(vertexId)?.has(createVertexId(selectedVertex))
          );

          if (isCliqueCompatible || cliqueVertices.length === 0) {
            candidateVertices.push(vertex);
          }
        }
      }

      if (candidateVertices.length === 0) {
        break;
      }

      const selectedVertex = pickBestGraphVertex(
        candidateVertices,
        (vertex) => {
          const vertexId = createVertexId(vertex);
          record.set(vertex.parameterName, vertex.value);
          const coverageScore = model.calculateCoverageScore(record);
          record.delete(vertex.parameterName);
          return (vertexWeights.get(vertexId) || 0) + coverageScore;
        },
        random
      );

      if (!selectedVertex) {
        break;
      }

      cliqueVertices.push(selectedVertex);
      record.set(selectedVertex.parameterName, selectedVertex.value);
    }

    const completedRecord = completeRecord(model, context.parameters, record);
    dataRecords.push(completedRecord);
    model.updateCoverage(completedRecord);
  }
}
