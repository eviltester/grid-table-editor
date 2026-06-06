import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeDependenciesFactory } from '../../../js/gui_components/generator/runtime/create-generator-runtime-dependencies-factory.js';

describe('createGeneratorRuntimeDependenciesFactory', () => {
  test('builds a runtime dependency factory that preserves runtime-driven wiring', () => {
    const schemaTextToDataRules = jest.fn();
    const schemaRowsToSpec = jest.fn();
    const schemaRowsToSpecWithTokens = jest.fn();
    const validateSchemaRows = jest.fn();
    const dataRulesToSchemaText = jest.fn();
    const sampleSchemaText = 'Name\nenum(a,b)';

    const createRuntimeDependencies = createGeneratorRuntimeDependenciesFactory({
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    });

    expect(typeof createRuntimeDependencies).toBe('function');

    const runtime = {
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TestDataGeneratorClass: class FakeGenerator {},
      DownloadClass: class FakeDownload {},
      generatorSchemaDefinitionSupport: {
        mapRuleToRow: jest.fn(() => ({ id: 'row-1' })),
      },
    };

    const dependencies = createRuntimeDependencies({
      runtime,
    });

    expect(dependencies.generatorSchemaRuntime).toBeDefined();
    expect(dependencies.generatorSchemaState).toBeDefined();
    expect(dependencies.generatorRuntimeActions).toBeDefined();
    expect(dependencies.generatorViewState).toBeDefined();
  });
});
