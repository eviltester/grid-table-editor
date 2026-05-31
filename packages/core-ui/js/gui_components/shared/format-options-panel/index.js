import { createOptionsPanelsForParent } from '../../generator/options/options-ui-schema.js';
import { sanitizeUiOptionsForFormat } from '../../generator/options/options-catalog-adapter.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { FormatOptionsPanelController } from './format-options-panel-controller.js';
import { FormatOptionsPanelView } from './format-options-panel-view.js';

function createFormatOptionsPanel({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj = document,
  windowObj = documentObj?.defaultView || window,
} = {}) {
  const controller = new FormatOptionsPanelController({
    props,
    services: {
      sanitizeOptionsForFormat: services.sanitizeOptionsForFormat || sanitizeUiOptionsForFormat,
    },
    callbacks,
  });

  const view = new FormatOptionsPanelView({
    root,
    controller,
    documentObj,
    windowObj,
    services: {
      createPanelsForParent: services.createPanelsForParent || createOptionsPanelsForParent,
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
    getPanels() {
      return view.getPanels();
    },
    getOptionsFromGui() {
      return view.getActivePanel()?.getOptionsFromGui?.();
    },
    isSupported() {
      return controller.getState().supported === true;
    },
  };
}

export { createFormatOptionsPanel };
