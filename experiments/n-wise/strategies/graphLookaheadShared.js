import {
  buildNodeIndex,
  buildUncoveredTupleIncidence,
  completeRecord,
  createRecordFromVertices,
  createUncoveredIncidenceCache,
  createVertexId,
  getEdgeKey,
  tupleMatchesSelection,
} from './shared.js';

function createSyntheticUsageState() {
  return {
    nodeUsageCounts: new Map(),
    edgeUsageCounts: new Map(),
  };
}

function getNodeUsageCount(syntheticUsage, vertex) {
  return syntheticUsage.nodeUsageCounts.get(createVertexId(vertex)) || 0;
}

function getEdgeUsageCount(syntheticUsage, leftVertex, rightVertex) {
  return syntheticUsage.edgeUsageCounts.get(getEdgeKey(leftVertex, rightVertex)) || 0;
}

function updateSyntheticUsageCounts(syntheticUsage, selectedVertices) {
  const uniqueVertices = [];
  const seenVertices = new Set();

  for (const vertex of selectedVertices) {
    const vertexId = createVertexId(vertex);
    if (seenVertices.has(vertexId)) {
      continue;
    }
    seenVertices.add(vertexId);
    uniqueVertices.push(vertex);
    syntheticUsage.nodeUsageCounts.set(vertexId, getNodeUsageCount(syntheticUsage, vertex) + 1);
  }

  for (let index = 0; index < uniqueVertices.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < uniqueVertices.length; nextIndex += 1) {
      const edgeKey = getEdgeKey(uniqueVertices[index], uniqueVertices[nextIndex]);
      syntheticUsage.edgeUsageCounts.set(
        edgeKey,
        getEdgeUsageCount(syntheticUsage, uniqueVertices[index], uniqueVertices[nextIndex]) + 1
      );
    }
  }
}

function buildSeedEdges(uncoveredTuples, syntheticUsage) {
  const seedEdges = new Map();

  for (const tuple of uncoveredTuples) {
    for (let index = 0; index < tuple.vertices.length; index += 1) {
      const leftVertex = tuple.vertices[index];
      for (let nextIndex = index + 1; nextIndex < tuple.vertices.length; nextIndex += 1) {
        const rightVertex = tuple.vertices[nextIndex];
        const edgeKey = getEdgeKey(leftVertex, rightVertex);
        const existing = seedEdges.get(edgeKey);

        if (existing) {
          existing.uncoveredEdgeWeight += 1;
        } else {
          seedEdges.set(edgeKey, {
            leftVertex,
            rightVertex,
            uncoveredEdgeWeight: 1,
            syntheticUsageCount: getEdgeUsageCount(syntheticUsage, leftVertex, rightVertex),
          });
        }
      }
    }
  }

  return [...seedEdges.values()];
}

function chooseSeedEdge(seedEdges, nodeWeights, random) {
  let bestEdges = [];
  let bestSyntheticUsage = Number.POSITIVE_INFINITY;
  let bestUncoveredEdgeWeight = -1;
  let bestNodeWeightSum = -1;

  for (const edge of seedEdges) {
    const nodeWeightSum =
      (nodeWeights.get(createVertexId(edge.leftVertex)) || 0) +
      (nodeWeights.get(createVertexId(edge.rightVertex)) || 0);

    if (
      edge.syntheticUsageCount < bestSyntheticUsage ||
      (edge.syntheticUsageCount === bestSyntheticUsage && edge.uncoveredEdgeWeight > bestUncoveredEdgeWeight) ||
      (edge.syntheticUsageCount === bestSyntheticUsage &&
        edge.uncoveredEdgeWeight === bestUncoveredEdgeWeight &&
        nodeWeightSum > bestNodeWeightSum)
    ) {
      bestSyntheticUsage = edge.syntheticUsageCount;
      bestUncoveredEdgeWeight = edge.uncoveredEdgeWeight;
      bestNodeWeightSum = nodeWeightSum;
      bestEdges = [edge];
    } else if (
      edge.syntheticUsageCount === bestSyntheticUsage &&
      edge.uncoveredEdgeWeight === bestUncoveredEdgeWeight &&
      nodeWeightSum === bestNodeWeightSum
    ) {
      bestEdges.push(edge);
    }
  }

  return bestEdges.length > 0 ? bestEdges[Math.floor(random() * bestEdges.length)] : null;
}

function hasConsistentTuple(uncoveredTuples, selectedVertices, candidateNode) {
  const nextSelection = [...selectedVertices, candidateNode];
  return uncoveredTuples.some((tuple) => tupleMatchesSelection(tuple, nextSelection));
}

