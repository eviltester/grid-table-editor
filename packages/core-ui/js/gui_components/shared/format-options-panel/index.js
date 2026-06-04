import { createFormatOptionPanel } from './format-option-panel-definition.js';
import { getOptionPanelDefinitions } from '../../generator/options/options-ui-schema.js';
import { sanitizeUiOptionsForFormat } from '../../generator/options/options-catalog-adapter.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { resolveDocumentObj, resolveWindowObj } from '../dom/default-objects.js';
import { FormatOptionsPanelController } from './format-options-panel-controller.js';
import { FormatOptionsPanelView } from './format-options-panel-view.js';

function createFormatOptionsPanel({ root, props = {}, services = {}, callbacks = {}, documentObj, windowObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const resolvedWindowObj = resolveWindowObj(windowObj, resolvedDocumentObj);
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
    documentObj: resolvedDocumentObj,
    windowObj: resolvedWindowObj,
    services: {
      getPanelDefinitions: services.getPanelDefinitions || getOptionPanelDefinitions,
      createPanelFromDefinition: services.createPanelFromDefinition || createFormatOptionPanel,
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
    getPanels() {
      return view.getPanels();
    },
    getOptionsFromGui() {
      return view.getActivePanel()?.read?.();
    },
    isSupported() {
      return controller.getState().supported === true;
    },
  };
}

export { createFormatOptionsPanel };
