import { GridRowVisibilitySummaryController } from './grid-row-visibility-summary-controller.js';
import { GridRowVisibilitySummaryView } from './grid-row-visibility-summary-view.js';

function createGridRowVisibilitySummaryComponent({ root, props = {}, documentObj } = {}) {
  const controller = new GridRowVisibilitySummaryController({ props });
  const view = new GridRowVisibilitySummaryView({ root, controller, documentObj });
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
    getDisplayText() {
      return controller.getDisplayText();
    },
  };
}

export { createGridRowVisibilitySummaryComponent };
