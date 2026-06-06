import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorMountedPageBridge } from '../../../js/gui_components/generator/runtime/generator-mounted-page-bridge.js';

describe('generator mounted page bridge', () => {
  test('connects mounted page features through the mounted page component only', () => {
    const generatorPage = {
      getSchemaErrorDisplay: jest.fn(() => ({ id: 'schema-error' })),
      getGeneratorControls: jest.fn(() => ({ id: 'controls' })),
      getGeneratorPreview: jest.fn(() => ({ id: 'preview' })),
      getSchemaDefinition: jest.fn(() => ({ id: 'schema-definition' })),
    };

    const bridge = createGeneratorMountedPageBridge();
    const mounted = bridge.connectMountedPage({
      generatorPage,
    });

    expect(mounted.schemaErrorDisplay).toEqual({ id: 'schema-error' });
    expect(mounted.generatorControls).toEqual({ id: 'controls' });
    expect(mounted.generatorPreview).toEqual({ id: 'preview' });
    expect(mounted.schemaDefinition).toEqual({ id: 'schema-definition' });
  });
});
