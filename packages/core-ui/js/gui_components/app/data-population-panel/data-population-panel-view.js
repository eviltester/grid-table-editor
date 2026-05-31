class DataPopulationPanelView {
  constructor({ root, controller, documentObj = document, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.services = services;
    this.callbacks = callbacks;
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
          <div id="populationActionsRoot"></div>
          <span id="generateCountControl"></span>
          <div id="populationModeSelectorRoot"></div>
        </div>
        <div class="test-data-schema-edit-zone generator-schema">
          <div id="testDataSchemaDefinition"></div>
        </div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.populationActions = this.services.createPopulationActionsComponent?.({
      root: this.root.querySelector('#populationActionsRoot'),
      documentObj: this.documentObj,
      props: {
        pairwiseVisible: state.pairwiseVisible,
      },
      callbacks: {
        onGenerate: this.callbacks.onGenerate,
        onGeneratePairwise: this.callbacks.onGeneratePairwise,
        onRefreshPreview: this.callbacks.onRefreshPreview,
      },
    });

    this.rowCountControl = this.services.createRowCountControl?.({
      root: this.root.querySelector('#generateCountControl'),
      documentObj: this.documentObj,
      props: state.rowCountProps,
    });

    this.populationModeSelector = this.services.createPopulationModeSelectorComponent?.({
      root: this.root.querySelector('#populationModeSelectorRoot'),
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
      root: this.root.querySelector('#testDataSchemaDefinition'),
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

  getSchemaDefinition() {
    return this.schemaDefinition;
  }
}

export { DataPopulationPanelView };
