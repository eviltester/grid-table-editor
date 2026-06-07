import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageServices } from '../../../js/gui_components/generator/runtime/create-generator-page-services.js';

describe('createGeneratorPageServices', () => {
  test('builds the mounted view-state and runtime-action services around the runtime', () => {
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
      generatorSchemaGenerationService: {
        getPairwiseVisibility: jest.fn(() => true),
      },
    };

    const services = createGeneratorPageServices({
      runtime,
      DownloadClass: class FakeDownload {},
      faker: {},
      RandExp: function RandExp() {},
      createUnavailableRowCountResult: () => ({ value: 0, valid: false, errors: ['unavailable'] }),
    });

    Object.assign(runtime, services);

    expect(runtime.generatorViewState).toBeDefined();
    expect(runtime.generatorRuntimeActions).toBeDefined();

    const pairwiseVisible = runtime.generatorRuntimeActions.updateAllPairsButtonVisibility();

    expect(pairwiseVisible).toBe(true);
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
