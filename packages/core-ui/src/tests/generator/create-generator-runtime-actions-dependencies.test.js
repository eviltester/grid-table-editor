import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeActionsDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-actions-dependencies.js';

describe('createGeneratorRuntimeActionsDependencies', () => {
  test('builds the runtime-actions bridge around the mounted runtime shell', () => {
    const runtime = {
      generatorViewState: {
        getSelectedOutputType: jest.fn(() => 'csv'),
        setPairwiseVisible: jest.fn(),
      },
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
      exporter: null,
    };

    const generatorRuntimeActions = createGeneratorRuntimeActionsDependencies({
      runtime,
      DownloadClass: class FakeDownload {},
      faker: {},
      RandExp: function RandExp() {},
    });

    runtime.generatorRuntimeActions = generatorRuntimeActions;

    const pairwiseVisible = generatorRuntimeActions.updateAllPairsButtonVisibility();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.generatorViewState.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
