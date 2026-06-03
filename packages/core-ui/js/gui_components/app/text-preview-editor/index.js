import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { TextPreviewEditorController } from './text-preview-editor-controller.js';
import { TextPreviewEditorView } from './text-preview-editor-view.js';

function createTextPreviewEditorComponent({ root, props = {}, callbacks = {}, services = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new TextPreviewEditorController({ props, callbacks });
  const view = new TextPreviewEditorView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      updateHelpHints: createUpdateHelpHints(resolvedDocumentObj, root),
    },
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
    getTextArea() {
      return view.getTextArea();
    },
    getTextValue() {
      return view.getTextValue();
    },
    setTextValue(value) {
      view.setTextValue(value);
    },
    setCopyButtonText(value) {
      view.setCopyButtonText(value);
    },
  };
}

export { createTextPreviewEditorComponent, TextPreviewEditorController, TextPreviewEditorView };
