import { NWiseAlgorithm, NWiseGenerator } from '../packages/core/js/data_generation/all-pairs/nWiseGenerator.js';

const ALL_ALGORITHMS = Object.values(NWiseAlgorithm);
const SCENARIOS = [
  { parameterCount: 8, valueCount: 3, candidateCount: 8, aetgRuns: 2 },
  { parameterCount: 8, valueCount: 4, candidateCount: 8, aetgRuns: 2 },
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
    '| Algorithm | Strength | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];

  const body = rows.map(
    (row) =>
      `| \`${row.algorithm}\` | ${row.strength} | ${row.rowCount} | ${row.runtimeMs} | ${bytesToMiB(
        row.heapUsedDeltaBytes
      )} | ${bytesToMiB(row.rssDeltaBytes)} | ${row.coveragePercentage.toFixed(1)} |`
  );

  return [...header, ...body].join('\n');
}

function buildMarkdownReport() {
  const sections = [
    '# N-Wise Algorithm Benchmark Report',
    '',
    'These measurements come from the current JavaScript implementations of `greedy`, `pict-gcd`, `aetg`, and `ipog` using the same deterministic seed.',
    '',
    'Memory notes: `heap delta` and `RSS delta` are process-level before/after deltas from `process.memoryUsage()` around a single generator run. They are useful for comparison, but they are not true peak-memory measurements.',
    '',
  ];

  for (const scenario of SCENARIOS) {
    const rows = [];
    for (let strength = 2; strength <= 6; strength += 1) {
      for (const algorithm of ALL_ALGORITHMS) {
        rows.push(
          runCase({
            ...scenario,
            algorithm,
            strength,
          })
        );
      }
    }

    sections.push(`## Scenario ${scenario.parameterCount}x${scenario.valueCount}`);
    sections.push('');
    sections.push(buildTable(rows));
    sections.push('');
  }

  return `${sections.join('\n')}\n`;
}

process.stdout.write(buildMarkdownReport());
