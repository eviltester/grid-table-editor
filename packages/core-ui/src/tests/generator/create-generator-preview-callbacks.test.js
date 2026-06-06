import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPreviewCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-preview-callbacks.js';

describe('createGeneratorPreviewCallbacks', () => {
  test('builds preview callbacks that delegate through injected runtime boundaries', () => {
    const onPreview = jest.fn();

    const callbacks = createGeneratorPreviewCallbacks({
      onPreview,
    });

    callbacks.onPreview();

    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});
