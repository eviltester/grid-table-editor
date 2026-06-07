import { PopulationModeSelectorController } from './population-mode-selector-controller.js';
import { PopulationModeSelectorView } from './population-mode-selector-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createPopulationModeSelectorComponent({ root, props = {}, callbacks = {}, documentObj } = {}) {
  const controller = new PopulationModeSelectorController({ props, callbacks });
  const view = new PopulationModeSelectorView({
    root,
    controller,
    documentObj: resolveDocumentObj(documentObj, root),
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
    getMode() {
      return controller.getState().selectedMode;
    },
  };
}

export { createPopulationModeSelectorComponent };
