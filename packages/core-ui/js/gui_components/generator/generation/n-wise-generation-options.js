import {
  CombinationAlgorithm,
  SUPPORTED_COMBINATION_ALGORITHMS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';

const N_WISE_DOCS_URL = '/docs/test-data/n-wise-testing';
const CARTESIAN_CONFIRM_THRESHOLD = 10000;

const COMBINATION_STRATEGY_ROW_COUNT_ORDER = Object.freeze({
  2: [
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.BACH_ALLPAIRS,
    CombinationAlgorithm.PAIRWISE,
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.CARTESIAN_PRODUCT,
  ],
  3: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.CARTESIAN_PRODUCT,
  ],
  4: [
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.CARTESIAN_PRODUCT,
  ],
  5: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.CARTESIAN_PRODUCT,
  ],
  6: [
    CombinationAlgorithm.GREEDY,
    CombinationAlgorithm.IPOG,
    CombinationAlgorithm.PICT_GCD,
    CombinationAlgorithm.AETG,
    CombinationAlgorithm.HYPERGRAPH_VERTEX,
    CombinationAlgorithm.COMPATIBILITY_GRAPH,
    CombinationAlgorithm.CARTESIAN_PRODUCT,
  ],
});

const COMBINATION_STRATEGIES = Object.freeze([
  {
    id: CombinationAlgorithm.PAIRWISE,
    label: 'Pairwise (simple)',
    strengthMin: 2,
    strengthMax: 2,
    description:
      'Pick for legacy-compatible 2-wise output. It is stable and familiar, though PICT and AETG used fewer rows in our sample runs.',
  },
  {
    id: CombinationAlgorithm.BACH_ALLPAIRS,
    label: 'Bach AllPairs',
    strengthMin: 2,
    strengthMax: 2,
    description:
      'Pick for 2-wise when you want Bach Allpairs-style pair-frequency balancing. It targets lower row counts than the simple legacy pairwise algorithm while staying fast.',
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
  {
    id: CombinationAlgorithm.CARTESIAN_PRODUCT,
    label: 'Cartesian Product',
    strengthMin: 2,
    description:
      'Pick only when you intentionally want every full combination rather than a reduced n-wise covering set.',
  },
]);

function normaliseValueCounts(valueCounts = []) {
  if (!Array.isArray(valueCounts)) {
    return [];
  }
  return valueCounts.map((count) => Number.parseInt(count, 10)).filter((count) => Number.isInteger(count) && count > 0);
}

function calculateCartesianProductRows(valueCounts = []) {
  const counts = normaliseValueCounts(valueCounts);
  if (counts.length === 0) {
    return 0;
  }
  return counts.reduce((total, count) => total * count, 1);
}

function formatCartesianProductExpression(valueCounts = []) {
  const counts = normaliseValueCounts(valueCounts);
  return counts.length > 0 ? counts.join('*') : '?';
}

function getStrategyDescription(strategy, { valueCounts = [] } = {}) {
  if (strategy?.id !== CombinationAlgorithm.CARTESIAN_PRODUCT) {
    return strategy?.description || '';
  }

  const rowCount = calculateCartesianProductRows(valueCounts);
  const expression = formatCartesianProductExpression(valueCounts);
  if (rowCount <= 0) {
    return strategy.description;
  }
  return `Will generate ${rowCount.toLocaleString()} rows to cover (${expression}) combinations.`;
}

function attachStrategyDescriptions(strategies, options = {}) {
  return strategies.map((strategy) => ({
    ...strategy,
    description: getStrategyDescription(strategy, options),
  }));
}

function getAvailableStrengths(enumColumnCount) {
  const count = Number.parseInt(enumColumnCount, 10);
  if (!Number.isInteger(count) || count < 2) {
    return [];
  }
  return Array.from({ length: count - 1 }, (_, index) => index + 2);
}

function getStrengthExplanation(enumColumnCount) {
  const strengths = getAvailableStrengths(enumColumnCount);
  const introduction = 'Generate rows to cover the enum value combinations.';
  if (strengths.length === 0) {
    return `${introduction} Add at least 2 enum columns to generate combinations. n-wise generation only combines enum columns because those columns have a known finite value set.`;
  }
  const maxStrength = strengths[strengths.length - 1];
  return `${introduction} Available n values are 2 through ${maxStrength}. The maximum is ${maxStrength} because this schema has ${enumColumnCount} enum columns, and n cannot be greater than the number of finite enum columns.`;
}

function getStrategiesForStrength(strength, options = {}) {
  const parsedStrength = Number.parseInt(strength, 10);
  const rowCountOrder = COMBINATION_STRATEGY_ROW_COUNT_ORDER[parsedStrength] || [];
  const orderIndex = new Map(rowCountOrder.map((algorithm, index) => [algorithm, index]));
  const strategies = COMBINATION_STRATEGIES.filter(
    (strategy) =>
      SUPPORTED_COMBINATION_ALGORITHMS.has(strategy.id) &&
      parsedStrength >= strategy.strengthMin &&
      (strategy.strengthMax === undefined || parsedStrength <= strategy.strengthMax)
  ).sort((left, right) => {
    const leftIndex = orderIndex.has(left.id) ? orderIndex.get(left.id) : Number.MAX_SAFE_INTEGER;
    const rightIndex = orderIndex.has(right.id) ? orderIndex.get(right.id) : Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });

  return attachStrategyDescriptions(strategies, options);
}

function getStrategyById(strategyId) {
  return COMBINATION_STRATEGIES.find((strategy) => strategy.id === strategyId) || null;
}

function formatCombinationCount(value) {
  if (value === Number.POSITIVE_INFINITY) {
    return 'Too large to estimate';
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return 'Too small to estimate';
  }
  return Number.isFinite(value) ? Number(value).toLocaleString('en-US') : 'Unknown';
}

async function confirmCartesianProductSelection({
  algorithm,
  valueCounts = [],
  requestConfirm,
  threshold = CARTESIAN_CONFIRM_THRESHOLD,
} = {}) {
  if (algorithm !== CombinationAlgorithm.CARTESIAN_PRODUCT) {
    return true;
  }

  const cartesianRowCount = calculateCartesianProductRows(valueCounts);
  if (typeof requestConfirm !== 'function') {
    return true;
  }
  if (Number.isFinite(cartesianRowCount) && cartesianRowCount <= threshold) {
    return true;
  }

  return requestConfirm({
    title: 'Cartesian product generation',
    message: `You included cartesian product generation. Are you sure? this will generate ${formatCombinationCount(cartesianRowCount)} data rows.`,
    okLabel: 'Run cartesian product',
    cancelLabel: 'Skip cartesian product',
  });
}

export {
  CARTESIAN_CONFIRM_THRESHOLD,
  CombinationAlgorithm,
  N_WISE_DOCS_URL,
  COMBINATION_STRATEGIES,
  calculateCartesianProductRows,
  confirmCartesianProductSelection,
  formatCombinationCount,
  getAvailableStrengths,
  getStrengthExplanation,
  getStrategiesForStrength,
  getStrategyById,
  getStrategyDescription,
};
