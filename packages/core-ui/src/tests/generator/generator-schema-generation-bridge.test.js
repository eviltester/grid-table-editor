import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaGenerationBridge } from '../../../js/gui_components/generator/generation/index.js';

describe('generator schema generation bridge', () => {
  test('creates configured generators and enum counts through shared generation helpers', () => {
    const syncSchemaRowsFromTextMode = jest
      .fn()
      .mockReturnValueOnce({
        rows: [{ name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox)' }],
        errors: [],
      })
      .mockReturnValueOnce({
        rows: [
          { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox)' },
          { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro)' },
        ],
        errors: [],
      });

    const validateRowsResult = { rows: [], errors: [] };
    const validateSchemaRows = jest.fn((rows) => ({ ...validateRowsResult, rows }));
    const schemaRowsToSpec = jest.fn(() => 'Browser\nenum(chrome,firefox)');
    const TestDataGeneratorClass = class FakeGenerator {
      constructor() {
        this.compiler = {
          validate: jest.fn(),
        };
        this.rulesParser = { testDataRules: { rules: [] } };
        this._rules = [{}, {}];
      }

      importSpec(spec) {
        this.spec = spec;
      }

      compile() {}

      testDataRules() {
        return this._rules;
      }

      isValid() {
        return true;
      }

      errors() {
        return [];
      }
    };

    const bridge = createGeneratorSchemaGenerationBridge({
      syncSchemaRowsFromTextMode,
      validateSchemaRows,
      schemaRowsToSpec,
      TestDataGeneratorClass,
      faker: {},
      RandExp: function RandExp() {},
    });

    const configured = bridge.createConfiguredGenerator();
    expect(configured.errors).toEqual([]);
    expect(configured.generator).toBeInstanceOf(TestDataGeneratorClass);
    expect(configured.generator.spec).toBe('Browser\nenum(chrome,firefox)');

    const enumCount = bridge.countEnumColumns();
    expect(enumCount).toBe(2);
    expect(syncSchemaRowsFromTextMode).toHaveBeenCalledTimes(2);
    expect(validateSchemaRows).toHaveBeenCalledTimes(2);
  });

  test('calculates pairwise visibility through the shared generation helper boundary', () => {
    const bridge = createGeneratorSchemaGenerationBridge({
      syncSchemaRowsFromTextMode: jest.fn(),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec: jest.fn(),
      TestDataGeneratorClass: class FakeGenerator {},
      faker: {},
      RandExp: function RandExp() {},
    });

    const isVisible = bridge.getPairwiseVisibility({
      getCurrentSchemaState: () => ({
        rows: [
          { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
        errors: [],
      }),
    });

    expect(isVisible).toBe(true);
  });
});
