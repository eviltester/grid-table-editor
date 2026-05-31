import { PopulationActionsController } from './population-actions-controller.js';
import { PopulationActionsView } from './population-actions-view.js';

function createPopulationActionsComponent({ root, props = {}, callbacks = {}, documentObj = document } = {}) {
  const controller = new PopulationActionsController({ props, callbacks });
  const view = new PopulationActionsView({ root, controller, documentObj });
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
    setPairwiseVisible(isVisible) {
      controller.updateProps({ pairwiseVisible: isVisible });
      view.render();
    },
  };
}

export { createPopulationActionsComponent, PopulationActionsController, PopulationActionsView };
