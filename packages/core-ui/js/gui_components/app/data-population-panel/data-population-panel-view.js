import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class DataPopulationPanelView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.ids = { ...ids };
    this.toolbar = null;
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
      <section
        class="data-population-panel testDataSchemaGui"
        data-role="data-population-panel-root"
        aria-label="Test Data Population Panel"
      >
        <div data-role="test-data-population-toolbar-root"></div>
        <div class="test-data-schema-edit-zone shared-schema-section">
          <div${this.ids.schemaDefinitionRoot ? ` id="${this.ids.schemaDefinitionRoot}"` : ''} data-role="schema-definition-root"></div>
        </div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.toolbar = this.services.createTestDataPopulationToolbarComponent?.({
      root: this.root.querySelector('[data-role="test-data-population-toolbar-root"]'),
      documentObj: this.documentObj,
      props: {
        selectedMode: state.selectedMode,
        pairwiseVisible: state.pairwiseVisible,
        modeOptions: state.modeOptions,
        rowCountProps: state.rowCountProps,
        actionIds: state.actionIds,
      },
      callbacks: {
        onGenerate: this.callbacks.onGenerate,
        onGeneratePairwise: this.callbacks.onGeneratePairwise,
        onModeChange: (mode) => this.controller.handleModeChange(mode),
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
    this.toolbar?.update?.({
      selectedMode: state.selectedMode,
      pairwiseVisible: state.pairwiseVisible,
      modeOptions: state.modeOptions,
      rowCountProps: state.rowCountProps,
      actionIds: state.actionIds,
    });
    this.schemaDefinition?.update?.(state.schemaDefinitionProps);
  }

  destroy() {
    this.toolbar?.destroy?.();
    this.schemaDefinition?.destroy?.();
    this.root.replaceChildren();
  }

  setPairwiseVisible(isVisible) {
    this.toolbar?.setPairwiseVisible?.(isVisible);
  }

  setRowCountValue(value) {
    this.toolbar?.setRowCountValue?.(value);
  }

  getMode() {
    return this.toolbar?.getMode?.() || this.controller.getState().selectedMode;
  }

  getRowCountState() {
    return this.toolbar?.getRowCountState?.() || null;
  }

  getRowCountInputValue() {
    return this.toolbar?.getRowCountInputValue?.() ?? null;
  }

  setGenerateBusy(isBusy) {
    this.toolbar?.setGenerateBusy?.(isBusy);
  }

  setGeneratePairwiseBusy(isBusy) {
    this.toolbar?.setGeneratePairwiseBusy?.(isBusy);
  }

  getSchemaDefinition() {
    return this.schemaDefinition;
  }
}

export { DataPopulationPanelView };
