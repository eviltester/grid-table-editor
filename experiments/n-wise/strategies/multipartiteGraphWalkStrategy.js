import {
  buildNodeIndex,
  buildUncoveredTupleIncidence,
  completeRecord,
  createRecordFromVertices,
  createVertexId,
  getEdgeKey,
  tupleMatchesSelection,
} from './shared.js';

function calculateStartNodeScore(node, nodeWeights, edgeWeights, allNodes) {
  const nodeWeight = nodeWeights.get(createVertexId(node)) || 0;
  let totalAdjacentEdgeWeight = 0;

  for (const otherNode of allNodes) {
    if (otherNode.parameterIndex === node.parameterIndex) {
      continue;
    }
    totalAdjacentEdgeWeight += edgeWeights.get(getEdgeKey(node, otherNode)) || 0;
  }

  return {
    nodeWeight,
    totalAdjacentEdgeWeight,
  };
}

function chooseStartNode(allNodes, nodeWeights, edgeWeights, random) {
  let bestNodes = [];
  let bestNodeWeight = -1;
  let bestAdjacentWeight = -1;

  for (const node of allNodes) {
    const { nodeWeight, totalAdjacentEdgeWeight } = calculateStartNodeScore(node, nodeWeights, edgeWeights, allNodes);

    if (
      nodeWeight > bestNodeWeight ||
      (nodeWeight === bestNodeWeight && totalAdjacentEdgeWeight > bestAdjacentWeight)
    ) {
      bestNodeWeight = nodeWeight;
      bestAdjacentWeight = totalAdjacentEdgeWeight;
      bestNodes = [node];
    } else if (nodeWeight === bestNodeWeight && totalAdjacentEdgeWeight === bestAdjacentWeight) {
      bestNodes.push(node);
    }
  }

  return bestNodes.length > 0 ? bestNodes[Math.floor(random() * bestNodes.length)] : null;
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

function chooseNextNode(
  context,
  allNodes,
  uncoveredTuples,
  nodeWeights,
  edgeWeights,
  selectedVertices,
  selectedParameters
) {
  let bestCandidates = [];
  let bestScore = -1;

  for (const node of allNodes) {
    if (selectedParameters.has(node.parameterIndex)) {
      continue;
    }

    if (!hasConsistentTuple(uncoveredTuples, selectedVertices, node)) {
      continue;
    }

    const chainWeight = calculateChainWeight(uncoveredTuples, selectedVertices, node);
    const edgeSum = calculateEdgeSum(selectedVertices, node, edgeWeights);
    const nodeWeight = nodeWeights.get(createVertexId(node)) || 0;
    const partialRecord = createRecordFromVertices(context, [...selectedVertices, node]);
    const completionWeight = context.model.calculateCoverageScore(partialRecord);
    const score = chainWeight * 1000 + edgeSum * 100 + nodeWeight * 10 + completionWeight;

    if (score > bestScore) {
      bestScore = score;
      bestCandidates = [node];
    } else if (score === bestScore) {
      bestCandidates.push(node);
    }
  }

  return bestCandidates.length > 0 ? bestCandidates[Math.floor(context.random() * bestCandidates.length)] : null;
}

export function generateMultipartiteGraphWalkRecords(context) {
  const { model, dataRecords } = context;
  const allNodes = buildNodeIndex(context.parameters);

  while (!model.isFullyCovered()) {
    const { uncoveredTuples, nodeWeights, edgeWeights } = buildUncoveredTupleIncidence(context);
    if (uncoveredTuples.length === 0) {
      break;
    }

    const startNode = chooseStartNode(allNodes, nodeWeights, edgeWeights, context.random);
    if (!startNode) {
      break;
    }

    const selectedVertices = [startNode];
    const selectedParameters = new Set([startNode.parameterIndex]);

    while (selectedVertices.length < context.parameters.length) {
      const nextNode = chooseNextNode(
        context,
        allNodes,
        uncoveredTuples,
        nodeWeights,
        edgeWeights,
        selectedVertices,
        selectedParameters
      );

      if (!nextNode) {
        break;
      }

      selectedVertices.push(nextNode);
      selectedParameters.add(nextNode.parameterIndex);
    }

    const partialRecord = createRecordFromVertices(context, selectedVertices);
    const completedRecord = completeRecord(model, context.parameters, partialRecord);
    dataRecords.push(completedRecord);
    model.updateCoverage(completedRecord);
  }
}
