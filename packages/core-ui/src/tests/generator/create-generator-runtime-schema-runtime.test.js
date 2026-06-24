import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageSchemaServices } from '../../../js/gui_components/generator/runtime/create-generator-page-schema-services.js';
import { FORBIDDEN_FAKER_COMMANDS } from '../../../js/gui_components/shared/faker-commands.js';

describe('createGeneratorPageSchemaServices', () => {
  test('builds the generator schema support, session, runtime, generation service, and state services together', () => {
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
    };

    const schemaRuntime = createGeneratorPageSchemaServices({
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

    Object.assign(runtime, schemaRuntime);
    runtime.updateAllPairsButtonVisibility = jest.fn(() => {
      const isVisible = runtime.generatorSchemaGenerationService.getPairwiseVisibility({
        getCurrentSchemaState: () => runtime.generatorSchemaState.getCurrentSchemaState(),
      });
      runtime.generatorControls.setPairwiseVisible(isVisible);
      return isVisible;
    });

    expect(runtime.fakerCommands.every((command) => command.startsWith('helpers.'))).toBe(true);
    FORBIDDEN_FAKER_COMMANDS.forEach((command) => {
      expect(runtime.fakerCommands).not.toContain(command);
    });
    expect(runtime.domainCommands.length).toBeGreaterThan(0);
    expect(runtime.generatorSchemaDefinitionSupport).toBeDefined();
    expect(runtime.schemaSession).toBeDefined();
    expect(runtime.generatorSchemaRuntime).toBeDefined();
    expect(runtime.generatorSchemaGenerationService).toBeDefined();
    expect(runtime.generatorSchemaState).toBeDefined();
    expect(runtime.generatorSchemaState.getCurrentSchemaState()).toEqual({
      rows: [
        { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
        { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
      ],
      errors: [],
      isTextMode: false,
    });

    const pairwiseVisible = runtime.generatorSchemaGenerationService.getPairwiseVisibility({
      getCurrentSchemaState: () => runtime.generatorSchemaState.getCurrentSchemaState(),
    });
    runtime.generatorSchemaState.renderSchemaRows();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.schemaDefinition.getState).toHaveBeenCalled();
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
