import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimePreviewCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-preview-callbacks.js';

describe('createGeneratorPageComponentRuntimePreviewCallbacks', () => {
  test('maps runtime-owned preview behavior into preview callbacks', () => {
    const previewData = jest.fn();
    const runtime = {
      previewData,
    };

    const callbacks = createGeneratorPageComponentRuntimePreviewCallbacks({
      runtime,
    });

    callbacks.onPreview();

    expect(previewData).toHaveBeenCalledTimes(1);
  });
});
