function countBy(items, selectKey) {
  const counts = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    const key = selectKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((left, right) => String(left[0]).localeCompare(String(right[0])));
}

function uniqueSorted(values) {
  return [
    ...new Set((Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean)),
  ].sort((left, right) => left.localeCompare(right));
}

function getScenarioDisplayOrigin(scenario) {
  const origins = (Array.isArray(scenario?.origins) ? scenario.origins : []).map((origin) =>
    String(origin || '').trim()
  );
  const filtered = origins.filter(Boolean);
  if (filtered.length === 0) {
    return 'unknown';
  }

  const nonCustomOrigins = filtered.filter((origin) => origin !== 'custom');
  if (nonCustomOrigins.length > 0) {
    return nonCustomOrigins[nonCustomOrigins.length - 1];
  }

  return filtered[0];
}

function buildCommandsBySourceType(scenarios) {
  const rows = new Map();
  (Array.isArray(scenarios) ? scenarios : []).forEach((scenario) => {
    const sourceType = String(scenario?.sourceType || '').trim() || 'unknown';
    if (!rows.has(sourceType)) {
      rows.set(sourceType, []);
    }
    const label =
      String(scenario?.command || '').trim() ||
      String(scenario?.label || '').trim() ||
      String(scenario?.sourceType || '').trim();
    rows.get(sourceType).push(label);
  });

  return [...rows.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([sourceType, commands]) => ({
      sourceType,
      commands: uniqueSorted(commands),
    }));
}

function formatScenarioRowInvocation(row) {
  const sourceType = String(row?.sourceType || '').trim();
  const command = String(row?.command || '').trim();
  const params = String(row?.params || '').trim();
  const value = String(row?.value ?? '');

  if (sourceType === 'faker' || sourceType === 'domain') {
    return `${command}${params || '()'}`;
  }

  if (sourceType === 'enum') {
    return `enum(${value})`;
  }

  if (sourceType === 'literal') {
    return `literal(${JSON.stringify(value)})`;
  }

  if (sourceType === 'regex') {
    return `regex(${JSON.stringify(value)})`;
  }

  return `${sourceType}(${value})`;
}

function formatScenarioRowSummary(row) {
  const name = String(row?.name || '').trim() || 'Value';
  return `${name}: ${formatScenarioRowInvocation(row)}`;
}

function getScenarioDisplayId(scenario) {
  return String(scenario?.scenarioId || scenario?.id || '').trim() || 'n/a';
}

function formatScenarioCommandLabel(scenario) {
  const rows = Array.isArray(scenario?.rows) ? scenario.rows : [];
  if (rows.length === 1) {
    return formatScenarioRowInvocation(rows[0]);
  }
  return rows.map((row) => formatScenarioRowSummary(row)).join(' | ');
}

function renderScenarioPreviewData(previewDataByScenarioId, scenario) {
  const previewEntry = previewDataByScenarioId?.[scenario.id];
  if (!previewEntry) {
    return '- Preview data: not generated for this review-only scenario';
  }

  if (previewEntry.status === 'review-only') {
    return '- Preview data: not generated for this review-only scenario';
  }

  if (previewEntry.status === 'non-executable') {
    return '- Preview data: not generated for this non-executable scenario';
  }

  if (previewEntry.error) {
    return `- Preview data: generation failed - \`${previewEntry.error}\``;
  }

  const sections = ['- Preview data:', '```csv', String(previewEntry.csv || '').trimEnd(), '```'];
  if (String(previewEntry.pairwiseCsv || '').trim()) {
    sections.push('- Pairwise preview data:', '```csv', String(previewEntry.pairwiseCsv || '').trimEnd(), '```');
  }
  return sections.join('\n');
}

function renderParityModeLine(scenario, uiParityByScenarioId = {}) {
  const parityInfo = uiParityByScenarioId?.[scenario.id];
  const mode = String(scenario?.parityMode || parityInfo?.mode || '').trim();
  if (!mode) {
    return '';
  }
  return `- UI preview parity: \`${mode}\``;
}

function buildChunkDescriptors(items, chunkSize) {
  const descriptors = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    const scenarios = items.slice(index, index + chunkSize);
    const firstId = getScenarioDisplayId(scenarios[0]);
    const lastId = getScenarioDisplayId(scenarios[scenarios.length - 1]);
    descriptors.push({
      index: descriptors.length + 1,
      label: `chunk ${descriptors.length + 1} (${scenarios.length} scenarios) ${firstId} .. ${lastId}`,
      scenarios,
    });
  }
  return descriptors;
}

function buildSubsetSummary(name, scenarios) {
  return {
    name,
    count: scenarios.length,
    bySourceType: countBy(scenarios, (scenario) => scenario.sourceType),
    byOrigin: countBy(scenarios, (scenario) => getScenarioDisplayOrigin(scenario)),
    commandsBySourceType: buildCommandsBySourceType(scenarios),
  };
}

function renderCountsMarkdown(title, counts) {
  if (!counts.length) {
    return `### ${title}\n\nNone\n`;
  }

  return [
    `### ${title}`,
    '',
    '| Key | Count |',
    '| --- | ---: |',
    ...counts.map(([key, count]) => `| \`${key}\` | ${count} |`),
    '',
  ].join('\n');
}

