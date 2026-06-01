import { TextPreviewEditorController } from './text-preview-editor-controller.js';
import { TextPreviewEditorView } from './text-preview-editor-view.js';

function createTextPreviewEditorComponent({ root, props = {}, callbacks = {}, documentObj = document } = {}) {
  const controller = new TextPreviewEditorController({ props, callbacks });
  const view = new TextPreviewEditorView({
    root,
    controller,
    documentObj,
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
    getFormatSelectorRoot() {
      return view.getFormatSelectorRoot();
    },
    getFormatSubtasksRoot() {
      return view.getFormatSubtasksRoot();
    },
  };
}

export { createTextPreviewEditorComponent, TextPreviewEditorController, TextPreviewEditorView };
