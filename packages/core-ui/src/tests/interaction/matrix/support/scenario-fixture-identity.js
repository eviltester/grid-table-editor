function getScenarioLogicalId(scenario) {
  return String(scenario?.scenarioId || scenario?.id || '').trim();
}

function findScenarioByLogicalId(scenarios, logicalId) {
  const expectedId = String(logicalId || '').trim();
  return (Array.isArray(scenarios) ? scenarios : []).find((scenario) => getScenarioLogicalId(scenario) === expectedId);
}

export { findScenarioByLogicalId, getScenarioLogicalId };
