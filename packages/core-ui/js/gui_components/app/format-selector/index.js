import { FormatSelectorController, createDefaultTabDefinitions } from './format-selector-controller.js';
import { FormatSelectorView } from './format-selector-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';

function createFormatSelectorComponent({
  root,
  subtasksRoot,
  props = {},
  callbacks = {},
  services = {},
  documentObj,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root || subtasksRoot);
  const controller = new FormatSelectorController({
    props: {
      tabDefinitions: props.tabDefinitions || createDefaultTabDefinitions(),
      defaultTabId: props.defaultTabId || 'csv',
      selectedFormat: props.selectedFormat || 'csv',
    },
    callbacks,
  });
  const view = new FormatSelectorView({
    root,
    subtasksRoot,
    controller,
    documentObj: resolvedDocumentObj,
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
    getSelectedFormat() {
      return controller.getState().activeType;
    },
  };
}

export { createFormatSelectorComponent };
