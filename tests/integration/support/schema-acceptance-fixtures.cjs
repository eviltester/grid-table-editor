const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../..');
const fixturesRoot = path.join(repoRoot, 'test-fixtures', 'schema-acceptance');

// Each scenario carries executable acceptance criteria so every surface
// validates against the same contract instead of duplicating JSON metadata.
function assertGoodDeterministicLiterals(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(true);
  expect(normalizedResult.headers).toEqual(['First Name', 'Status']);
  expect(normalizedResult.rows).toHaveLength(3);
  expect(normalizedResult.rows).toEqual([
    ['Alice', 'active'],
    ['Alice', 'active'],
    ['Alice', 'active'],
  ]);
}

function assertGoodCommentsAndEnum(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(true);
  expect(normalizedResult.headers).toEqual(['Priority', 'Status']);
  expect(normalizedResult.rows).toHaveLength(4);

  const priorityIndex = normalizedResult.headers.indexOf('Priority');
  const statusIndex = normalizedResult.headers.indexOf('Status');
  expect(priorityIndex).toBeGreaterThanOrEqual(0);
  expect(statusIndex).toBeGreaterThanOrEqual(0);

  for (const row of normalizedResult.rows) {
    expect(['high', 'medium', 'low']).toContain(row[priorityIndex]);
    expect(row[statusIndex]).toBe('active');
  }
}

function assertGoodAutoIncrementSequence(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(true);
  expect(normalizedResult.headers).toEqual(['Ticket']);
  expect(normalizedResult.rows).toHaveLength(3);
  expect(normalizedResult.rows).toEqual([['T-001.txt'], ['T-006.txt'], ['T-011.txt']]);
}

function assertGoodAutoIncrementTimestamp(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(true);
  expect(normalizedResult.headers).toEqual(['Created At']);
  expect(normalizedResult.rows).toHaveLength(3);
  expect(normalizedResult.rows).toEqual([['2026-06-12'], ['2026-06-14'], ['2026-06-16']]);
}

function assertBadMissingDefinition(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(false);
  const errorText = (normalizedResult.errorTexts || []).join(' ');

  if ((normalizedResult.errorCodes || []).length > 0) {
    expect(normalizedResult.errorCodes).toContain('missing_rule_definition');
  }
  expect(errorText).toContain('requires a data definition');
}

function assertBadInvalidLiteralConstraint(expect, normalizedResult) {
  expect(normalizedResult.ok).toBe(false);
  const errorText = (normalizedResult.errorTexts || []).join(' ');

  if ((normalizedResult.errorCodes || []).length > 0) {
    expect(normalizedResult.errorCodes).toContain('invalid_constraint_literal_value');
  }
  expect(errorText).toContain('constraint value');
  expect(errorText).toContain('does not match the literal value');
  expect(errorText).toContain('[Status]');
}

const scenarioDefinitions = [
  {
    // Deterministic literals let every surface prove identical success output.
    id: 'good-deterministic-literals',
    kind: 'good',
    schemaFile: 'good/deterministic-literals.schema.txt',
    rowCount: 3,
    outputFormat: 'json',
    expectedHeaders: ['First Name', 'Status'],
    assertAcceptance: assertGoodDeterministicLiterals,
  },
  {
    // Comments must be ignored and enum output must stay within the documented set.
    id: 'good-comments-and-enum',
    kind: 'good',
    schemaFile: 'good/comments-and-enum.schema.txt',
    rowCount: 4,
    outputFormat: 'json',
    expectedHeaders: ['Priority', 'Status'],
    assertAcceptance: assertGoodCommentsAndEnum,
  },
  {
    // Auto increment sequences should stay identical across all generation surfaces.
    id: 'good-autoincrement-sequence',
    kind: 'good',
    schemaFile: 'good/autoincrement-sequence.schema.txt',
    rowCount: 3,
    outputFormat: 'json',
    expectedHeaders: ['Ticket'],
    assertAcceptance: assertGoodAutoIncrementSequence,
  },
  {
    // Auto increment timestamps should respect explicit start, step, and formatting everywhere.
    id: 'good-autoincrement-timestamp',
    kind: 'good',
    schemaFile: 'good/autoincrement-timestamp.schema.txt',
    rowCount: 3,
    outputFormat: 'json',
    expectedHeaders: ['Created At'],
    assertAcceptance: assertGoodAutoIncrementTimestamp,
  },
  {
    // Missing rule definitions should fail consistently across surfaces.
    id: 'bad-missing-definition',
    kind: 'bad',
    schemaFile: 'bad/missing-definition.schema.txt',
    rowCount: 2,
    outputFormat: 'json',
    assertAcceptance: assertBadMissingDefinition,
  },
  {
    // Contradictory literal constraints should surface a clear validation error.
    id: 'bad-invalid-literal-constraint',
    kind: 'bad',
    schemaFile: 'bad/invalid-literal-constraint.schema.txt',
    rowCount: 2,
    outputFormat: 'json',
    assertAcceptance: assertBadInvalidLiteralConstraint,
  },
];

function loadScenario(entry) {
  const schemaPath = path.join(fixturesRoot, entry.schemaFile);
  return {
    ...entry,
    schemaPath,
    schemaText: fs.readFileSync(schemaPath, 'utf8'),
  };
}

const SCHEMA_ACCEPTANCE_SCENARIOS = scenarioDefinitions.map(loadScenario);

function getSchemaAcceptanceScenario(id) {
  const scenario = SCHEMA_ACCEPTANCE_SCENARIOS.find((entry) => entry.id === id);
  if (!scenario) {
    throw new Error(`Unknown schema acceptance scenario: ${id}`);
  }
  return scenario;
}

module.exports = {
  repoRoot,
  fixturesRoot,
  SCHEMA_ACCEPTANCE_SCENARIOS,
  getSchemaAcceptanceScenario,
};
