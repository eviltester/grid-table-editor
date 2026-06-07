import { jest } from '@jest/globals';
import { TextPreviewToolbarController } from '../../../js/gui_components/app/text-preview-toolbar/text-preview-toolbar-controller.js';

describe('TextPreviewToolbarController', () => {
  test('normalizes preview row limit props and updates into the supported 1..50 range', () => {
    const onPreviewRowLimitChange = jest.fn();
    const controller = new TextPreviewToolbarController({
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

  test('emits mode, auto preview, and copy actions through callbacks', () => {
    const onToggleMode = jest.fn();
    const onAutoPreviewChange = jest.fn();
    const onCopyText = jest.fn();
    const controller = new TextPreviewToolbarController({
      callbacks: {
        onToggleMode,
        onAutoPreviewChange,
        onCopyText,
      },
    });

    controller.toggleMode();
    controller.setAutoPreviewEnabled(true);
    controller.copyText({ button: { id: 'copy' } });

    expect(onToggleMode).toHaveBeenCalledTimes(1);
    expect(onAutoPreviewChange).toHaveBeenCalledWith(true);
    expect(onCopyText).toHaveBeenCalledWith({ button: { id: 'copy' } });
  });
});
