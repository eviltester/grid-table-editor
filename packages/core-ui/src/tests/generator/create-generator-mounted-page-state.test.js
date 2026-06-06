import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorMountedPageState } from '../../../js/gui_components/generator/runtime/create-generator-mounted-page-state.js';

describe('createGeneratorMountedPageState', () => {
  test('creates exporter state, maps mounted features directly, and assigns them onto the runtime', () => {
    const ExporterClass = jest.fn(function FakeExporter(grid) {
      this.grid = grid;
    });
    const generatorPage = {
      id: 'page-component',
      getSchemaErrorDisplay: jest.fn(() => ({ id: 'schema-error' })),
      getGeneratorControls: jest.fn(() => ({ id: 'controls' })),
      getGeneratorPreview: jest.fn(() => ({ id: 'preview' })),
      getSchemaDefinition: jest.fn(() => ({ id: 'schema-definition' })),
    };
    const runtime = {
      ExporterClass,
      generatorViewState: {
        getPreviewGrid: jest.fn(() => ({ id: 'preview-grid' })),
      },
    };

    const mountedState = createGeneratorMountedPageState({
      runtime,
      generatorPage,
    });

    expect(ExporterClass).toHaveBeenCalledWith({ id: 'preview-grid' });
    expect(generatorPage.getSchemaErrorDisplay).toHaveBeenCalledTimes(1);
    expect(generatorPage.getGeneratorControls).toHaveBeenCalledTimes(1);
    expect(generatorPage.getGeneratorPreview).toHaveBeenCalledTimes(1);
    expect(generatorPage.getSchemaDefinition).toHaveBeenCalledTimes(1);
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
