import { jest } from '@jest/globals';
import * as generatorPreviewExports from '../../../js/gui_components/generator/preview/index.js';
import { GeneratorPreviewController } from '../../../js/gui_components/generator/preview/generator-preview-controller.js';

describe('GeneratorPreviewController', () => {
  test('preview barrel is component-factory-only', () => {
    expect(typeof generatorPreviewExports.createGeneratorPreviewComponent).toBe('function');
    expect(generatorPreviewExports.GeneratorPreviewController).toBeUndefined();
    expect(generatorPreviewExports.GeneratorPreviewView).toBeUndefined();
    expect(generatorPreviewExports.createDefaultPreviewGridFactory).toBeUndefined();
    expect(generatorPreviewExports.createTabulatorGridAdapter).toBeUndefined();
  });

  test('stores preview text and triggers preview callback', () => {
    const onPreview = jest.fn();
    const previewDataTable = { getRowCount: () => 2 };
    const controller = new GeneratorPreviewController({
      props: { outputPreviewText: 'csv:sync:2', previewDataTable },
      callbacks: { onPreview },
    });

    expect(controller.getState().outputPreviewText).toBe('csv:sync:2');
    expect(controller.getState().previewDataTable).toBe(previewDataTable);

    controller.setOutputPreviewText('json:sync:3');
    expect(controller.getState().outputPreviewText).toBe('json:sync:3');

    const nextPreviewDataTable = { getRowCount: () => 3 };
    controller.setPreviewDataTable(nextPreviewDataTable);
    expect(controller.getState().previewDataTable).toBe(nextPreviewDataTable);

    controller.triggerPreview();
    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});
