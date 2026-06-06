import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorControlsCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-controls-callbacks.js';

describe('createGeneratorControlsCallbacks', () => {
  test('builds controls callbacks that delegate through injected runtime boundaries', () => {
    const onApplyOptions = jest.fn();
    const onGenerateData = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onRenderOutputPreview = jest.fn();

    const callbacks = createGeneratorControlsCallbacks({
      onApplyOptions,
      onGenerateData,
      onGeneratePairwise,
      onRenderOutputPreview,
    });

    callbacks.onFormatChanged();
    callbacks.onApplyOptions({ sanitized: { outputFormat: 'json' } });
    callbacks.onGenerateData();
    callbacks.onGeneratePairwise();

    expect(onRenderOutputPreview).toHaveBeenCalledTimes(1);
    expect(onApplyOptions).toHaveBeenCalledWith({ outputFormat: 'json' });
    expect(onGenerateData).toHaveBeenCalledTimes(1);
    expect(onGeneratePairwise).toHaveBeenCalledTimes(1);
  });
});
