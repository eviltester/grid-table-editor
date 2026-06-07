import { createFormatOptionsPanel } from '../../shared/format-options-panel/index.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createLoadingStatusPresenter, createStatusPresenter } from '../../shared/test-data/ui/status-presenter.js';
import { createPopulationActionsComponent } from '../../app/population-actions/index.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { getOutputFormatGroups } from '../options/options-ui-schema.js';
import { createGeneratorOutputFormatSelectorComponent } from '../output-format-selector/index.js';
import { GeneratorControlsController } from './generator-controls-controller.js';
import { GeneratorControlsView } from './generator-controls-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createGeneratorControlsComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new GeneratorControlsController({ props, callbacks });
  const view = new GeneratorControlsView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    ids: props.ids || {},
    services: {
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      createFormatOptionsPanel: services.createFormatOptionsPanel || createFormatOptionsPanel,
      createStatusPresenter: services.createStatusPresenter || createStatusPresenter,
      createLoadingStatusPresenter: services.createLoadingStatusPresenter || createLoadingStatusPresenter,
      createPopulationActionsComponent: services.createPopulationActionsComponent || createPopulationActionsComponent,
      createGeneratorOutputFormatSelectorComponent:
        services.createGeneratorOutputFormatSelectorComponent || createGeneratorOutputFormatSelectorComponent,
      getOutputFormatGroups: services.getOutputFormatGroups || getOutputFormatGroups,
      canExportFormat: services.canExportFormat || (() => true),
      getCurrentOptionsForFormat: services.getCurrentOptionsForFormat || (() => undefined),
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(resolvedDocumentObj, root),
      windowObj: services.windowObj,
      setTimeoutFn: services.setTimeoutFn,
      clearTimeoutFn: services.clearTimeoutFn,
    },
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    syncFormatState(selectedFormat) {
      view.syncFormatState(selectedFormat);
    },
    setPairwiseVisible(pairwiseVisible) {
      view.setPairwiseVisible(pairwiseVisible);
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
    getGenerateRowCount() {
      return view.getGenerateRowCount();
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
  };
}

export { createGeneratorControlsComponent };
