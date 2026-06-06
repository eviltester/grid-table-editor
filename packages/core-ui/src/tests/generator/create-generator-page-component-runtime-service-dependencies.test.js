import { describe, expect, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeServiceDependencies } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-service-dependencies.js';

describe('createGeneratorPageComponentRuntimeServiceDependencies', () => {
  test('maps runtime-owned exporter and grid service handles', () => {
    const exporter = { id: 'exporter' };
    const runtime = {
      exporter,
      TabulatorCtor: function FakeTabulator() {},
      GridExtensionClass: class FakeGridExtension {},
    };

    const dependencies = createGeneratorPageComponentRuntimeServiceDependencies({
      runtime,
    });

    expect(dependencies.getExporter()).toBe(exporter);
    expect(dependencies.TabulatorCtor).toBe(runtime.TabulatorCtor);
    expect(dependencies.GridExtensionClass).toBe(runtime.GridExtensionClass);
  });
});
