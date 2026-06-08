import { NWiseAlgorithm, NWiseGenerator } from '../packages/core/js/data_generation/all-pairs/nWiseGenerator.js';

const ALL_ALGORITHMS = Object.values(NWiseAlgorithm);
const SCENARIOS = [
  { parameterCount: 6, valueCount: 3, candidateCount: 8, aetgRuns: 2 },
  { parameterCount: 6, valueCount: 4, candidateCount: 8, aetgRuns: 2 },
];

function createParameters(parameterCount, valueCount) {
  return Array.from({ length: parameterCount }, (_, parameterIndex) => ({
    name: `P${parameterIndex + 1}`,
    values: Array.from({ length: valueCount }, (_, valueIndex) => `${parameterIndex + 1}.${valueIndex + 1}`),
  }));
}

function bytesToMiB(bytes) {
  if (typeof bytes !== 'number') {
    return 'n/a';
  }
  return (bytes / (1024 * 1024)).toFixed(2);
}

function buildScenarioDataSet(parameters) {
  return parameters
    .map((parameter) => `- \`${parameter.name}\`: ${parameter.values.map((value) => `\`${value}\``).join(', ')}`)
    .join('\n');
}

function calculateCartesianRowCount(parameters) {
  return parameters.reduce((total, parameter) => total * parameter.values.length, 1);
}

function runCase({ algorithm, parameterCount, valueCount, strength, candidateCount, aetgRuns }) {
  if (typeof global.gc === 'function') {
    global.gc();
  }

  const generator = new NWiseGenerator(createParameters(parameterCount, valueCount), {
    algorithm,
    strength,
    seed: 17,
    candidateCount,
    runs: algorithm === NWiseAlgorithm.AETG ? aetgRuns : 1,
  });

  generator.generateDataSet();
  return generator.getBenchmarkStats();
}

function buildTable(rows) {
  const header = [
    '| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];

  const sortedRows = [...rows].sort((left, right) => {
    if (left.rowCount !== right.rowCount) {
      return left.rowCount - right.rowCount;
    }
    return left.algorithm.localeCompare(right.algorithm);
  });

  const body = sortedRows.map(
    (row) =>
      `| \`${row.algorithm}\` | ${row.rowCount} | ${row.runtimeMs} | ${bytesToMiB(
        row.heapUsedDeltaBytes
      )} | ${bytesToMiB(row.rssDeltaBytes)} | ${row.coveragePercentage.toFixed(1)} |`
  );

  return [...header, ...body].join('\n');
}

function buildMarkdownReport() {
  const sections = [
    '# N-Wise Algorithm Benchmark Report',
    '',
    'These measurements come from the current JavaScript implementations registered in `NWiseAlgorithm`, all using the same deterministic seed.',
    '',
    'Memory notes: `heap delta` and `RSS delta` are process-level before/after deltas from `process.memoryUsage()` around a single generator run. They are useful for comparison, but they are not true peak-memory measurements.',
    '',
    '## Summary',
    '',
    '- `aetg` still tends to produce the smallest row sets in the non-full-factorial cases, but it remains one of the slowest strategies.',
    '- `pict-gcd` remains the best general middle ground in this implementation: its row counts stay competitive without the large runtime spikes seen in `aetg` and the graph-heavy strategies.',
    '- `compatibility-graph` is now the clearer of the two graph-based approaches. It usually lands near the heuristic strategies on row count, but it becomes expensive at strengths `4` and `5`.',
    '- `hypergraph-vertex` is the more direct hypergraph-driven construction. It can match or beat `compatibility-graph` on row count, but it is generally slower and has the largest memory jumps in the harder `6x4` cases.',
    '- `ipog` stays attractive when runtime matters more than row-count minimization.',
    '',
  ];

  for (const scenario of SCENARIOS) {
    const parameters = createParameters(scenario.parameterCount, scenario.valueCount);
    const cartesianRowCount = calculateCartesianRowCount(parameters);
    sections.push(`## Scenario ${scenario.parameterCount}x${scenario.valueCount}`);
    sections.push('');
    sections.push('Input data set:');
    sections.push(buildScenarioDataSet(parameters));
    sections.push('');
    sections.push(`For Cartesian all combinations the number of rows would be ${cartesianRowCount}.`);
    sections.push('');

    for (let strength = 2; strength <= 6; strength += 1) {
      const rows = [];
      for (const algorithm of ALL_ALGORITHMS) {
        rows.push(
          runCase({
            ...scenario,
            algorithm,
            strength,
          })
        );
      }

      sections.push(`### Strength ${strength}`);
      sections.push('');
      sections.push(buildTable(rows));
      sections.push('');
    }
  }

  return `${sections.join('\n')}\n`;
}

process.stdout.write(buildMarkdownReport());
