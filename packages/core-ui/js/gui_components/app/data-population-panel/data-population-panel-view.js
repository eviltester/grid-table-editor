import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class DataPopulationPanelView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.ids = {
      actionsRoot: 'populationActionsRoot',
      rowCountRoot: 'generateCountControl',
      modeSelectorRoot: 'populationModeSelectorRoot',
      schemaDefinitionRoot: 'testDataSchemaDefinition',
      ...ids,
    };
    this.populationActions = null;
    this.populationModeSelector = null;
    this.rowCountControl = null;
    this.schemaDefinition = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('DataPopulationPanelView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <section class="data-population-panel" aria-label="Test Data Population Panel">
        <div class="data-population-toolbar">
          <div data-role="population-actions-root"></div>
          <span data-role="row-count-root"></span>
          <div data-role="population-mode-selector-root"></div>
        </div>
        <div class="test-data-schema-edit-zone generator-schema">
          <div id="${this.ids.schemaDefinitionRoot}" data-role="schema-definition-root"></div>
        </div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.populationActions = this.services.createPopulationActionsComponent?.({
      root: this.root.querySelector('[data-role="population-actions-root"]'),
      documentObj: this.documentObj,
      props: {
        pairwiseVisible: state.pairwiseVisible,
        ids: state.actionIds,
      },
      callbacks: {
        onGenerate: this.callbacks.onGenerate,
        onGeneratePairwise: this.callbacks.onGeneratePairwise,
        onRefreshPreview: this.callbacks.onRefreshPreview,
      },
    });

    this.rowCountControl = this.services.createRowCountControl?.({
      root: this.root.querySelector('[data-role="row-count-root"]'),
      documentObj: this.documentObj,
      props: state.rowCountProps,
    });

    this.populationModeSelector = this.services.createPopulationModeSelectorComponent?.({
      root: this.root.querySelector('[data-role="population-mode-selector-root"]'),
      documentObj: this.documentObj,
      props: {
        name: 'testDataGenerationMode',
        options: state.modeOptions,
        selectedMode: state.selectedMode,
      },
      callbacks: {
        onChange: (mode) => this.controller.handleModeChange(mode),
      },
    });

    this.schemaDefinition = this.services.createSharedSchemaDefinitionComponent?.({
      root: this.root.querySelector('[data-role="schema-definition-root"]'),
      documentObj: this.documentObj,
      props: state.schemaDefinitionProps,
      callbacks: this.callbacks.schemaDefinition || {},
    });
  }

  render() {
    const state = this.controller.getState();
    this.populationActions?.update?.({ pairwiseVisible: state.pairwiseVisible });
    this.populationModeSelector?.update?.({
      name: 'testDataGenerationMode',
      options: state.modeOptions,
      selectedMode: state.selectedMode,
    });
    this.rowCountControl?.update?.(state.rowCountProps);
    this.schemaDefinition?.update?.(state.schemaDefinitionProps);
  }

  destroy() {
    this.populationActions?.destroy?.();
    this.populationModeSelector?.destroy?.();
    this.rowCountControl?.destroy?.();
    this.schemaDefinition?.destroy?.();
    this.root.replaceChildren();
  }

  setPairwiseVisible(isVisible) {
    this.populationActions?.setPairwiseVisible?.(isVisible);
  }

  setRowCountValue(value) {
    const state = this.controller.getState();
    this.rowCountControl?.update?.({
      ...state.rowCountProps,
      value,
    });
  }

  getMode() {
    return this.populationModeSelector?.getMode?.() || this.controller.getState().selectedMode;
  }

  getRowCountState() {
    return this.rowCountControl?.getState?.() || null;
  }

  getRowCountInputValue() {
    return this.rowCountControl?.getState?.()?.inputValue ?? null;
  }

  setGenerateBusy(isBusy) {
    this.populationActions?.setGenerateBusy?.(isBusy);
  }

  setGeneratePairwiseBusy(isBusy) {
    this.populationActions?.setGeneratePairwiseBusy?.(isBusy);
  }

  setRefreshPreviewBusy(isBusy) {
    this.populationActions?.setRefreshPreviewBusy?.(isBusy);
  }

  getSchemaDefinition() {
    return this.schemaDefinition;
  }
}

export { DataPopulationPanelView };
