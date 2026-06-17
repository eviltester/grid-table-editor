import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '../packages/core/js/data_generation/testDataGenerator.js';
import { GenericDataTable } from '../packages/core/js/data_formats/generic-data-table.js';
import { Exporter } from '../packages/core/js/grid/exporter.js';
import {
  schemaRowsToDataRules,
  dataRulesToSchemaText,
} from '../packages/core/js/data_generation/schema-rules-adapter.js';
import {
  buildSchemaInteractionScenarios,
  buildUiInteractionScenarios,
} from '../packages/core-ui/src/tests/interaction/matrix/support/schema-interaction-scenario-builder.js';
import { renderMatrixSummaryMarkdown } from '../packages/core-ui/src/tests/interaction/matrix/support/schema-interaction-matrix-report.js';
import { getFakerCommandHelp } from '../packages/core-ui/js/gui_components/shared/faker-command-help-metadata.js';
import { getDomainCommandHelp } from '../packages/core-ui/js/gui_components/shared/domain-command-help-metadata.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
} from '../packages/core-ui/js/gui_components/shared/test-data/generation/generation-controller.js';
import {
  validateSchemaRows,
  schemaRowsToSpec,
} from '../packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_REGEX,
} from '../packages/core-ui/js/gui_components/shared/schema-row-rule-mapper.js';
import { PairwiseTestDataGenerator } from '../packages/core/js/data_generation/n-wise/pairwiseTestDataGenerator.js';

const generatedAt = new Date().toISOString();
const coverageScenarios = buildSchemaInteractionScenarios();
const previewDataByScenarioId = buildPreviewDataByScenarioId(coverageScenarios);
const runtimeScenarios = coverageScenarios.filter(
  (scenario) => previewDataByScenarioId[scenario.id]?.status === 'generated'
);
const rawUiScenarios = buildUiInteractionScenarios().filter((scenario) =>
  runtimeScenarios.some((runtimeScenario) => runtimeScenario.id === scenario.id)
);
const uiParityByScenarioId = loadUiParityByScenarioId();
const uiScenarios = rawUiScenarios.map((scenario) => ({
  ...scenario,
  parityMode: uiParityByScenarioId[scenario.id]?.mode || 'structural',
  exactPreviewParity: Boolean(uiParityByScenarioId[scenario.id]?.exactPreviewParity),
  structuralParity: uiParityByScenarioId[scenario.id]?.structuralParity !== false,
}));

const payload = {
  generatedAt,
  coverageScenarios,
  runtimeScenarios,
  uiScenarios,
  uiParityByScenarioId,
};

writeFileSync(
  './packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json',
  JSON.stringify(payload, null, 2)
);

writeFileSync(
  './packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix-summary.md',
  renderMatrixSummaryMarkdown({
    generatedAt,
    coverageScenarios,
    runtimeScenarios,
    uiScenarios,
    previewDataByScenarioId,
    uiParityByScenarioId,
  })
);

function loadUiParityByScenarioId() {
  const parityFixturePath = './packages/core-ui/src/tests/interaction/matrix/fixtures/ui-scenario-parity.json';
  if (!existsSync(parityFixturePath)) {
    return {};
  }
  return JSON.parse(readFileSync(parityFixturePath, 'utf8'));
}

