import { describe, expect, test } from '@jest/globals';
import { createGeneratorPreviewServices } from '../../../js/gui_components/generator/runtime/create-generator-preview-services.js';

describe('createGeneratorPreviewServices', () => {
  test('builds preview services from the injected grid adapter types', () => {
    const TabulatorCtor = function FakeTabulator() {};
    const GridExtensionClass = function FakeGridExtension() {};

    const services = createGeneratorPreviewServices({
      TabulatorCtor,
      GridExtensionClass,
    });

    expect(services).toEqual({
      TabulatorCtor,
      GridExtensionClass,
    });
  });
});
