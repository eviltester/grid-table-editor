import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaGenerationService } from '../../../js/gui_components/generator/generation/generator-schema-generation-service.js';

describe('generator schema generation service', () => {
  test('creates session context and combination input through the shared generation helper boundary', () => {
    const syncSchemaRowsFromTextMode = jest
      .fn()
      .mockReturnValueOnce({
        rows: [{ name: 'Browser', sourceType: 'enum', value: 'chrome,firefox' }],
        errors: [],
      })
      .mockReturnValueOnce({
        rows: [
          { name: 'Browser', sourceType: 'enum', value: 'chrome,firefox' },
          { name: 'Plan', sourceType: 'enum', value: 'free,pro' },
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

    const service = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode,
      validateSchemaRows,
      schemaRowsToSpec,
      TestDataGeneratorClass,
      faker: {},
      RandExp: function RandExp() {},
    });

    const sessionContext = service.createSessionContext();
    expect(sessionContext.ok).toBe(true);
    expect(sessionContext.textSpec).toBe('Browser\nenum(chrome,firefox)');

    const combinationInput = service.getCombinationInput();
    expect(combinationInput.enumColumnCount).toBe(2);
    expect(syncSchemaRowsFromTextMode).toHaveBeenCalledTimes(3);
    expect(validateSchemaRows).toHaveBeenCalledTimes(3);
  });

  test('calculates pairwise visibility through the shared generation helper boundary', () => {
    const service = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode: jest.fn(),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec: jest.fn(),
      TestDataGeneratorClass: class FakeGenerator {},
      faker: {},
      RandExp: function RandExp() {},
    });

    const isVisible = service.getPairwiseVisibility({
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

  test('includes domain datatype.enum rows when collecting enum value counts', () => {
    const service = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode: jest.fn(() => ({
        rows: [
          { name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive,pending' },
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
        ],
        errors: [],
      })),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec: jest.fn(),
      TestDataGeneratorClass: class FakeGenerator {},
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(service.getCombinationInput().enumValueCounts).toEqual([3, 2]);
  });

  test('includes domain datatype.enum rows when counting enum columns', () => {
    const service = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode: jest.fn(() => ({
        rows: [
          { name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive,pending' },
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
        ],
        errors: [],
      })),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec: jest.fn(),
      TestDataGeneratorClass: class FakeGenerator {},
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(service.getCombinationInput().enumColumnCount).toBe(2);
  });
});
