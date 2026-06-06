import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeSchemaDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-schema-dependencies.js';

describe('createGeneratorRuntimeSchemaDependencies', () => {
  test('composes schema support plus schema bridges into the runtime bundle', () => {
    const runtime = {
      schemaDefinition: {
        getState: jest.fn(() => ({
          rows: [
            { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
            { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
          ],
          isTextMode: false,
        })),
      },
      generatorControls: {
        setPairwiseVisible: jest.fn(),
      },
      schemaErrorDisplay: {
        show: jest.fn(),
        clear: jest.fn(),
      },
      generatorViewState: {
        setGenerationStatus: jest.fn(),
        scheduleClearGenerationStatus: jest.fn(),
      },
    };

    const dependencies = createGeneratorRuntimeSchemaDependencies({
      runtime,
      faker: {},
      RandExp: function RandExp() {},
      TestDataGeneratorClass: class FakeTestDataGenerator {},
      schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
      schemaRowsToSpec: () => '',
      schemaRowsToSpecWithTokens: () => '',
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      mapRuleToRow: () => ({ id: 'row-1', name: '', sourceType: 'enum', value: '' }),
      dataRulesToSchemaText: () => '',
      sampleSchemaText: 'Name\nenum(a,b)',
    });

    Object.assign(runtime, dependencies);
    runtime.updateAllPairsButtonVisibility = jest.fn(() => {
      const isVisible = runtime.generatorSchemaGeneration.getPairwiseVisibility({
        getCurrentSchemaState: () => runtime.generatorSchemaState.getCurrentSchemaState(),
      });
      runtime.generatorControls.setPairwiseVisible(isVisible);
      return isVisible;
    });

    expect(runtime.fakerCommands.every((command) => command.startsWith('helpers.'))).toBe(true);
    expect(runtime.domainCommands.length).toBeGreaterThan(0);
    expect(runtime.generatorSchemaDefinitionSupport).toBeDefined();
    expect(runtime.schemaSession).toBeDefined();
    expect(runtime.generatorSchemaRuntime).toBeDefined();
    expect(runtime.generatorSchemaGeneration).toBeDefined();
    expect(runtime.generatorSchemaState.getCurrentSchemaState()).toEqual({
      rows: [
        { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
        { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
      ],
      errors: [],
      isTextMode: false,
    });

    const pairwiseVisible = runtime.generatorSchemaGeneration.getPairwiseVisibility({
      getCurrentSchemaState: () => runtime.generatorSchemaState.getCurrentSchemaState(),
    });
    runtime.generatorSchemaState.renderSchemaRows();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.schemaDefinition.getState).toHaveBeenCalled();
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
