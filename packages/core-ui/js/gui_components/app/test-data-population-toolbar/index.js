import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createPopulationActionsComponent } from '../population-actions/index.js';
import { createPopulationModeSelectorComponent } from '../population-mode-selector/index.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { TestDataPopulationToolbarController } from './test-data-population-toolbar-controller.js';
import { TestDataPopulationToolbarView } from './test-data-population-toolbar-view.js';

function createTestDataPopulationToolbarComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new TestDataPopulationToolbarController({ props, callbacks });
  const view = new TestDataPopulationToolbarView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createPopulationActionsComponent: services.createPopulationActionsComponent || createPopulationActionsComponent,
      createPopulationModeSelectorComponent:
        services.createPopulationModeSelectorComponent || createPopulationModeSelectorComponent,
      createRowCountControl: services.createRowCountControl || createRowCountControl,
    },
    callbacks,
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
      view.setPairwiseVisible(isVisible);
    },
    setRowCountValue(value) {
      controller.updateProps({
        rowCountProps: {
          ...controller.getState().rowCountProps,
          value,
        },
      });
      view.setRowCountValue(value);
    },
    getMode() {
      return view.getMode();
    },
    getRowCountState() {
      return view.getRowCountState();
    },
    getRowCountInputValue() {
      return view.getRowCountInputValue();
    },
    setGenerateBusy(isBusy) {
      controller.updateProps({ generateBusy: isBusy === true });
      view.setGenerateBusy(isBusy);
    },
    setGeneratePairwiseBusy(isBusy) {
      controller.updateProps({ generatePairwiseBusy: isBusy === true });
      view.setGeneratePairwiseBusy(isBusy);
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createTestDataPopulationToolbarComponent };
