function uniqueSorted(values) {
  return [
    ...new Set((Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean)),
  ].sort((left, right) => left.localeCompare(right));
}

function getScenarioDisplayId(scenario) {
  return String(scenario?.scenarioId || scenario?.id || '').trim() || 'n/a';
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

function formatCommandsForConsole(scenarios) {
  return buildCommandsBySourceType(scenarios)
    .map(({ sourceType, commands }) => `${sourceType}(${commands.length}): ${commands.join(', ')}`)
    .join('\n');
}

export { buildChunkDescriptors, formatCommandsForConsole };
