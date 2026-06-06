import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeShell } from '../../../js/gui_components/generator/runtime/create-generator-runtime-shell.js';

describe('createGeneratorRuntimeShell', () => {
  test('attaches injected dependency bundles onto the runtime core', () => {
    const dependencyBundle = {
      generatorViewState: {
        getSelectedOutputType: jest.fn(() => 'json'),
      },
      generatorRuntimeActions: {
        previewData: jest.fn(() => 'previewed'),
      },
      generatorSchemaState: {
        getRows: jest.fn(() => [{ id: 'row-1' }]),
      },
      extraDependency: { attached: true },
    };
    const createRuntimeDependencies = jest.fn(() => dependencyBundle);

    const runtime = createGeneratorRuntimeShell({
      baseState: {
        parentElement: { id: 'root' },
        TabulatorCtor: function FakeTabulator() {},
      },
      createPageRuntimeMount: jest.fn(() => ({})),
      createRuntimeDependencies,
    });

    expect(createRuntimeDependencies).toHaveBeenCalledWith({ runtime });
    expect(runtime.generatorViewState).toBe(dependencyBundle.generatorViewState);
    expect(runtime.generatorRuntimeActions).toBe(dependencyBundle.generatorRuntimeActions);
    expect(runtime.generatorSchemaState).toBe(dependencyBundle.generatorSchemaState);
    expect(runtime.extraDependency).toEqual({ attached: true });
  });

  test('keeps the runtime core facade available after dependency attachment', () => {
    const createRuntimeDependencies = jest.fn(() => ({
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
        getRows: jest.fn(() => [{ id: 'row-1' }]),
        setRows: jest.fn(),
        getTokens: jest.fn(() => [{ kind: 'rule' }]),
        setTokens: jest.fn(),
        getTextMode: jest.fn(() => true),
        setTextMode: jest.fn(),
      },
    }));

    const runtime = createGeneratorRuntimeShell({
      baseState: {
        parentElement: { id: 'root' },
        TabulatorCtor: function FakeTabulator() {},
      },
      createPageRuntimeMount: jest.fn(() => ({})),
      createRuntimeDependencies,
    });

    expect(runtime.getSelectedOutputType()).toBe('json');
    expect(runtime.syncGeneratorControlsFormatStateIfChanged('csv', 'json')).toBe(true);
    expect(runtime.applyCurrentTypeOptions({ outputFormat: 'csv' })).toEqual({ applied: true });
    expect(runtime.getPreviewRowCount()).toEqual({ value: 2, valid: true, errors: [] });
    expect(runtime.getGenerateRowCount()).toEqual({ value: 5, valid: true, errors: [] });
    expect(runtime.previewData()).toBe('previewed');
    expect(runtime.updateAllPairsButtonVisibility()).toBe(false);
    expect(runtime.schemaRows).toEqual([{ id: 'row-1' }]);
  });
});
