import { InstructionsController } from './instructions-controller.js';
import { InstructionsView } from './instructions-view.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
export { APP_PAGE_INSTRUCTIONS_PROPS } from './app-page-instructions.js';
export { GENERATOR_PAGE_INSTRUCTIONS_PROPS } from './generator-page-instructions.js';

function createInstructionsComponent({ root, props = {}, documentObj = document, services = {} } = {}) {
  const controller = new InstructionsController({ props });
  const view = new InstructionsView({
    root,
    controller,
    services: {
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(documentObj, root),
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

export { createInstructionsComponent, InstructionsController, InstructionsView };
