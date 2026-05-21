/*
 * Purpose:
 * - Validates the executable runtime scenario subset without going through page DOM wiring.
 *
 * Asserts:
 * - each runtime scenario renders canonical schema text as expected
 * - schema rows validate cleanly through the real schema compiler
 * - generator construction succeeds with real faker/domain/runtime dependencies
 * - preview/export paths produce non-empty data
 * - structured/object-returning scenarios preserve serialized output
 * - canonical schema text round-trips back into schema rows
 * - pairwise generation succeeds for eligible enum scenarios
 */

import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { buildExpectedSchemaText } from './support/schema-interaction-scenario-builder.js';
import { buildChunkDescriptors, formatCommandsForConsole } from './support/schema-interaction-matrix-report.js';
import { assertScenarioDataQuality } from './support/generated-value-quality.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
} from '../../../js/gui_components/shared/test-data/generation/index.js';
import {
  parseSchemaTextToRows,
  validateSchemaRows,
  schemaRowsToSpec,
} from '../../../js/gui_components/shared/test-data/schema/index.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_REGEX,
} from '../../../js/gui_components/shared/schema-row-rule-mapper.js';
import { mapDataRuleToSchemaRow } from '../../../js/gui_components/shared/test-data/schema/index.js';

const fixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/fixtures/schema-interaction-matrix.json'
);
const scenarios = JSON.parse(readFileSync(fixturePath, 'utf8')).runtimeScenarios;
const CHUNK_SIZE = 100;
const chunkDescriptors = buildChunkDescriptors(scenarios, CHUNK_SIZE);

describe('schema interaction scenario runtime matrix', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    console.info(`[runtime-matrix] fixture=${fixturePath}`);
    console.info(`[runtime-matrix] scenarios=${scenarios.length} chunks=${chunkDescriptors.length}`);
    console.info(`[runtime-matrix] commands\n${formatCommandsForConsole(scenarios)}`);
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  test.each(chunkDescriptors.map((descriptor) => [descriptor.label, descriptor.scenarios]))(
    '%s',
    async (_chunkLabel, scenarioChunk) => {
      const failures = [];
      for (const scenario of scenarioChunk) {
        try {
          const expectedSchemaText = buildExpectedSchemaText(scenario.rows);
          expect(expectedSchemaText).toBe(scenario.expectedSchemaText);

          const validation = validateSchemaRows({
            schemaRows: scenario.rows,
            schemaRowsToDataRules,
          });
          expect(validation.errors).toEqual([]);

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
          expect(configured.errors).toEqual([]);

          const previewTable = createPreviewDataTable({
            rowCount: scenario.pairwiseEligible ? 2 : 1,
            generator: configured.generator,
            GenericDataTableClass: GenericDataTable,
          });
          expect(previewTable.getRowCount()).toBeGreaterThan(0);

          const exporter = new Exporter({
            getGridAsGenericDataTable: () => previewTable,
            getHeadersFromGrid: () => previewTable.getHeaders(),
          });
          const csvText = exporter.getDataTableAs('csv', previewTable);
          expect(csvText.length).toBeGreaterThan(0);
          expect(csvText).not.toContain('**ERROR**');

          if (scenario.expectStructuredSerialization) {
            expect(String(previewTable.getCell(0, 0))).toMatch(/^[[{]/);
          }
          assertScenarioDataQuality({
            scenario,
            dataTable: previewTable,
            exportedText: csvText,
          });

          const parsed = parseSchemaTextToRows({
            schemaTextToDataRules,
            schemaText: scenario.expectedSchemaText,
            faker,
            RandExp,
            mapRuleToRow: (rule, leadingTextLines = []) => {
              const row = mapDataRuleToSchemaRow(rule);
              row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
              return row;
            },
          });
          expect(parsed.errors).toEqual([]);
          expect(parsed.rows.length).toBe(scenario.rows.length);

          if (scenario.pairwiseEligible) {
            const pairwiseTable = createPairwiseDataTable({
              generator: configured.generator,
              PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
              GenericDataTableClass: GenericDataTable,
              faker,
              RandExp,
            });
            expect(pairwiseTable).toBeTruthy();
            expect(pairwiseTable.getRowCount()).toBeGreaterThan(0);
          }
        } catch (error) {
          failures.push(`${scenario.id}: ${error.message}`);
        }
      }

      if (failures.length > 0) {
        throw new Error(failures.slice(0, 10).join('\n'));
      }
    },
    60000
  );
});
