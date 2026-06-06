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
    this.schemaPanel = null;
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
        <div data-role="test-data-schema-panel-host"></div>
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

    this.schemaPanel = this.services.createSchemaPanelComponent?.({
      root: this.root.querySelector('[data-role="test-data-schema-panel-host"]'),
      documentObj: this.documentObj,
      props: {
        className: 'test-data-schema-edit-zone shared-schema-section',
        rootDataRole: 'test-data-schema-panel-root',
        schemaDefinitionRootDataRole: 'schema-definition-root',
        ariaLabel: 'Test data schema panel',
        ids: this.ids,
        schemaDefinitionProps: state.schemaDefinitionProps,
      },
      callbacks: {
        schemaDefinition: this.callbacks.schemaDefinition || {},
      },
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
    this.schemaPanel?.update?.({
      className: 'test-data-schema-edit-zone shared-schema-section',
      rootDataRole: 'test-data-schema-panel-root',
      schemaDefinitionRootDataRole: 'schema-definition-root',
      ariaLabel: 'Test data schema panel',
      schemaDefinitionProps: state.schemaDefinitionProps,
    });
  }

  destroy() {
    this.toolbar?.destroy?.();
    this.schemaPanel?.destroy?.();
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
    return this.schemaPanel?.getSchemaDefinition?.() || null;
  }
}

export { DataPopulationPanelView };
