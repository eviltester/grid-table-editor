import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeViewStateDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-view-state-dependencies.js';

describe('createGeneratorRuntimeViewStateDependencies', () => {
  test('builds the view-state bridge around the mounted runtime shell', () => {
    const runtime = {
      generatorControls: {
        getState: jest.fn(() => ({ selectedFormat: 'json' })),
        setPairwiseVisible: jest.fn(),
      },
      generatorPreview: {
        renderOutputPreview: jest.fn(),
      },
      exporter: { type: 'fake-exporter' },
    };

    const generatorViewState = createGeneratorRuntimeViewStateDependencies({
      runtime,
      createUnavailableRowCountResult: jest.fn(() => ({
        value: 0,
        valid: false,
        errors: ['unavailable'],
      })),
    });

    expect(generatorViewState.getSelectedOutputType()).toBe('json');

    generatorViewState.renderOutputPreviewForCurrentSelection();
    generatorViewState.setPairwiseVisible(true);

    expect(runtime.generatorPreview.renderOutputPreview).toHaveBeenCalledWith('json', runtime.exporter);
    expect(runtime.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
