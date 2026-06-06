import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeDependencies } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-dependencies.js';

describe('createGeneratorPageComponentRuntimeDependencies', () => {
  test('composes schema and service dependency bundles', () => {
    const runtime = {
      id: 'runtime',
    };
    const runtimeSchemaDependencies = { schemaTextToDataRules: jest.fn() };
    const runtimeServiceDependencies = { getExporter: jest.fn() };
    const createRuntimeSchemaDependencies = jest.fn(() => runtimeSchemaDependencies);
    const createRuntimeServiceDependencies = jest.fn(() => runtimeServiceDependencies);

    const dependencies = createGeneratorPageComponentRuntimeDependencies({
      runtime,
      createRuntimeSchemaDependencies,
      createRuntimeServiceDependencies,
    });

    expect(createRuntimeSchemaDependencies).toHaveBeenCalledWith({ runtime });
    expect(createRuntimeServiceDependencies).toHaveBeenCalledWith({ runtime });
    expect(dependencies).toEqual({
      ...runtimeSchemaDependencies,
      ...runtimeServiceDependencies,
    });
  });
});
