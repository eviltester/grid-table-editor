import { PopulationActionsController } from './population-actions-controller.js';
import { PopulationActionsView } from './population-actions-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';

function createPopulationActionsComponent({
  root,
  props = {},
  ids = {},
  callbacks = {},
  services = {},
  documentObj,
} = {}) {
  const controller = new PopulationActionsController({ props, callbacks });
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const view = new PopulationActionsView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    ids: Object.keys(ids || {}).length > 0 ? ids : props.ids || {},
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
    setGenerateSchemaBusy(isBusy) {
      controller.updateProps({ generateSchemaBusy: isBusy === true });
      view.render();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createPopulationActionsComponent };
