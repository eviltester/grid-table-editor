import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
import { createSchemaPanelComponent } from '../../shared/schema-panel/index.js';
import { createTestDataPopulationToolbarComponent } from '../test-data-population-toolbar/index.js';
import { DataPopulationPanelController } from './data-population-panel-controller.js';
import { DataPopulationPanelView } from './data-population-panel-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createDataPopulationPanelComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new DataPopulationPanelController({ props, callbacks });
  const view = new DataPopulationPanelView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    ids: props.ids || {},
    services: {
      createTestDataPopulationToolbarComponent:
        services.createTestDataPopulationToolbarComponent || createTestDataPopulationToolbarComponent,
      createSchemaPanelComponent:
        services.createSchemaPanelComponent ||
        ((schemaPanelOptions) =>
          createSchemaPanelComponent({
            ...schemaPanelOptions,
            services: {
              ...(schemaPanelOptions.services || {}),
              createSharedSchemaDefinitionComponent:
                services.createSharedSchemaDefinitionComponent || createSharedSchemaDefinitionComponent,
            },
          })),
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
    getSchemaDefinition() {
      return view.getSchemaDefinition();
    },
    setGenerateBusy(isBusy) {
      view.setGenerateBusy(isBusy);
    },
    setGeneratePairwiseBusy(isBusy) {
      view.setGeneratePairwiseBusy(isBusy);
    },
    setGenerateSchemaBusy(isBusy) {
      controller.updateProps({ generateSchemaBusy: isBusy === true });
      view.setGenerateSchemaBusy(isBusy);
    },
    validateSchemaRows({ syncFromText = true } = {}) {
      if (syncFromText) {
        const isTextMode = view.getSchemaDefinition()?.getState?.()?.isTextMode === true;
        if (isTextMode) {
          const parsed = view.getSchemaDefinition()?.syncFromText?.({
            showErrors: true,
            force: true,
            refreshTextFromRows: true,
          }) || {
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
      const schemaDefinition = view.getSchemaDefinition?.();
      const isTextMode = schemaDefinition?.getState?.()?.isTextMode === true;
      if (isTextMode) {
        return false;
      }
      return schemaDefinition?.syncTextFromRows?.();
    },
    getSchemaText() {
      return view.getSchemaDefinition()?.getSchemaText?.() || '';
    },
    getUnsafeFakerExpressions() {
      return view.getUnsafeFakerExpressions();
    },
    replaceSchemaRows(rows) {
      return view.getSchemaDefinition()?.replaceRows?.(rows);
    },
    recordCurrentSchemaAsLastUsed() {
      return view.recordCurrentSchemaAsLastUsed?.() || null;
    },
    insertSampleSchema() {
      return view.getSchemaDefinition()?.insertSampleSchema?.();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createDataPopulationPanelComponent };
