import { InstructionsController } from './instructions-controller.js';
import { InstructionsView } from './instructions-view.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { resolveDocumentObj } from '../dom/default-objects.js';

function createInstructionsComponent({ root, props = {}, documentObj, services = {} } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new InstructionsController({ props });
  const view = new InstructionsView({
    root,
    controller,
    services: {
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
  };
}

export { createInstructionsComponent };
