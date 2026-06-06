import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentConfigInputs } from '../../../js/gui_components/generator/runtime/create-generator-page-component-config-inputs.js';

describe('createGeneratorPageComponentConfigInputs', () => {
  test('composes runtime dependencies with runtime callbacks', () => {
    const runtime = {
      id: 'runtime',
    };
    const runtimeDependencies = { schemaTextToDataRules: jest.fn() };
    const runtimeCallbacks = { onPreview: jest.fn() };
    const createRuntimeDependencies = jest.fn(() => runtimeDependencies);
    const createRuntimeCallbacks = jest.fn(() => runtimeCallbacks);

    const inputs = createGeneratorPageComponentConfigInputs({
      runtime,
      createRuntimeDependencies,
      createRuntimeCallbacks,
    });

    expect(createRuntimeDependencies).toHaveBeenCalledWith({ runtime });
    expect(createRuntimeCallbacks).toHaveBeenCalledWith({ runtime });
    expect(inputs).toEqual({
      ...runtimeDependencies,
      ...runtimeCallbacks,
    });
  });
});
