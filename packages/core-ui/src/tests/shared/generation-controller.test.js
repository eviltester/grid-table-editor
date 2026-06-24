import {
  createConfiguredGeneratorFromSchemaText,
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
  createCombinationsDataTable,
} from '../../../js/gui_components/shared/test-data/generation/generation-controller.js';
import { isNWiseEligibleForSchemaRows } from '../../../js/gui_components/shared/test-data/generation/ui-derived-state.js';
import { jest } from '@jest/globals';

class FakeGenericDataTable {
  constructor() {
    this.headers = [];
    this.rows = [];
  }
  setHeaders(headers) {
    this.headers = headers;
  }
  appendDataRow(row) {
    this.rows.push(row);
  }
  getRowCount() {
    return this.rows.length;
  }
}

describe('generation-controller', () => {
  test('row-based generation helpers remain available through direct modules', () => {
    expect(typeof createConfiguredGeneratorFromSchemaRows).toBe('function');
    expect(typeof isNWiseEligibleForSchemaRows).toBe('function');
  });

  test('creates generator from schema text parse result', () => {
    class FakeGenerator {
      constructor() {
        this.rulesParser = { testDataRules: { rules: [] } };
      }
    }

    const result = createConfiguredGeneratorFromSchemaText({
      schemaTextToDataRules: jest.fn().mockReturnValue({
        dataRules: [{ name: 'First', ruleSpec: 'person.firstName()', type: 'faker' }],
        errors: [],
        schemaTokens: [],
      }),
      schemaText: 'First\nperson.firstName()',
      TestDataGeneratorClass: FakeGenerator,
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(result.errors).toEqual([]);
    expect(result.generator.rulesParser.testDataRules.rules).toEqual([
      { name: 'First', ruleSpec: 'person.firstName()', type: 'faker' },
    ]);
  });

  test('creates configured generator from schema rows and rewrites literal rules', () => {
    class FakeGenerator {
      constructor() {
        this.importSpec = jest.fn();
        this.compile = jest.fn();
        this.compiler = { validate: jest.fn() };
        this._rules = [{}, {}];
      }
      testDataRules() {
        return this._rules;
      }
      isValid() {
        return true;
      }
      errors() {
        return [];
      }
    }

    const result = createConfiguredGeneratorFromSchemaRows({
      schemaRows: [
        { name: 'Code', sourceType: 'regex', value: '[A-Z]{2}' },
        { name: 'Fixed', sourceType: 'literal', value: 'literal("")' },
      ],
      validateSchemaRows: () => ({
        errors: [],
        rows: [
          { name: 'Code', sourceType: 'regex', value: '[A-Z]{2}' },
          { name: 'Fixed', sourceType: 'literal', value: 'literal("")' },
        ],
      }),
      schemaRowsToSpec: () => 'Code\n[A-Z]{2}\nFixed\nliteral("")',
      TestDataGeneratorClass: FakeGenerator,
      faker: {},
      RandExp: function RandExp() {},
      buildRuleSpecFromSchemaRow: (row) => row.value,
      extractLiteralValueFromRuleSpec: (value) => (value === 'literal("")' ? '' : value),
      extractRegexValueFromRuleSpec: (value) => value,
      SOURCE_TYPE_FAKER: 'faker',
      SOURCE_TYPE_DOMAIN: 'domain',
      SOURCE_TYPE_LITERAL: 'literal',
      SOURCE_TYPE_ENUM: 'enum',
      SOURCE_TYPE_REGEX: 'regex',
    });

    expect(result.errors).toEqual([]);
    expect(result.generator.testDataRules()[0]).toEqual({ type: 'regex', ruleSpec: '[A-Z]{2}' });
    expect(result.generator.testDataRules()[1]).toEqual({ type: 'literal', ruleSpec: '' });
  });

  test('creates configured generator from composed schema text when provided', () => {
    const schemaTextToDataRules = jest.fn().mockReturnValue({
      dataRules: [{ name: 'Status', ruleSpec: 'enum("Open","Closed")', type: 'enum' }],
      errors: [],
      schemaTokens: [
        { kind: 'rule' },
        { kind: 'constraint', text: 'IF [Status] = "Open" THEN [Status] = "Closed" ENDIF' },
      ],
      constraints: [{ sourceText: 'IF [Status] = "Open" THEN [Status] = "Closed" ENDIF' }],
      generator: { generatedFromText: true },
    });

    const result = createConfiguredGeneratorFromSchemaRows({
      schemaRows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
      validateSchemaRows: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
      }),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum("Open","Closed")'),
      schemaText: 'Status\nenum("Open","Closed")\n\nIF [Status] = "Open" THEN [Status] = "Closed" ENDIF',
      schemaTextToDataRules,
      TestDataGeneratorClass: class {},
      faker: {},
      RandExp: function RandExp() {},
      buildRuleSpecFromSchemaRow: (row) => row.value,
      extractLiteralValueFromRuleSpec: (value) => value,
      extractRegexValueFromRuleSpec: (value) => value,
      SOURCE_TYPE_FAKER: 'faker',
      SOURCE_TYPE_DOMAIN: 'domain',
      SOURCE_TYPE_LITERAL: 'literal',
      SOURCE_TYPE_ENUM: 'enum',
      SOURCE_TYPE_REGEX: 'regex',
    });

    expect(schemaTextToDataRules).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaText: 'Status\nenum("Open","Closed")\n\nIF [Status] = "Open" THEN [Status] = "Closed" ENDIF',
      })
    );
    expect(result.generator).toEqual({ generatedFromText: true });
    expect(result.errors).toEqual([]);
  });

  test('normalizes datatype.enum rows to canonical domain rules for generation', () => {
    class FakeGenerator {
      constructor() {
        this.importSpec = jest.fn();
        this.compile = jest.fn();
        this.compiler = { validate: jest.fn() };
        this._rules = [{}];
      }
      testDataRules() {
        return this._rules;
      }
      isValid() {
        return true;
      }
      errors() {
        return [];
      }
    }

    const result = createConfiguredGeneratorFromSchemaRows({
      schemaRows: [{ name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive' }],
      validateSchemaRows: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive' }],
      }),
      schemaRowsToSpec: () => 'Status\nenum(active,inactive)',
      TestDataGeneratorClass: FakeGenerator,
      faker: {},
      RandExp: function RandExp() {},
      buildRuleSpecFromSchemaRow: () => 'enum(active,inactive)',
      extractLiteralValueFromRuleSpec: (value) => value,
      extractRegexValueFromRuleSpec: (value) => value,
      SOURCE_TYPE_FAKER: 'faker',
      SOURCE_TYPE_DOMAIN: 'domain',
      SOURCE_TYPE_LITERAL: 'literal',
      SOURCE_TYPE_ENUM: 'enum',
      SOURCE_TYPE_REGEX: 'regex',
    });

    expect(result.errors).toEqual([]);
    expect(result.generator.testDataRules()[0]).toEqual({
      type: 'domain',
      ruleSpec: 'datatype.enum("active", "inactive")',
    });
  });

  test('creates preview and pairwise tables through shared adapters', () => {
    const previewTable = createPreviewDataTable({
      rowCount: 2,
      generator: {
        generateHeadersArray: () => ['First'],
        generateRow: () => ['Ada'],
      },
      GenericDataTableClass: FakeGenericDataTable,
    });

    expect(previewTable.headers).toEqual(['First']);
    expect(previewTable.getRowCount()).toBe(2);

    class FakePairwiseGenerator {
      initializeFromRules() {
        return { isError: false };
      }
      generateAllDataRecordsAsRows() {
        return {
          isError: false,
          data: {
            data: [
              ['A', 'B'],
              ['x', 'y'],
            ],
          },
        };
      }
    }

    const pairwiseTable = createPairwiseDataTable({
      generator: { testDataRules: () => [{ type: 'enum' }, { type: 'enum' }] },
      PairwiseTestDataGeneratorClass: FakePairwiseGenerator,
      GenericDataTableClass: FakeGenericDataTable,
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(pairwiseTable.headers).toEqual(['A', 'B']);
    expect(pairwiseTable.rows).toEqual([['x', 'y']]);
  });

  test('creates combinations table through the shared n-wise adapter', () => {
    class FakeCombinationsGenerator {
      initializeFromRules(rules, options) {
        this.rules = rules;
        this.options = options;
        return { isError: false };
      }
      generateAllDataRecordsAsRows() {
        return {
          isError: false,
          data: {
            data: [
              ['A', 'B', 'C'],
              ['x', 'y', 'z'],
            ],
            stats: { strength: this.options.strength, algorithm: this.options.algorithm },
          },
        };
      }
    }

    const table = createCombinationsDataTable({
      generator: { testDataRules: () => [{ type: 'enum' }, { type: 'enum' }, { type: 'enum' }] },
      CombinationsTestDataGeneratorClass: FakeCombinationsGenerator,
      GenericDataTableClass: FakeGenericDataTable,
      faker: {},
      RandExp: function RandExp() {},
      options: { strength: 3, algorithm: 'greedy' },
    });

    expect(table.headers).toEqual(['A', 'B', 'C']);
    expect(table.rows).toEqual([['x', 'y', 'z']]);
    expect(table.__combinationStats).toEqual({ strength: 3, algorithm: 'greedy' });
  });

  test('returns null when combinations initialization fails', () => {
    class FakeCombinationsGenerator {
      initializeFromRules() {
        return { isError: true, errorMessage: 'bad init' };
      }
    }

    const table = createCombinationsDataTable({
      generator: { testDataRules: () => [{ type: 'enum' }, { type: 'enum' }] },
      CombinationsTestDataGeneratorClass: FakeCombinationsGenerator,
      GenericDataTableClass: FakeGenericDataTable,
      faker: {},
      RandExp: function RandExp() {},
      options: { strength: 2, algorithm: 'pairwise' },
    });

    expect(table).toBeNull();
  });

  test('returns null when combinations generation fails after initialization', () => {
    class FakeCombinationsGenerator {
      initializeFromRules() {
        return { isError: false };
      }
      generateAllDataRecordsAsRows() {
        return { isError: true, errorMessage: 'bad generation' };
      }
    }

    const table = createCombinationsDataTable({
      generator: { testDataRules: () => [{ type: 'enum' }, { type: 'enum' }] },
      CombinationsTestDataGeneratorClass: FakeCombinationsGenerator,
      GenericDataTableClass: FakeGenericDataTable,
      faker: {},
      RandExp: function RandExp() {},
      options: { strength: 2, algorithm: 'pairwise' },
    });

    expect(table).toBeNull();
  });

  test('falls back to null combination stats when combinations output omits stats', () => {
    class FakeCombinationsGenerator {
      initializeFromRules() {
        return { isError: false };
      }
      generateAllDataRecordsAsRows() {
        return {
          isError: false,
          data: {
            data: [
              ['A', 'B'],
              ['x', 'y'],
            ],
          },
        };
      }
    }

    const table = createCombinationsDataTable({
      generator: { testDataRules: () => [{ type: 'enum' }, { type: 'enum' }] },
      CombinationsTestDataGeneratorClass: FakeCombinationsGenerator,
      GenericDataTableClass: FakeGenericDataTable,
      faker: {},
      RandExp: function RandExp() {},
      options: { strength: 2, algorithm: 'pairwise' },
    });

    expect(table.__combinationStats).toBeNull();
  });
});
