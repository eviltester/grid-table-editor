import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageViewState } from '../../../js/gui_components/generator/runtime/generator-page-view-state.js';

describe('createGeneratorPageViewState', () => {
  test('builds view-state behavior around the mounted runtime', () => {
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

    const generatorViewState = createGeneratorPageViewState({
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