function calculateChainWeight(uncoveredTuples, selectedVertices, candidateNode) {
  const nextSelection = [...selectedVertices, candidateNode];
  let weight = 0;

  for (const tuple of uncoveredTuples) {
    if (tupleMatchesSelection(tuple, nextSelection)) {
      weight += 1;
    }
  }

  return weight;
}

function calculateEdgeSum(selectedVertices, candidateNode, edgeWeights) {
  return selectedVertices.reduce(
    (total, vertex) => total + (edgeWeights.get(getEdgeKey(candidateNode, vertex)) || 0),
    0
  );
}

function calculateSyntheticPenalty(selectedVertices, candidateNode, syntheticUsage) {
  const nodePenalty = getNodeUsageCount(syntheticUsage, candidateNode) * 10;
  const edgePenalty =
    selectedVertices.reduce((total, vertex) => total + getEdgeUsageCount(syntheticUsage, candidateNode, vertex), 0) * 5;
  return nodePenalty + edgePenalty;
}

function calculateLookaheadTupleGain(context, selectedVertices, candidateNode, benchmarkDetails) {
  benchmarkDetails.lookaheadEvaluations += 1;
  const partialRecord = createRecordFromVertices(context, [...selectedVertices, candidateNode]);
  const completedRecord = completeRecord(context.model, context.parameters, partialRecord);
  return context.model.calculateCoverageScore(completedRecord);
}

function createProgressRecord(context, tuple = context.model.getFirstUncoveredTuple()) {
  if (!tuple) {
    return null;
  }

  return completeRecord(context.model, context.parameters, context.model.createRecordFromTuple(tuple));
}

function getRowVertices(context, completedRecord) {
  return context.parameters.map((parameter, parameterIndex) => ({
    parameterIndex,
    parameterName: parameter.name,
    value: completedRecord.get(parameter.name),
  }));
}

function countCoveredTuples(model) {
  let coveredTuples = 0;

  for (const target of model.coverageTargets) {
    coveredTuples += model.coverage.get(target.key).size;
  }

  return coveredTuples;
}

function chooseNextNode(
  context,
  config,
  allNodes,
  uncoveredTuples,
  nodeWeights,
  edgeWeights,
  selectedVertices,
  selectedParameters,
  syntheticUsage
) {
  const { benchmarkDetails } = context;
  const preScoredCandidates = [];
  const shouldUseLookahead = config.shouldUseLookahead(selectedVertices);
  const shouldIncludeCompletionWeight = config.shouldIncludeCompletionWeight(selectedVertices);

  for (const node of allNodes) {
    if (selectedParameters.has(node.parameterIndex)) {
      continue;
    }

    if (!hasConsistentTuple(uncoveredTuples, selectedVertices, node)) {
      continue;
    }

    benchmarkDetails.candidateEvaluations += 1;

    const chainWeight = calculateChainWeight(uncoveredTuples, selectedVertices, node);
    const edgeSum = calculateEdgeSum(selectedVertices, node, edgeWeights);
    const nodeWeight = nodeWeights.get(createVertexId(node)) || 0;
    const syntheticPenalty = calculateSyntheticPenalty(selectedVertices, node, syntheticUsage);
    const completionWeight = shouldIncludeCompletionWeight
      ? context.model.calculateCoverageScore(createRecordFromVertices(context, [...selectedVertices, node]))
      : 0;
    const preScore =
      chainWeight * 1000 +
      edgeSum * 100 +
      nodeWeight * 10 +
      (shouldIncludeCompletionWeight ? completionWeight : 0) -
      syntheticPenalty;

    preScoredCandidates.push({
      node,
      chainWeight,
      edgeSum,
      nodeWeight,
      completionWeight,
      syntheticPenalty,
      preScore,
    });
  }

  preScoredCandidates.sort((left, right) => right.preScore - left.preScore);
  const candidateLimit = config.getCandidateLimit(context);
  const candidatesToEvaluate = preScoredCandidates.slice(0, candidateLimit);

  let bestCandidates = [];
  let bestScore = -1;

  for (const candidate of candidatesToEvaluate) {
    const newTupleGain = shouldUseLookahead
      ? calculateLookaheadTupleGain(context, selectedVertices, candidate.node, benchmarkDetails)
      : config.getProxyTupleGain(candidate);
    const score =
      newTupleGain * 10000 +
      candidate.chainWeight * 1000 +
      candidate.edgeSum * 100 +
      candidate.nodeWeight * 10 +
      (shouldIncludeCompletionWeight ? candidate.completionWeight : 0) -
      candidate.syntheticPenalty;

    if (score > bestScore) {
      bestScore = score;
      bestCandidates = [candidate.node];
    } else if (score === bestScore) {
      bestCandidates.push(candidate.node);
    }
  }

  return bestCandidates.length > 0 ? bestCandidates[Math.floor(context.random() * bestCandidates.length)] : null;
}

