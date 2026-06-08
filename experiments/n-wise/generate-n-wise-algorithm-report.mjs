import {
  ExperimentalNWiseAlgorithm,
  ExperimentalNWiseGenerator,
} from './experimentalNWiseGenerator.js';

const ALL_EXPERIMENTS = Object.values(ExperimentalNWiseAlgorithm);
const SCENARIOS = [
  { parameterCount: 6, valueCount: 3, candidateCount: 8 },
  { parameterCount: 6, valueCount: 4, candidateCount: 8 },
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

function runCase({ algorithm, parameterCount, valueCount, strength, candidateCount }) {
  if (typeof global.gc === 'function') {
    global.gc();
  }

  const generator = new ExperimentalNWiseGenerator(createParameters(parameterCount, valueCount), {
    algorithm,
    strength,
    seed: 17,
    candidateCount,
  });

  generator.generateDataSet();
  return generator.getBenchmarkStats();
}

function buildTable(rows) {
  const header = [
    '| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];

  const sortedRows = [...rows].sort((left, right) => {
    if (left.rowCount !== right.rowCount) {
      return left.rowCount - right.rowCount;
    }
    return left.algorithm.localeCompare(right.algorithm);
  });

  const body = sortedRows.map(
    (row) =>
      `| \`${row.algorithm}\` | ${row.rowCount} | ${row.runtimeMs} | ${row.rowsGeneratedByGraphPhase} | ${row.rowsGeneratedByFallback} | ${row.lookaheadEvaluations} | ${bytesToMiB(
        row.heapUsedDeltaBytes
      )} | ${row.coveragePercentage.toFixed(1)} |`
  );

  return [...header, ...body].join('\n');
}

function collectScenarioResults() {
  return SCENARIOS.map((scenario) => {
    const parameters = createParameters(scenario.parameterCount, scenario.valueCount);
    const strengthRows = [];

    for (let strength = 2; strength <= 6; strength += 1) {
      strengthRows.push({
        strength,
        rows: ALL_EXPERIMENTS.map((algorithm) =>
          runCase({
            ...scenario,
            algorithm,
            strength,
          })
        ),
      });
    }

    return {
      ...scenario,
      parameters,
      cartesianRowCount: calculateCartesianRowCount(parameters),
      strengthRows,
    };
  });
}

function calculateExperimentSummary(scenarioResults) {
  const experimentRows = scenarioResults.flatMap((scenario) =>
    scenario.strengthRows
      .filter((strengthRow) => strengthRow.strength < scenario.parameterCount)
      .flatMap((strengthRow) =>
        strengthRow.rows.map((row) => ({
          ...row,
          shape: `${scenario.parameterCount}x${scenario.valueCount}`,
          strength: strengthRow.strength,
        }))
      )
  );

  const perCaseBest = new Map();
  for (const row of experimentRows) {
    const caseKey = `${row.shape}:${row.strength}`;
    const currentBest = perCaseBest.get(caseKey);

    if (!currentBest) {
      perCaseBest.set(caseKey, {
        bestRuntimeMs: row.runtimeMs,
        bestRowCount: row.rowCount,
      });
      continue;
    }

    currentBest.bestRuntimeMs = Math.min(currentBest.bestRuntimeMs, row.runtimeMs);
    currentBest.bestRowCount = Math.min(currentBest.bestRowCount, row.rowCount);
  }

  const aggregates = new Map(
    ALL_EXPERIMENTS.map((algorithm) => [
      algorithm,
      {
        algorithm,
        totalRows: 0,
        totalRuntimeMs: 0,
        totalGraphRows: 0,
        totalFallbackRows: 0,
        totalLookaheadEvaluations: 0,
        totalCandidateEvaluations: 0,
        balancedScore: 0,
        caseCount: 0,
      },
    ])
  );

  for (const row of experimentRows) {
    const aggregate = aggregates.get(row.algorithm);
    const bestForCase = perCaseBest.get(`${row.shape}:${row.strength}`);
    const runtimeRatio = bestForCase.bestRuntimeMs > 0 ? row.runtimeMs / bestForCase.bestRuntimeMs : 1;
    const rowRatio = bestForCase.bestRowCount > 0 ? row.rowCount / bestForCase.bestRowCount : 1;

    aggregate.totalRows += row.rowCount;
    aggregate.totalRuntimeMs += row.runtimeMs;
    aggregate.totalGraphRows += row.rowsGeneratedByGraphPhase;
    aggregate.totalFallbackRows += row.rowsGeneratedByFallback;
    aggregate.totalLookaheadEvaluations += row.lookaheadEvaluations;
    aggregate.totalCandidateEvaluations += row.candidateEvaluations;
    aggregate.balancedScore += runtimeRatio + rowRatio;
    aggregate.caseCount += 1;
  }

  const summaryRows = [...aggregates.values()].map((row) => ({
    ...row,
    averageRows: row.totalRows / row.caseCount,
    averageRuntimeMs: row.totalRuntimeMs / row.caseCount,
    averageGraphRows: row.totalGraphRows / row.caseCount,
    averageFallbackRows: row.totalFallbackRows / row.caseCount,
    averageLookaheadEvaluations: row.totalLookaheadEvaluations / row.caseCount,
    averageBalancedScore: row.balancedScore / row.caseCount,
  }));

  return {
    rows: summaryRows,
    bestRuntime: [...summaryRows].sort((left, right) => left.totalRuntimeMs - right.totalRuntimeMs)[0],
    bestRows: [...summaryRows].sort((left, right) => left.totalRows - right.totalRows)[0],
    bestBalanced: [...summaryRows].sort((left, right) => left.averageBalancedScore - right.averageBalancedScore)[0],
  };
}

function buildSummaryTable(summary) {
  return [
    '| Experiment | Avg rows | Avg runtime ms | Avg graph rows | Avg fallback rows | Avg lookahead evals | Balanced score |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...[...summary.rows]
      .sort((left, right) => left.averageBalancedScore - right.averageBalancedScore)
      .map(
        (row) =>
          `| \`${row.algorithm}\` | ${row.averageRows.toFixed(1)} | ${row.averageRuntimeMs.toFixed(1)} | ${row.averageGraphRows.toFixed(
            1
          )} | ${row.averageFallbackRows.toFixed(1)} | ${row.averageLookaheadEvaluations.toFixed(1)} | ${row.averageBalancedScore.toFixed(
            2
          )} |`
      ),
  ].join('\n');
}

function buildMarkdownReport() {
  const scenarioResults = collectScenarioResults();
  const summary = calculateExperimentSummary(scenarioResults);

  const sections = [
    '# Experimental N-Wise Algorithm Report',
    '',
    'This report covers the experimental multipartite strategies only. The stable n-wise and pairwise implementations remain outside this comparison on purpose.',
    '',
    '## Summary',
    '',
    `- Best experimental runtime across non-full-factorial cases: \`${summary.bestRuntime.algorithm}\``,
    `- Best experimental row count across non-full-factorial cases: \`${summary.bestRows.algorithm}\``,
    `- Best experimental balanced runtime/rows result: \`${summary.bestBalanced.algorithm}\``,
    '',
    buildSummaryTable(summary),
    '',
  ];

  for (const scenario of scenarioResults) {
    sections.push(`## Scenario ${scenario.parameterCount}x${scenario.valueCount}`);
    sections.push('');
    sections.push('Input data set:');
    sections.push(buildScenarioDataSet(scenario.parameters));
    sections.push('');
    sections.push(`For Cartesian all combinations the number of rows would be ${scenario.cartesianRowCount}.`);
    sections.push('');

    for (const strengthRow of scenario.strengthRows) {
      sections.push(`### Strength ${strengthRow.strength}`);
      sections.push('');
      sections.push(buildTable(strengthRow.rows));
      sections.push('');
    }
  }

  return `${sections.join('\n')}\n`;
}

process.stdout.write(buildMarkdownReport());
