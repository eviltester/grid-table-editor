import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { TextPreviewToolbarController } from './text-preview-toolbar-controller.js';
import { TextPreviewToolbarView } from './text-preview-toolbar-view.js';

function createTextPreviewToolbarComponent({ root, props = {}, callbacks = {}, services = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new TextPreviewToolbarController({ props, callbacks });
  const view = new TextPreviewToolbarView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(resolvedDocumentObj, root),
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
    setCopyButtonText(value) {
      view.setCopyButtonText(value);
    },
  };
}

export { createTextPreviewToolbarComponent };
