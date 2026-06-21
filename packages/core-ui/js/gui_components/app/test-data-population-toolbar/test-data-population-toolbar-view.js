import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { buildDocsUrl } from '@anywaydata/site-config';

const GENERATE_TO_GRID_HELP_HTML = `
  <p>Generate data from the current schema directly into the grid.</p>
  <p><a class="helplink" href="${buildDocsUrl('test-data/test-data-generation')}" target="anywaydatadocs">Test-data generation docs</a></p>
`;

const GENERATE_PAIRWISE_TO_GRID_HELP_HTML = `
  <p>Generate n-wise combinations from enum columns in the current schema directly into the grid.</p>
  <p><a class="helplink" href="${buildDocsUrl('test-data/n-wise-testing')}" target="_blank" rel="noopener noreferrer">N-wise generation docs</a></p>
`;

const GRID_TO_SCHEMA_HELP_HTML = `
  <p>Scan the current grid and build an enum-only schema from the visible column values.</p>
`;

class TestDataPopulationToolbarView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.populationActions = null;
    this.populationModeSelector = null;
    this.rowCountControl = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('TestDataPopulationToolbarView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <div
        class="data-population-toolbar test-data-population-toolbar"
        data-role="test-data-population-toolbar-root"
        aria-label="Test Data Population Toolbar"
      >
        <div data-role="population-actions-root"></div>
        <span data-role="row-count-root"></span>
        <div data-role="population-mode-selector-root"></div>
      </div>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.populationActions = this.services.createPopulationActionsComponent?.({
      root: this.root.querySelector('[data-role="population-actions-root"]'),
      documentObj: this.documentObj,
      props: {
        pairwiseVisible: state.pairwiseVisible,
        generateBusy: state.generateBusy,
        generatePairwiseBusy: state.generatePairwiseBusy,
        ids: state.actionIds,
        generatePairwiseLabel: 'Generate Combinations',
        generateHelpHtml: GENERATE_TO_GRID_HELP_HTML,
        generatePairwiseHelpHtml: GENERATE_PAIRWISE_TO_GRID_HELP_HTML,
        generatePairwiseHelpLabel: 'Show combination generation help',
        generateSchemaLabel: 'Grid to Enum Schema',
        generateSchemaHelpHtml: GRID_TO_SCHEMA_HELP_HTML,
        generateSchemaHelpLabel: 'Show grid to enum schema help',
        statusVisible: true,
      },
      callbacks: {
        onGenerate: this.callbacks.onGenerate,
        onGeneratePairwise: this.callbacks.onGeneratePairwise,
        onGenerateSchemaFromGrid: this.callbacks.onGenerateSchemaFromGrid,
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
  }

  render() {
    const state = this.controller.getState();
    this.populationActions?.update?.({
      pairwiseVisible: state.pairwiseVisible,
      generateBusy: state.generateBusy,
      generatePairwiseBusy: state.generatePairwiseBusy,
      ids: state.actionIds,
      generatePairwiseLabel: 'Generate Combinations',
      generateHelpHtml: GENERATE_TO_GRID_HELP_HTML,
      generatePairwiseHelpHtml: GENERATE_PAIRWISE_TO_GRID_HELP_HTML,
      generatePairwiseHelpLabel: 'Show combination generation help',
      generateSchemaLabel: 'Grid to Enum Schema',
      generateSchemaHelpHtml: GRID_TO_SCHEMA_HELP_HTML,
      generateSchemaHelpLabel: 'Show grid to enum schema help',
      statusVisible: true,
      generateSchemaBusy: state.generateSchemaBusy,
    });
    this.populationModeSelector?.update?.({
      name: 'testDataGenerationMode',
      options: state.modeOptions,
      selectedMode: state.selectedMode,
    });
    this.rowCountControl?.update?.(state.rowCountProps);
  }

  destroy() {
    this.populationActions?.destroy?.();
    this.populationModeSelector?.destroy?.();
    this.rowCountControl?.destroy?.();
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

  setGenerateSchemaBusy(isBusy) {
    this.populationActions?.setGenerateSchemaBusy?.(isBusy);
  }
}

export { TestDataPopulationToolbarView };
