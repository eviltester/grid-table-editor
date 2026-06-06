import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeInteractionDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-interaction-dependencies.js';

describe('createGeneratorRuntimeInteractionDependencies', () => {
  test('builds the mounted view-state and runtime-action bridges around the runtime shell', () => {
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
      generatorSchemaState: {
        getCurrentSchemaState: jest.fn(() => ({
          rows: [
            { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
            { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
          ],
          errors: [],
          isTextMode: false,
        })),
      },
      generatorSchemaGeneration: {
        getPairwiseVisibility: jest.fn(() => true),
      },
    };

    const dependencies = createGeneratorRuntimeInteractionDependencies({
      runtime,
      DownloadClass: class FakeDownload {},
      faker: {},
      RandExp: function RandExp() {},
      createUnavailableRowCountResult: () => ({ value: 0, valid: false, errors: ['unavailable'] }),
    });

    Object.assign(runtime, dependencies);

    expect(runtime.generatorViewState).toBeDefined();
    expect(runtime.generatorRuntimeActions).toBeDefined();

    const pairwiseVisible = runtime.generatorRuntimeActions.updateAllPairsButtonVisibility();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
