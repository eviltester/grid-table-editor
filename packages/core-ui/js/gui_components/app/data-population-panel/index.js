import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
import { createPopulationActionsComponent } from '../population-actions/index.js';
import { createPopulationModeSelectorComponent } from '../population-mode-selector/index.js';
import { DataPopulationPanelController } from './data-population-panel-controller.js';
import { DataPopulationPanelView } from './data-population-panel-view.js';

function createDataPopulationPanelComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj = document,
} = {}) {
  const controller = new DataPopulationPanelController({ props, callbacks });
  const view = new DataPopulationPanelView({
    root,
    controller,
    documentObj,
    services: {
      createPopulationActionsComponent: services.createPopulationActionsComponent || createPopulationActionsComponent,
      createPopulationModeSelectorComponent:
        services.createPopulationModeSelectorComponent || createPopulationModeSelectorComponent,
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      createSharedSchemaDefinitionComponent:
        services.createSharedSchemaDefinitionComponent || createSharedSchemaDefinitionComponent,
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
    getSchemaDefinition() {
      return view.getSchemaDefinition();
    },
    validateSchemaRows({ syncFromText = true } = {}) {
      if (syncFromText) {
        const isTextMode = view.getSchemaDefinition()?.getState?.()?.isTextMode === true;
        if (isTextMode) {
          const parsed = view.getSchemaDefinition()?.syncFromText?.({ showErrors: true, force: true }) || {
            rows: [],
            errors: [],
          };
          if (parsed?.errors?.length > 0) {
            return parsed;
          }
        }
      }
      return view.getSchemaDefinition()?.validateRows?.() || { rows: [], errors: [] };
    },
    syncSchemaTextFromRows() {
      return view.getSchemaDefinition()?.syncTextFromRows?.();
    },
    insertSampleSchema() {
      return view.getSchemaDefinition()?.insertSampleSchema?.();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createDataPopulationPanelComponent, DataPopulationPanelController, DataPopulationPanelView };
