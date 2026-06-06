import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeControlsCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-controls-callbacks.js';

describe('createGeneratorPageComponentRuntimeControlsCallbacks', () => {
  test('maps runtime-owned controls behavior into controls callbacks', () => {
    const applyCurrentTypeOptions = jest.fn();
    const generateDataFile = jest.fn(async () => {});
    const generateAllPairsDataFile = jest.fn(async () => {});
    const renderOutputPreviewForCurrentSelection = jest.fn();
    const runtime = {
      applyCurrentTypeOptions,
      generateDataFile,
      generateAllPairsDataFile,
      generatorViewState: {
        renderOutputPreviewForCurrentSelection,
      },
    };

    const callbacks = createGeneratorPageComponentRuntimeControlsCallbacks({
      runtime,
    });

    callbacks.onApplyOptions({ outputFormat: 'json' });
    callbacks.onGenerateData();
    callbacks.onGeneratePairwise();
    callbacks.onRenderOutputPreview();

    expect(applyCurrentTypeOptions).toHaveBeenCalledWith({
      outputFormat: 'json',
    });
    expect(generateDataFile).toHaveBeenCalledTimes(1);
    expect(generateAllPairsDataFile).toHaveBeenCalledTimes(1);
    expect(renderOutputPreviewForCurrentSelection).toHaveBeenCalledTimes(1);
  });
});