function renderSubsetMarkdown(name, scenarios, previewDataByScenarioId = {}, uiParityByScenarioId = {}) {
  const summary = buildSubsetSummary(name, scenarios);
  const generatedPreviewCount = scenarios.filter(
    (scenario) => previewDataByScenarioId?.[scenario.id]?.status === 'generated'
  ).length;
  const nonExecutableScenarioCount = scenarios.filter(
    (scenario) => previewDataByScenarioId?.[scenario.id]?.status === 'non-executable'
  ).length;
  const reviewOnlyScenarioCount = scenarios.filter(
    (scenario) => previewDataByScenarioId?.[scenario.id]?.status === 'review-only'
  ).length;
  const exactParityCount = scenarios.filter(
    (scenario) => String(scenario?.parityMode || uiParityByScenarioId?.[scenario.id]?.mode || '') === 'exact'
  ).length;
  const structuralParityCount = scenarios.filter(
    (scenario) => String(scenario?.parityMode || uiParityByScenarioId?.[scenario.id]?.mode || '') === 'structural'
  ).length;
  const structuralOnlyScenarios = scenarios.filter(
    (scenario) => String(scenario?.parityMode || uiParityByScenarioId?.[scenario.id]?.mode || '') === 'structural'
  );

  return [
    `## ${name}`,
    '',
    `Scenario count: **${summary.count}**`,
    `Generated preview data count: **${generatedPreviewCount}**`,
    `Review-only scenario count: **${reviewOnlyScenarioCount}**`,
    `Non-executable scenario count: **${nonExecutableScenarioCount}**`,
    ...(name === 'UI Scenarios'
      ? [
          `Exact preview parity scenario count: **${exactParityCount}**`,
          `Structural-only preview parity scenario count: **${structuralParityCount}**`,
        ]
      : []),
    '',
    renderCountsMarkdown('By Source Type', summary.bySourceType),
    renderCountsMarkdown('By Origin', summary.byOrigin),
    ...(name === 'UI Scenarios'
      ? [
          '### UI Parity Modes',
          '',
          '| Mode | Count |',
          '| --- | ---: |',
          `| \`exact\` | ${exactParityCount} |`,
          `| \`structural\` | ${structuralParityCount} |`,
          '',
          '### Structural-Only UI Scenarios',
          '',
          ...(structuralOnlyScenarios.length
            ? structuralOnlyScenarios.map(
                (scenario) => `- \`${getScenarioDisplayId(scenario)}\` - \`${formatScenarioCommandLabel(scenario)}\``
              )
            : ['None']),
          '',
        ]
      : []),
    '### Commands By Source Type',
    '',
    ...summary.commandsBySourceType.flatMap(({ sourceType, commands }) => [
      `#### \`${sourceType}\` (${commands.length})`,
      '',
      ...commands.map((command) => `- \`${command}\``),
      '',
    ]),
    '### Scenario Details',
    '',
    ...(scenarios.length
      ? [
          ...scenarios.flatMap((scenario) => [
            `#### \`${getScenarioDisplayId(scenario)}\``,
            '',
            `- Command(s): \`${formatScenarioCommandLabel(scenario)}\``,
            ...[renderParityModeLine(scenario, uiParityByScenarioId)].filter(Boolean),
            ...(scenario.rows.length > 1
              ? [`- Schema Rows: ${scenario.rows.map((row) => `\`${formatScenarioRowSummary(row)}\``).join(', ')}`]
              : []),
            renderScenarioPreviewData(previewDataByScenarioId, scenario),
            '',
          ]),
        ]
      : ['None']),
    '',
  ].join('\n');
}

function formatCommandsForConsole(scenarios) {
  return buildCommandsBySourceType(scenarios)
    .map(({ sourceType, commands }) => `${sourceType}(${commands.length}): ${commands.join(', ')}`)
    .join('\n');
}

function renderMatrixSummaryMarkdown({
  generatedAt,
  coverageScenarios,
  runtimeScenarios,
  uiScenarios,
  previewDataByScenarioId = {},
  uiParityByScenarioId = {},
}) {
  return [
    '# Schema Interaction Matrix Summary',
    '',
    `Generated: \`${generatedAt}\``,
    '',
    'This file describes what the interaction matrix covers.',
    '',
    '- `coverageScenarios`: full review catalog generated from definitions',
    '- `runtimeScenarios`: executable real-core runtime subset',
    '- `uiScenarios`: executable JSDOM UI subset',
    '',
    renderSubsetMarkdown('Coverage Scenarios', coverageScenarios, previewDataByScenarioId, uiParityByScenarioId),
    renderSubsetMarkdown('Runtime Scenarios', runtimeScenarios, previewDataByScenarioId, uiParityByScenarioId),
    renderSubsetMarkdown('UI Scenarios', uiScenarios, previewDataByScenarioId, uiParityByScenarioId),
  ].join('\n');
}

export { buildChunkDescriptors, renderMatrixSummaryMarkdown, formatCommandsForConsole, getScenarioDisplayOrigin };
