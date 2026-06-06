import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeFacade } from '../../../js/gui_components/generator/runtime/create-generator-runtime-facade.js';

describe('createGeneratorRuntimeFacade', () => {
  test('builds the runtime facade around generator view state, actions, and lifecycle', async () => {
    const runtime = {
      generatorViewState: {
        getSelectedOutputType: jest.fn(() => 'json'),
        syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
        getPreviewRowCount: jest.fn(() => ({ value: 2, valid: true, errors: [] })),
        getGenerateRowCount: jest.fn(() => ({ value: 5, valid: true, errors: [] })),
      },
      generatorRuntimeActions: {
        applyCurrentTypeOptions: jest.fn(() => ({ applied: true })),
        previewData: jest.fn(() => 'previewed'),
        generateDataFile: jest.fn(async () => 'generated'),
        generateAllPairsDataFile: jest.fn(async () => 'pairwise'),
        updateAllPairsButtonVisibility: jest.fn(() => false),
      },
      generatorSchemaState: {
        renderSchemaRows: jest.fn(),
      },
    };
    const lifecycle = {
      init: jest.fn(),
      destroy: jest.fn(),
    };

    Object.assign(
      runtime,
      createGeneratorRuntimeFacade({
        getRuntime: () => runtime,
        lifecycle,
      })
    );

    expect(runtime.getSelectedOutputType()).toBe('json');
    expect(runtime.syncGeneratorControlsFormatStateIfChanged('csv', 'json')).toBe(true);
    expect(runtime.applyCurrentTypeOptions({ outputFormat: 'csv' })).toEqual({ applied: true });
    expect(runtime.getPreviewRowCount()).toEqual({ value: 2, valid: true, errors: [] });
    expect(runtime.getGenerateRowCount()).toEqual({ value: 5, valid: true, errors: [] });
    expect(runtime.previewData()).toBe('previewed');
    expect(runtime.updateAllPairsButtonVisibility()).toBe(false);

    runtime.renderSchemaRows();
    await runtime.generateDataFile();
    await runtime.generateAllPairsDataFile();
    runtime.init();
    runtime.destroy();

    expect(runtime.generatorSchemaState.renderSchemaRows).toHaveBeenCalledTimes(1);
    expect(runtime.generatorRuntimeActions.generateDataFile).toHaveBeenCalledTimes(1);
    expect(runtime.generatorRuntimeActions.generateAllPairsDataFile).toHaveBeenCalledTimes(1);
    expect(lifecycle.init).toHaveBeenCalledTimes(1);
    expect(lifecycle.destroy).toHaveBeenCalledTimes(1);
  });
});
