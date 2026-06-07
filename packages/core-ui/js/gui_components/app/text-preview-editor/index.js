import { createOptionsPreviewSplitLayoutComponent } from '../options-preview-split-layout/index.js';
import { createTextPreviewToolbarComponent } from '../text-preview-toolbar/index.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
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
      createTextPreviewToolbarComponent:
        services.createTextPreviewToolbarComponent || createTextPreviewToolbarComponent,
      createOptionsPreviewSplitLayoutComponent:
        services.createOptionsPreviewSplitLayoutComponent || createOptionsPreviewSplitLayoutComponent,
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
    getEditArea() {
      return view.getEditArea();
    },
    getOptionsPanelRoot() {
      return view.getOptionsPanelRoot();
    },
    getOptionsPreviewSplitter() {
      return view.getOptionsPreviewSplitter();
    },
    getTextAreaWrapper() {
      return view.getTextAreaWrapper();
    },
    setOptionsPanelSupported(optionsSupported) {
      view.setOptionsPanelSupported(optionsSupported);
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

export { createTextPreviewEditorComponent };
