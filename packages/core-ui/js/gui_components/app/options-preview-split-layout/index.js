import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { OptionsPreviewSplitLayoutController } from './options-preview-split-layout-controller.js';
import { OptionsPreviewSplitLayoutView } from './options-preview-split-layout-view.js';

function createOptionsPreviewSplitLayoutComponent({ root, props = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new OptionsPreviewSplitLayoutController({ props });
  const view = new OptionsPreviewSplitLayoutView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
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
    getEditArea() {
      return view.getEditArea();
    },
    getOptionsPanelRoot() {
      return view.getOptionsPanelRoot();
    },
    getOptionsPreviewSplitter() {
      return view.getOptionsPreviewSplitter();
    },
    getPreviewPanelRoot() {
      return view.getPreviewPanelRoot();
    },
  };
}

export { createOptionsPreviewSplitLayoutComponent };
