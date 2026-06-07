import { jest } from '@jest/globals';
import * as textPreviewEditorExports from '../../../js/gui_components/app/text-preview-editor/index.js';
import { TextPreviewEditorController } from '../../../js/gui_components/app/text-preview-editor/text-preview-editor-controller.js';

describe('TextPreviewEditorController', () => {
  test('public barrel is component-factory-only', () => {
    expect(typeof textPreviewEditorExports.createTextPreviewEditorComponent).toBe('function');
    expect(textPreviewEditorExports.TextPreviewEditorController).toBeUndefined();
    expect(textPreviewEditorExports.TextPreviewEditorView).toBeUndefined();
  });

  test('normalizes preview row limit props and updates into the supported 1..50 range', () => {
    const onPreviewRowLimitChange = jest.fn();
    const controller = new TextPreviewEditorController({
      props: {
        previewRowLimit: 0,
      },
      callbacks: {
        onPreviewRowLimitChange,
      },
    });

    expect(controller.getState().previewRowLimit).toBe(1);

    controller.setPreviewRowLimit(99);
    expect(controller.getState().previewRowLimit).toBe(50);
    expect(onPreviewRowLimitChange).toHaveBeenLastCalledWith(50);

    controller.setPreviewRowLimit('abc');
    expect(controller.getState().previewRowLimit).toBe(10);
    expect(onPreviewRowLimitChange).toHaveBeenLastCalledWith(10);

    controller.updateProps({ previewRowLimit: 12 });
    expect(controller.getState().previewRowLimit).toBe(12);
  });
});
