import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentServices } from '../../../js/gui_components/generator/runtime/create-generator-page-component-services.js';

describe('createGeneratorPageComponentServices', () => {
  test('builds the generator page service bundle around focused service subtrees', () => {
    const TabulatorCtor = function FakeTabulator() {};
    const GridExtensionClass = function FakeGridExtension() {};

    const services = createGeneratorPageComponentServices({
      getExporter: jest.fn(),
      TabulatorCtor,
      GridExtensionClass,
    });

    expect(services.generatorPreviewServices).toEqual({
      TabulatorCtor,
      GridExtensionClass,
    });
  });
});
