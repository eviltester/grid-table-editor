import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageActionsService } from '../../../js/gui_components/generator/runtime/generator-page-actions-service.js';

describe('createGeneratorPageActionsService', () => {
  test('builds runtime actions around the mounted runtime services', () => {
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
      generatorSchemaGenerationService: {
        getPairwiseVisibility: jest.fn(() => true),
      },
      exporter: null,
    };

    const generatorRuntimeActions = createGeneratorPageActionsService({
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
