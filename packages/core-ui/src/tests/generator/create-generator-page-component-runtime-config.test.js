import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeConfig } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-config.js';

describe('createGeneratorPageComponentRuntimeConfig', () => {
  test('composes runtime config inputs with the page config builder', () => {
    const runtime = { id: 'runtime' };
    const configInputs = { fakerCommands: ['helpers.fake'] };
    const config = { props: { controlsProps: { selectedFormat: 'csv' } } };
    const createPageComponentConfigInputs = jest.fn(() => configInputs);
    const createPageComponentConfigFn = jest.fn(() => config);

    const result = createGeneratorPageComponentRuntimeConfig({
      runtime,
      createPageComponentConfigInputs,
      createPageComponentConfigFn,
    });

    expect(createPageComponentConfigInputs).toHaveBeenCalledWith({
      runtime,
    });
    expect(createPageComponentConfigFn).toHaveBeenCalledWith(configInputs);
    expect(result).toBe(config);
  });
});
