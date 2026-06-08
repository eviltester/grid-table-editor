import {
  CombinationAlgorithm,
  SUPPORTED_COMBINATION_ALGORITHMS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';

const N_WISE_DOCS_URL = 'docs/n-wise-generation.html';

const COMBINATION_STRATEGY_ROW_COUNT_ORDER = Object.freeze({
  2: [
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.PAIRWISE,
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
  ],
  3: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
  ],
  4: [
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
  ],
  5: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
  ],
  6: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
  ],
});

const COMBINATION_STRATEGIES = Object.freeze([
  {
    id: CombinationAlgorithm.PAIRWISE,
    label: 'Pairwise (current)',
    strengthMin: 2,
    strengthMax: 2,
    description:
      'Pick for legacy-compatible 2-wise output. It is stable and familiar, though PICT and AETG used fewer rows in our sample runs.',
  },
  {
    id: CombinationAlgorithm.GREEDY,
    label: 'Greedy',
    strengthMin: 2,
    description:
      'Pick as the general default for low rows with low runtime. It led our 3-wise and 5-wise samples overall.',
  },
  {
    id: CombinationAlgorithm.PICT_GCD,
    label: 'PICT-inspired GCD',
    strengthMin: 2,
    description:
      'Pick for 2-wise when row count matters. It produced the fewest pairwise rows in the current comparison samples.',
  },
  {
    id: CombinationAlgorithm.AETG,
    label: 'AETG-style',
    strengthMin: 2,
    description:
      'Pick when you can spend more runtime to chase compact output. It was strongest for 4-wise row count in our samples.',
  },
  {
    id: CombinationAlgorithm.IPOG,
    label: 'IPOG-style',
    strengthMin: 2,
    description:
      'Pick for predictable low runtime at higher strengths. It tracked Greedy closely and tied it on some larger samples.',
  },
  {
    id: CombinationAlgorithm.COMPATIBILITY_GRAPH,
    label: 'Compatibility graph',
    strengthMin: 2,
    description:
      'Pick for comparison against graph-style compatibility scoring. It was usually behind the best row-count choices.',
  },
  {
    id: CombinationAlgorithm.HYPERGRAPH_VERTEX,
    label: 'Hypergraph vertex',
    strengthMin: 2,
    description:
      'Pick as the graph-informed comparator that stays closer on rows than compatibility graph, with higher runtime.',
  },
]);

function getAvailableStrengths(enumColumnCount) {
  const count = Number.parseInt(enumColumnCount, 10);
  if (!Number.isInteger(count) || count < 2) {
    return [];
  }
  return Array.from({ length: count - 1 }, (_, index) => index + 2);
}

function getStrengthExplanation(enumColumnCount) {
  const strengths = getAvailableStrengths(enumColumnCount);
  if (strengths.length === 0) {
    return 'Add at least 2 enum columns to generate combinations. n-wise generation only combines enum columns because those columns have a known finite value set.';
  }
  const maxStrength = strengths[strengths.length - 1];
  return `Available n values are 2 through ${maxStrength}. The maximum is ${maxStrength} because this schema has ${enumColumnCount} enum columns, and n cannot be greater than the number of finite enum columns.`;
}

function getStrategiesForStrength(strength) {
  const parsedStrength = Number.parseInt(strength, 10);
  const rowCountOrder = COMBINATION_STRATEGY_ROW_COUNT_ORDER[parsedStrength] || [];
  const orderIndex = new Map(rowCountOrder.map((algorithm, index) => [algorithm, index]));
  return COMBINATION_STRATEGIES.filter(
    (strategy) =>
      SUPPORTED_COMBINATION_ALGORITHMS.has(strategy.id) &&
      parsedStrength >= strategy.strengthMin &&
      (strategy.strengthMax === undefined || parsedStrength <= strategy.strengthMax)
  ).sort((left, right) => {
    const leftIndex = orderIndex.has(left.id) ? orderIndex.get(left.id) : Number.MAX_SAFE_INTEGER;
    const rightIndex = orderIndex.has(right.id) ? orderIndex.get(right.id) : Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function getStrategyById(strategyId) {
  return COMBINATION_STRATEGIES.find((strategy) => strategy.id === strategyId) || null;
}

export {
  CombinationAlgorithm,
  N_WISE_DOCS_URL,
  COMBINATION_STRATEGIES,
  getAvailableStrengths,
  getStrengthExplanation,
  getStrategiesForStrength,
  getStrategyById,
};
