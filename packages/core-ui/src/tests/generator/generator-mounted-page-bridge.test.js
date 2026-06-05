import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorMountedPageBridge } from '../../../js/gui_components/generator/runtime/generator-mounted-page-bridge.js';

describe('generator mounted page bridge', () => {
  test('connects mounted page features, creates exporter, and runs initial render/sync work', () => {
    const generatorPage = {
      getSchemaErrorDisplay: jest.fn(() => ({ id: 'schema-error' })),
      getGeneratorControls: jest.fn(() => ({ id: 'controls' })),
      getGeneratorPreview: jest.fn(() => ({ id: 'preview' })),
      getSchemaDefinition: jest.fn(() => ({ id: 'schema-definition' })),
    };
    const renderSchemaRows = jest.fn();
    const syncInitialFormatState = jest.fn();
    const ExporterClass = jest.fn(function FakeExporter(grid) {
      this.grid = grid;
    });

    const bridge = createGeneratorMountedPageBridge();
    const mounted = bridge.connectMountedPage({
      generatorPage,
      ExporterClass,
      getPreviewGrid: () => ({ id: 'preview-grid' }),
    });

    bridge.initializeMountedPage({
      renderSchemaRows,
      syncInitialFormatState,
    });

    expect(mounted.schemaErrorDisplay).toEqual({ id: 'schema-error' });
    expect(mounted.generatorControls).toEqual({ id: 'controls' });
    expect(mounted.generatorPreview).toEqual({ id: 'preview' });
    expect(mounted.schemaDefinition).toEqual({ id: 'schema-definition' });
    expect(ExporterClass).toHaveBeenCalledWith({ id: 'preview-grid' });
    expect(mounted.exporter.grid).toEqual({ id: 'preview-grid' });
    expect(renderSchemaRows).toHaveBeenCalledTimes(1);
    expect(syncInitialFormatState).toHaveBeenCalledTimes(1);
  });
});
