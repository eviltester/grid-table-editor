import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeSchemaBridges } from '../../../js/gui_components/generator/runtime/create-generator-runtime-schema-bridges.js';

describe('createGeneratorRuntimeSchemaBridges', () => {
  test('builds the runtime, generation, and state bridges for the generator schema layer', () => {
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
      schemaErrorDisplay: {
        show: jest.fn(),
        clear: jest.fn(),
      },
      generatorViewState: {
        setGenerationStatus: jest.fn(),
        scheduleClearGenerationStatus: jest.fn(),
      },
      generatorControls: {
        setPairwiseVisible: jest.fn(),
      },
      schemaSession: {
        renderRows: jest.fn(() => []),
        getRows: jest.fn(() => []),
        getTokens: jest.fn(() => []),
        getTextMode: jest.fn(() => false),
        setRows: jest.fn(),
        setTokens: jest.fn(),
        setTextMode: jest.fn(),
      },
    };

    const bridges = createGeneratorRuntimeSchemaBridges({
      runtime,
      faker: {},
      RandExp: function RandExp() {},
      TestDataGeneratorClass: class FakeTestDataGenerator {},
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      schemaRowsToSpec: () => '',
    });

    Object.assign(runtime, bridges);
    runtime.updateAllPairsButtonVisibility = jest.fn(() => {
      const isVisible = runtime.generatorSchemaGeneration.getPairwiseVisibility({
        getCurrentSchemaState: () => runtime.generatorSchemaState.getCurrentSchemaState(),
      });
      runtime.generatorControls.setPairwiseVisible(isVisible);
      return isVisible;
    });

    expect(runtime.generatorSchemaRuntime).toBeDefined();
    expect(runtime.generatorSchemaGeneration).toBeDefined();
    expect(runtime.generatorSchemaState).toBeDefined();
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
