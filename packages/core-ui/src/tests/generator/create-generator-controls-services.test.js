import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorControlsServices } from '../../../js/gui_components/generator/runtime/create-generator-controls-services.js';

describe('createGeneratorControlsServices', () => {
  test('builds the exporter-backed controls service subtree', () => {
    const exporter = {
      canExport: jest.fn(() => true),
      getOptionsForType: jest.fn(() => ({ options: { prettyPrint: true } })),
    };

    const services = createGeneratorControlsServices({
      getExporter: () => exporter,
    });

    expect(services.canExportFormat('json')).toBe(true);
    expect(services.getCurrentOptionsForFormat('json')).toEqual({
      options: { prettyPrint: true },
    });
  });
});
