import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-page-component-callbacks.js';

describe('createGeneratorPageComponentCallbacks', () => {
  test('builds callback groups that delegate through injected runtime boundaries', () => {
    const onPreview = jest.fn();

    const callbacks = createGeneratorPageComponentCallbacks({
      onPreview,
    });

    callbacks.generatorPreview.onPreview();

    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});
