import { PopulationActionsController } from './population-actions-controller.js';
import { PopulationActionsView } from './population-actions-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createPopulationActionsComponent({ root, props = {}, callbacks = {}, documentObj } = {}) {
  const controller = new PopulationActionsController({ props, callbacks });
  const view = new PopulationActionsView({
    root,
    controller,
    documentObj: resolveDocumentObj(documentObj, root),
    ids: props.ids || {},
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
    setPairwiseVisible(isVisible) {
      controller.updateProps({ pairwiseVisible: isVisible });
      view.render();
    },
    setGenerateBusy(isBusy) {
      controller.updateProps({ generateBusy: isBusy === true });
      view.render();
    },
    setGeneratePairwiseBusy(isBusy) {
      controller.updateProps({ generatePairwiseBusy: isBusy === true });
      view.render();
    },
    setRefreshPreviewBusy(isBusy) {
      controller.updateProps({ refreshPreviewBusy: isBusy === true });
      view.render();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createPopulationActionsComponent, PopulationActionsController, PopulationActionsView };
