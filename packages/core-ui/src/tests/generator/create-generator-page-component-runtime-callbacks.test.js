import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-callbacks.js';

describe('createGeneratorPageComponentRuntimeCallbacks', () => {
  test('composes runtime-owned controls, preview, and schema callback groups', () => {
    const runtime = { id: 'runtime' };
    const controlsCallbacks = { onApplyOptions: jest.fn() };
    const previewCallbacks = { onPreview: jest.fn() };
    const schemaCallbacks = { onSchemaError: jest.fn() };
    const createRuntimeControlsCallbacks = jest.fn(() => controlsCallbacks);
    const createRuntimePreviewCallbacks = jest.fn(() => previewCallbacks);
    const createRuntimeSchemaCallbacks = jest.fn(() => schemaCallbacks);

    const callbacks = createGeneratorPageComponentRuntimeCallbacks({
      runtime,
      createRuntimeControlsCallbacks,
      createRuntimePreviewCallbacks,
      createRuntimeSchemaCallbacks,
    });

    expect(createRuntimeControlsCallbacks).toHaveBeenCalledWith({
      runtime,
    });
    expect(createRuntimePreviewCallbacks).toHaveBeenCalledWith({
      runtime,
    });
    expect(createRuntimeSchemaCallbacks).toHaveBeenCalledWith({
      runtime,
    });
    expect(callbacks).toEqual({
      ...controlsCallbacks,
      ...previewCallbacks,
      ...schemaCallbacks,
    });
  });
});