function hashScenarioId(value) {
  let hash = 0;
  const text = String(value || '');
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function withDeterministicRandom(seed, callback) {
  const previousRandom = Math.random;
  Math.random = createSeededRandom(seed);
  faker.seed(seed);
  try {
    return callback();
  } finally {
    Math.random = previousRandom;
  }
}

function buildPreviewDataByScenarioId(scenarios) {
  const previewData = {};

  scenarios.forEach((scenario) => {
    const executionStatus = determineExecutionStatus(scenario);
    if (executionStatus !== 'generated') {
      previewData[scenario.id] = { status: executionStatus };
      return;
    }

    const seed = hashScenarioId(scenario.id);
    previewData[scenario.id] = withDeterministicRandom(seed, () => {
      try {
        const configured = createConfiguredGeneratorFromSchemaRows({
          schemaRows: scenario.rows,
          validateSchemaRows: (rows) => validateSchemaRows({ schemaRows: rows, schemaRowsToDataRules }),
          schemaRowsToSpec: (rows) =>
            schemaRowsToSpec({
              schemaRows: rows,
              schemaRowsToDataRules,
              dataRulesToSchemaText,
            }),
          TestDataGeneratorClass: TestDataGenerator,
          faker,
          RandExp,
          buildRuleSpecFromSchemaRow,
          extractLiteralValueFromRuleSpec,
          extractRegexValueFromRuleSpec,
          SOURCE_TYPE_FAKER,
          SOURCE_TYPE_DOMAIN,
          SOURCE_TYPE_LITERAL,
          SOURCE_TYPE_ENUM,
          SOURCE_TYPE_REGEX,
        });

        if (configured.errors.length > 0) {
          return { error: configured.errors.map((error) => error.message || JSON.stringify(error)).join('; ') };
        }

        const previewTable = createPreviewDataTable({
          rowCount: scenario.pairwiseEligible ? 2 : 1,
          generator: configured.generator,
          GenericDataTableClass: GenericDataTable,
        });

        const exporter = new Exporter({
          getGridAsGenericDataTable: () => previewTable,
          getHeadersFromGrid: () => previewTable.getHeaders(),
        });

        const previewEntry = {
          status: 'generated',
          csv: exporter.getDataTableAs('csv', previewTable) || '',
        };

        if (scenario.pairwiseEligible) {
          const pairwiseTable = createPairwiseDataTable({
            generator: configured.generator,
            PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
            GenericDataTableClass: GenericDataTable,
            faker,
            RandExp,
          });
          const pairwiseExporter = new Exporter({
            getGridAsGenericDataTable: () => pairwiseTable,
            getHeadersFromGrid: () => pairwiseTable.getHeaders(),
          });
          previewEntry.pairwiseCsv = pairwiseExporter.getDataTableAs('csv', pairwiseTable) || '';
        }

        return previewEntry;
      } catch (error) {
        return { status: 'generated', error: error?.message || String(error) };
      }
    });
  });

  return previewData;
}

function determineExecutionStatus(scenario) {
  if (!scenario) {
    return 'review-only';
  }

  if (scenario.sourceType === 'domain') {
    return canGenerateCleanPreview(scenario) ? 'generated' : 'non-executable';
  }

  if (scenario.sourceType === 'faker') {
    return canGenerateCleanPreview(scenario) ? 'generated' : 'non-executable';
  }

  if (scenario.origins.includes('custom') || scenario.origins.includes('example')) {
    return 'generated';
  }

  return scenario.origins.includes('base') ? 'generated' : 'non-executable';
}

function canGenerateCleanPreview(scenario) {
  try {
    const configured = createConfiguredGeneratorFromSchemaRows({
      schemaRows: scenario.rows,
      validateSchemaRows: (rows) => validateSchemaRows({ schemaRows: rows, schemaRowsToDataRules }),
      schemaRowsToSpec: (rows) =>
        schemaRowsToSpec({
          schemaRows: rows,
          schemaRowsToDataRules,
          dataRulesToSchemaText,
        }),
      TestDataGeneratorClass: TestDataGenerator,
      faker,
      RandExp,
      buildRuleSpecFromSchemaRow,
      extractLiteralValueFromRuleSpec,
      extractRegexValueFromRuleSpec,
      SOURCE_TYPE_FAKER,
      SOURCE_TYPE_DOMAIN,
      SOURCE_TYPE_LITERAL,
      SOURCE_TYPE_ENUM,
      SOURCE_TYPE_REGEX,
    });
    if (configured.errors.length > 0) {
      return false;
    }

    const previewTable = createPreviewDataTable({
      rowCount: scenario.pairwiseEligible ? 2 : 1,
      generator: configured.generator,
      GenericDataTableClass: GenericDataTable,
    });
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => previewTable,
      getHeadersFromGrid: () => previewTable.getHeaders(),
    });
    const csvText = exporter.getDataTableAs('csv', previewTable) || '';

    if (containsErrorIndicators(csvText)) {
      return false;
    }

    return scenario.rows.every((row, columnIndex) => rowValueLooksValid(row, previewTable.getCell(0, columnIndex)));
  } catch {
    return false;
  }
}

function containsErrorIndicators(value) {
  const text =
    typeof value === 'string' ? value : typeof value === 'bigint' ? value.toString() : JSON.stringify(value ?? '');
  return [
    /\*\*ERROR\*\*/i,
    /Invalid Faker API Call/i,
    /Could not find Faker API Command/i,
    /Unsafe faker rule syntax/i,
    /\bException\b/i,
  ].some((pattern) => pattern.test(String(text || '')));
}

function inferValueType(value) {
  if (value === null || typeof value === 'undefined') return 'unknown';
  if (typeof value === 'bigint') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isFinite(value) ? 'number' : 'unknown';
  if (typeof value === 'object') return 'object';

  const text = String(value).trim();
  if (text === 'true' || text === 'false') return 'boolean';
  if (text.startsWith('[') && text.endsWith(']')) return 'array';
  if (text.startsWith('{') && text.endsWith('}')) return 'object';
  if (/^"?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"?$/.test(text)) return 'date';
  if (/^[+-]?\d+(\.\d+)?$/.test(text)) return 'number';
  return 'string';
}

function rowValueLooksValid(row, value) {
  if (containsErrorIndicators(value)) {
    return false;
  }

  if (row?.sourceType === 'enum') {
    return String(row?.value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .includes(String(value));
  }

  if (row?.sourceType === 'regex' && String(row?.value || '').length > 0) {
    return new RegExp(String(row.value)).test(String(value));
  }

  if (row?.sourceType === 'literal' && String(row?.value || '').length > 0) {
    return String(value) === String(row.value);
  }

  if (row?.sourceType === 'domain' && row?.command === 'string.counterString') {
    return typeof value === 'string' && value.length > 0;
  }

  const allowedTypes = getAllowedTypesForRow(row);
  if (allowedTypes.includes('string')) {
    return true;
  }
  return allowedTypes.includes(inferValueType(value));
}

function getAllowedTypesForRow(row) {
  if (row?.sourceType === 'faker') {
    return String(getFakerCommandHelp(row.command)?.returnType || 'string')
      .split('|')
      .map((entry) => entry.trim())
      .map((entry) => (entry === 'integer' ? 'number' : entry))
      .filter(Boolean);
  }

  if (row?.sourceType === 'domain') {
    return String(getDomainCommandHelp(row.command)?.returnType || 'string')
      .split('|')
      .map((entry) => entry.trim())
      .map((entry) => (entry === 'integer' ? 'number' : entry))
      .filter(Boolean);
  }

  return ['string'];
}
