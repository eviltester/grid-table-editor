import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeLifecycleFacade } from '../../../js/gui_components/generator/runtime/create-generator-runtime-lifecycle-facade.js';

describe('createGeneratorRuntimeLifecycleFacade', () => {
  test('builds the lifecycle-backed runtime facade around the provided base state', async () => {
    const mountState = { generatorPage: { destroy: jest.fn() }, mounted: true };
    const createPageRuntimeMount = jest.fn(() => mountState);
    const generatorViewState = {
      getSelectedOutputType: jest.fn(() => 'json'),
      syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
      getPreviewRowCount: jest.fn(() => ({ value: 2, valid: true, errors: [] })),
      getGenerateRowCount: jest.fn(() => ({ value: 5, valid: true, errors: [] })),
    };
    const generatorRuntimeActions = {
      applyCurrentTypeOptions: jest.fn(() => ({ applied: true })),
      previewData: jest.fn(() => 'previewed'),
      generateDataFile: jest.fn(async () => 'generated'),
      generateAllPairsDataFile: jest.fn(async () => 'pairwise'),
      updateAllPairsButtonVisibility: jest.fn(() => false),
    };
    const generatorSchemaState = {
      renderSchemaRows: jest.fn(),
    };

    const runtime = createGeneratorRuntimeLifecycleFacade({
      baseState: {
        parentElement: { id: 'root' },
        TabulatorCtor: function FakeTabulator() {},
        generatorViewState,
        generatorRuntimeActions,
        generatorSchemaState,
      },
      createPageRuntimeMount,
    });

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
    expect(createPageRuntimeMount).toHaveBeenCalledWith({ runtime });
    expect(runtime.generatorPage.destroy).toHaveBeenCalledTimes(1);
    expect(runtime.mounted).toBe(true);
  });
});
