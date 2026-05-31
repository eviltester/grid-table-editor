import { createFormatOptionsPanel } from '../../shared/format-options-panel/index.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createLoadingStatusPresenter, createStatusPresenter } from '../../shared/test-data/ui/index.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { getOutputFormatGroups } from '../options/index.js';
import { GeneratorControlsController } from './generator-controls-controller.js';
import { GeneratorControlsView } from './generator-controls-view.js';

function createGeneratorControlsComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj = document,
} = {}) {
  const controller = new GeneratorControlsController({ props, callbacks });
  const view = new GeneratorControlsView({
    root,
    controller,
    documentObj,
    services: {
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      createFormatOptionsPanel: services.createFormatOptionsPanel || createFormatOptionsPanel,
      createStatusPresenter: services.createStatusPresenter || createStatusPresenter,
      createLoadingStatusPresenter: services.createLoadingStatusPresenter || createLoadingStatusPresenter,
      getOutputFormatGroups: services.getOutputFormatGroups || getOutputFormatGroups,
      canExportFormat: services.canExportFormat || (() => true),
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
    getSelectedOutputType() {
      return view.getSelectedOutputType();
    },
    setGenerationButtonsBusy(isBusy) {
      view.setGenerationButtonsBusy(isBusy);
    },
    setStatus(message, options = {}) {
      view.setStatus(message, options);
    },
    showLoadingStatus(message) {
      view.showLoadingStatus(message);
    },
    clearStatus() {
      view.clearStatus();
    },
    scheduleClearStatus(delayMs = 1200) {
      view.scheduleClearStatus(delayMs);
    },
    getFormatOptionsPanel() {
      return view.getFormatOptionsPanel();
    },
  };
}

export { createGeneratorControlsComponent, GeneratorControlsController, GeneratorControlsView };
