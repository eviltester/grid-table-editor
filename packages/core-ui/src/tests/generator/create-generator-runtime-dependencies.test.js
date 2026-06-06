import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-dependencies.js';

describe('createGeneratorRuntimeDependencies', () => {
  test('adds view-state and runtime-actions bridges on top of the schema runtime bundle', () => {
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
      exporter: null,
    };

    const dependencies = createGeneratorRuntimeDependencies({
      runtime,
      faker: {},
      RandExp: function RandExp() {},
      TestDataGeneratorClass: class FakeTestDataGenerator {},
      DownloadClass: class FakeDownload {},
      schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
      schemaRowsToSpec: () => '',
      schemaRowsToSpecWithTokens: () => '',
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      mapRuleToRow: () => ({ id: 'row-1', name: '', sourceType: 'enum', value: '' }),
      dataRulesToSchemaText: () => '',
      sampleSchemaText: 'Name\nenum(a,b)',
      createUnavailableRowCountResult: () => ({ value: 0, valid: false, errors: ['unavailable'] }),
    });

    Object.assign(runtime, dependencies);

    expect(runtime.fakerCommands.every((command) => command.startsWith('helpers.'))).toBe(true);
    expect(runtime.domainCommands.length).toBeGreaterThan(0);
    expect(runtime.generatorViewState).toBeDefined();
    expect(runtime.generatorRuntimeActions).toBeDefined();
    expect(runtime.generatorSchemaState.getCurrentSchemaState()).toEqual({
      rows: [
        { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
        { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
      ],
      errors: [],
      isTextMode: false,
    });

    const pairwiseVisible = runtime.generatorRuntimeActions.updateAllPairsButtonVisibility();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.schemaDefinition.getState).toHaveBeenCalled();
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
