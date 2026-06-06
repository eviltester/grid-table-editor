import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorMountedPageState } from '../../../js/gui_components/generator/runtime/create-generator-mounted-page-state.js';

describe('createGeneratorMountedPageState', () => {
  test('creates exporter state, connects mounted features, and assigns them onto the runtime', () => {
    const connectMountedPage = jest.fn(() => ({
      schemaErrorDisplay: { id: 'schema-error' },
      generatorControls: { id: 'controls' },
      generatorPreview: { id: 'preview' },
      schemaDefinition: { id: 'schema-definition' },
    }));
    const createMountedPageBridge = jest.fn(() => ({
      connectMountedPage,
    }));
    const ExporterClass = jest.fn(function FakeExporter(grid) {
      this.grid = grid;
    });
    const generatorPage = { id: 'page-component' };
    const runtime = {
      ExporterClass,
      generatorViewState: {
        getPreviewGrid: jest.fn(() => ({ id: 'preview-grid' })),
      },
    };

    const mountedState = createGeneratorMountedPageState({
      runtime,
      generatorPage,
      createMountedPageBridge,
    });

    expect(createMountedPageBridge).toHaveBeenCalledTimes(1);
    expect(connectMountedPage).toHaveBeenCalledWith({
      generatorPage,
    });
    expect(ExporterClass).toHaveBeenCalledWith({ id: 'preview-grid' });
    expect(runtime).toEqual(
      expect.objectContaining({
        generatorPage,
        exporter: expect.objectContaining({ grid: { id: 'preview-grid' } }),
        schemaErrorDisplay: { id: 'schema-error' },
        generatorControls: { id: 'controls' },
        generatorPreview: { id: 'preview' },
        schemaDefinition: { id: 'schema-definition' },
      })
    );
    expect(mountedState).toEqual({
      generatorPage,
      exporter: expect.objectContaining({ grid: { id: 'preview-grid' } }),
      schemaErrorDisplay: { id: 'schema-error' },
      generatorControls: { id: 'controls' },
      generatorPreview: { id: 'preview' },
      schemaDefinition: { id: 'schema-definition' },
    });
  });
});