function commitRecord(context, config, syntheticUsage, completedRecord, rowMode, hasSwitchedToFallbackTail) {
  context.dataRecords.push(completedRecord);
  context.model.updateCoverage(completedRecord);

  if (rowMode === 'graph') {
    context.benchmarkDetails.rowsGeneratedByGraphPhase += 1;
  } else {
    context.benchmarkDetails.rowsGeneratedByFallback += 1;
  }

  const shouldUpdateSyntheticUsage =
    rowMode === 'graph' || (!hasSwitchedToFallbackTail && config.updateSyntheticUsageDuringFallback);

  if (shouldUpdateSyntheticUsage) {
    updateSyntheticUsageCounts(syntheticUsage, getRowVertices(context, completedRecord));
  }
}

export function createMultipartiteGraphLookaheadStrategy(config) {
  return function generateMultipartiteGraphLookaheadVariant(context) {
    const { model } = context;
    const allNodes = buildNodeIndex(context.parameters);
    const syntheticUsage = createSyntheticUsageState();
    const totalTuples = model.getTotalTargetTupleCount();
    const uncoveredIncidenceCache = config.useIncidenceCache ? createUncoveredIncidenceCache(context) : null;
    let hasSwitchedToFallbackTail = false;

    while (!model.isFullyCovered()) {
      const firstUncoveredTuple = model.getFirstUncoveredTuple();
      if (!firstUncoveredTuple) {
        break;
      }

      if (config.phaseSwitchUncoveredThreshold !== null && !hasSwitchedToFallbackTail) {
        const coveredTuples = countCoveredTuples(model);
        const uncoveredFraction = totalTuples > 0 ? (totalTuples - coveredTuples) / totalTuples : 0;
        if (uncoveredFraction <= config.phaseSwitchUncoveredThreshold) {
          hasSwitchedToFallbackTail = true;
          context.benchmarkDetails.phaseSwitchRow = context.dataRecords.length + 1;
        }
      }

      if (hasSwitchedToFallbackTail) {
        const fallbackRecord = createProgressRecord(context, firstUncoveredTuple);
        if (!fallbackRecord) {
          break;
        }

        commitRecord(context, config, syntheticUsage, fallbackRecord, 'fallback', hasSwitchedToFallbackTail);
        uncoveredIncidenceCache?.invalidate();
        continue;
      }

      const { uncoveredTuples, nodeWeights, edgeWeights } = uncoveredIncidenceCache
        ? uncoveredIncidenceCache.getCurrent()
        : buildUncoveredTupleIncidence(context);

      if (uncoveredTuples.length === 0) {
        break;
      }

      const seedEdges = buildSeedEdges(uncoveredTuples, syntheticUsage);
      context.benchmarkDetails.seedEdgesConsidered += seedEdges.length;
      const seedEdge = chooseSeedEdge(seedEdges, nodeWeights, context.random);
      let completedRecord = null;
      let rowMode = 'graph';

      if (!seedEdge) {
        completedRecord = createProgressRecord(context, firstUncoveredTuple);
        rowMode = 'fallback';
      }

      if (!completedRecord) {
        const selectedVertices = [seedEdge.leftVertex, seedEdge.rightVertex];
        const selectedParameters = new Set([seedEdge.leftVertex.parameterIndex, seedEdge.rightVertex.parameterIndex]);

        while (selectedVertices.length < context.parameters.length) {
          const nextNode = chooseNextNode(
            context,
            config,
            allNodes,
            uncoveredTuples,
            nodeWeights,
            edgeWeights,
            selectedVertices,
            selectedParameters,
            syntheticUsage
          );

          if (!nextNode) {
            break;
          }

          selectedVertices.push(nextNode);
          selectedParameters.add(nextNode.parameterIndex);
        }

        completedRecord = completeRecord(
          model,
          context.parameters,
          createRecordFromVertices(context, selectedVertices)
        );
      }

      if (!completedRecord || model.calculateCoverageScore(completedRecord) <= 0) {
        completedRecord = createProgressRecord(context, firstUncoveredTuple);
        rowMode = 'fallback';
      }

      if (!completedRecord) {
        break;
      }

      commitRecord(context, config, syntheticUsage, completedRecord, rowMode, hasSwitchedToFallbackTail);
      uncoveredIncidenceCache?.invalidate();
    }
  };
}
