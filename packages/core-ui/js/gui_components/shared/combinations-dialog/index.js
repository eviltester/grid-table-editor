import { resolveDocumentObj } from '../dom/default-objects.js';
import { CombinationsDialogController } from './combinations-dialog-controller.js';
import { CombinationsDialogView } from './combinations-dialog-view.js';

function createCombinationsDialogComponent({ root, props = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const resolvedRoot = root || resolvedDocumentObj?.createElement?.('div');
  const ownsRoot = !root;
  if (ownsRoot && resolvedDocumentObj?.body && resolvedRoot) {
    resolvedDocumentObj.body.appendChild(resolvedRoot);
  }
  const controller = new CombinationsDialogController({ props, callbacks });
  const view = new CombinationsDialogView({
    root: resolvedRoot,
    controller,
    documentObj: resolvedDocumentObj,
    ownsRoot,
  });
  view.mount();

  return {
    open(nextProps = {}) {
      controller.open(nextProps);
      view.render();
    },
    close() {
      controller.close();
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createCombinationsDialogComponent };
