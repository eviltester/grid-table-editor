import { resolveDocumentObj, resolveWindowObj } from '../../shared/dom/default-objects.js';
import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';

const GENERATE_TO_FILE_HELP_HTML = `
  <p>Generate data for the current schema and output format to a file.</p>
  <p><a class="helplink" href="${GENERATE_TO_FILE_HELP_URL}" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
`;

const GENERATE_PAIRWISE_TO_FILE_HELP_HTML = `
  <p>Generate pairwise data from the current schema to a file.</p>
  <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
`;

class GeneratorControlsView {
  constructor({ root, controller, documentObj, services = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.windowObj = resolveWindowObj(services.windowObj, this.documentObj);
    this.services = services;
    this.ids = {
      outputFormatSelect: '',
      generateDataButton: '',
      generatePairwiseButtonWrapper: '',
      generatePairwiseButton: '',
      status: '',
      rowCountInput: '',
      ...ids,
    };
    this.rowCountControls = [];
    this.generateRowsCountControl = null;
    this.generationActions = null;
    this.formatOptionsPanel = null;
    this.statusPresenter = null;
    this.loadingStatusPresenter = null;
    this.statusClearTimer = null;
    this.handleGenerateDataClick = () => this.controller.triggerGenerateData();
    this.handleGeneratePairwiseClick = () => this.controller.triggerGeneratePairwise();
    this.handleOutputFormatChange = () => {
      const select = this.getOutputFormatSelect();
      const selectedFormat = select?.value || 'csv';
      this.controller.setSelectedFormat(selectedFormat, this.resolveCurrentOptionsForFormat(selectedFormat));
      this.render();
    };
  }

  buildOptionalIdAttr(id) {
    return id ? ` id="${id}"` : '';
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.template();
    this.createControls();
    this.bindEvents();
    this.render();
  }

  template() {
    const ids = this.ids;
    return `
      <section class="shared-generator-controls generator-controls" data-section-order="3" aria-label="Generate Data and Options">
        <div class="shared-generator-controls-head generator-controls-head">
          <strong>Generate Data and Options</strong>
        </div>
        <div data-role="generate-rows-count-control"></div>
        <label>Output Format
          <select${this.buildOptionalIdAttr(ids.outputFormatSelect)} data-role="generator-output-format-select"></select>
        </label>
        <div data-role="generator-actions-root"></div>
        <div class="shared-generator-options-wrapper generator-options-wrapper">
          <div data-role="generator-options-panel" class="shared-generator-options-panel generator-options-panel"></div>
          <div${this.buildOptionalIdAttr(ids.status)} data-role="generator-status-text" class="shared-generator-status-text generator-status-text" aria-live="polite" role="status"></div>
        </div>
      </section>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    if (typeof createRowCountControl === 'function') {
      const generateRowsRoot = this.root.querySelector('[data-role="generate-rows-count-control"]');
      if (generateRowsRoot) {
        this.generateRowsCountControl = createRowCountControl({
          root: generateRowsRoot,
          documentObj: this.documentObj,
          props: {
            inputId: this.ids.rowCountInput,
            label: 'Generate Rows',
            min: 0,
            step: 1,
            value: 1000,
          },
        });
        this.rowCountControls.push(this.generateRowsCountControl);
      }
    }

    const outputSelect = this.getOutputFormatSelect();
    this.populateOutputFormats(outputSelect);
    const createPopulationActionsComponent = this.services.createPopulationActionsComponent;
    if (typeof createPopulationActionsComponent === 'function') {
      const actionsRoot = this.root.querySelector('[data-role="generator-actions-root"]');
      this.generationActions = createPopulationActionsComponent({
        root: actionsRoot,
        documentObj: this.documentObj,
        props: {
          pairwiseVisible: false,
          generateLabel: 'Generate Data',
          generatePairwiseLabel: 'Generate Pairwise',
          generateHelpHtml: GENERATE_TO_FILE_HELP_HTML,
          generatePairwiseHelpHtml: GENERATE_PAIRWISE_TO_FILE_HELP_HTML,
          generateHelpLabel: 'Show file generation help',
          generatePairwiseHelpLabel: 'Show pairwise generation help',
          roleNames: {
            generateButton: 'generator-generate-data-button',
            generatePairwiseButton: 'generator-generate-pairwise-button',
            generatePairwiseWrapper: 'generator-pairwise-button-wrapper',
          },
        },
        ids: {
          generateButton: this.ids.generateDataButton,
          generatePairwiseButtonWrapper: this.ids.generatePairwiseButtonWrapper,
          generatePairwiseButton: this.ids.generatePairwiseButton,
        },
        callbacks: {
          onGenerate: this.handleGenerateDataClick,
          onGeneratePairwise: this.handleGeneratePairwiseClick,
        },
        services: {
          updateHelpHints: this.services.updateHelpHints,
        },
      });
    }
    const resolveStatusElement = () => this.root?.querySelector?.('[data-role="generator-status-text"]') || null;

    const createStatusPresenter = this.services.createStatusPresenter;
    if (typeof createStatusPresenter === 'function') {
      this.statusPresenter = createStatusPresenter({
        documentObj: this.documentObj,
        resolveElement: resolveStatusElement,
        hideWhenEmpty: false,
      });
    }

    const createLoadingStatusPresenter = this.services.createLoadingStatusPresenter;
    if (typeof createLoadingStatusPresenter === 'function') {
      this.loadingStatusPresenter = createLoadingStatusPresenter({
        documentObj: this.documentObj,
        resolveElement: resolveStatusElement,
        hideWhenEmpty: false,
      });
    }

    const optionsParent = this.root.querySelector('[data-role="generator-options-panel"]');
    const createFormatOptionsPanel = this.services.createFormatOptionsPanel;
    if (optionsParent && typeof createFormatOptionsPanel === 'function') {
      const state = this.controller.getState();
      this.formatOptionsPanel = createFormatOptionsPanel({
        root: optionsParent,
        documentObj: this.documentObj,
        windowObj: this.windowObj,
        props: {
          selectedFormat: state.selectedFormat,
          currentOptions: state.currentOptions,
        },
        callbacks: {
          onApplyOptions: (payload) => this.controller.applyOptions(payload),
        },
      });
    }
  }

  bindEvents() {
    this.getOutputFormatSelect()?.addEventListener('change', this.handleOutputFormatChange);
  }

  populateOutputFormats(outputSelect) {
    if (!outputSelect) {
      return;
    }

    outputSelect.replaceChildren();
    const formatGroups = this.services.getOutputFormatGroups?.();
    if (!formatGroups) {
      return;
    }

    this.appendFormatGroup(outputSelect, formatGroups.core);
    this.appendFormatGroup(outputSelect, formatGroups.code, '-- Code --');
    this.appendFormatGroup(outputSelect, formatGroups.unitTest, '-- Code (Unit Test) --');
  }

  appendFormatGroup(parentElement, entries = [], label = '') {
    const supportedEntries = entries.filter(({ type }) => this.services.canExportFormat?.(type) !== false);
    if (supportedEntries.length === 0) {
      return;
    }

    const target = label ? this.documentObj.createElement('optgroup') : parentElement;
    if (label) {
      target.label = label;
    }

    supportedEntries.forEach(({ type, label: optionLabel }) => {
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = optionLabel;
      target.appendChild(option);
    });

    if (label) {
      parentElement.appendChild(target);
    }
  }

  resolveCurrentOptionsForFormat(selectedFormat) {
    return this.services.getCurrentOptionsForFormat?.(selectedFormat);
  }

  syncFormatState(selectedFormat = this.controller.getState().selectedFormat || 'csv') {
    this.controller.updateProps({
      selectedFormat,
      currentOptions: this.resolveCurrentOptionsForFormat(selectedFormat),
    });
    this.render();
  }

  setPairwiseVisible(pairwiseVisible) {
    this.controller.setPairwiseVisible(pairwiseVisible);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    const outputSelect = this.getOutputFormatSelect();
    if (outputSelect && outputSelect.value !== state.selectedFormat) {
      outputSelect.value = state.selectedFormat || 'csv';
    }

    const pairwiseWrapper = this.getGeneratePairwiseButtonWrapper();
    if (pairwiseWrapper) {
      pairwiseWrapper.style.display = state.pairwiseVisible ? 'inline-flex' : 'none';
    }
    this.generationActions?.update?.({
      pairwiseVisible: state.pairwiseVisible,
      generateBusy: state.generationButtonsBusy === true,
      generatePairwiseBusy: state.generationButtonsBusy === true,
    });
    this.renderStatus();
    this.formatOptionsPanel?.update({
      selectedFormat: state.selectedFormat,
      currentOptions: state.currentOptions,
    });
    this.services.updateHelpHints?.();
  }

  renderStatus() {
    const state = this.controller.getState();
    if (state.loadingStatusMessage) {
      this.statusPresenter?.clear();
      this.loadingStatusPresenter?.setStatus(state.loadingStatusMessage);
    } else if (state.statusMessage) {
      this.loadingStatusPresenter?.clear();
      this.statusPresenter?.setStatus(state.statusMessage, state.statusOptions || {});
    } else {
      this.loadingStatusPresenter?.clear();
      this.statusPresenter?.clear();
    }
  }

  destroy() {
    this.clearScheduledStatusClear();
    this.getOutputFormatSelect()?.removeEventListener('change', this.handleOutputFormatChange);
    this.generationActions?.destroy?.();
    this.generationActions = null;
    this.formatOptionsPanel?.destroy?.();
    this.statusPresenter?.destroy?.();
    this.loadingStatusPresenter?.destroy?.();
    this.statusPresenter = null;
    this.loadingStatusPresenter = null;
    this.rowCountControls.forEach((control) => control?.destroy?.());
    this.rowCountControls = [];
    this.root.replaceChildren();
  }

  getOutputFormatSelect() {
    return this.root.querySelector('[data-role="generator-output-format-select"]');
  }

  getGenerateDataButton() {
    return this.root.querySelector('[data-role="generator-generate-data-button"]');
  }

  getGeneratePairwiseButton() {
    return this.root.querySelector('[data-role="generator-generate-pairwise-button"]');
  }

  getGeneratePairwiseButtonWrapper() {
    return this.root.querySelector('[data-role="generator-pairwise-button-wrapper"]');
  }

  getSelectedOutputType() {
    return this.getOutputFormatSelect()?.value;
  }

  getGenerateRowCount() {
    return this.generateRowsCountControl?.getParsedValue?.();
  }

  applyGenerationButtonsBusyState(isBusy) {
    this.generationActions?.setGenerateBusy?.(isBusy);
    this.generationActions?.setGeneratePairwiseBusy?.(isBusy);
  }

  setGenerationButtonsBusy(isBusy) {
    this.controller.setGenerationButtonsBusy(isBusy);
    this.render();
  }

  setStatus(message, options = {}) {
    this.clearScheduledStatusClear();
    this.controller.setStatus(message, options);
    this.renderStatus();
  }

  showLoadingStatus(message) {
    this.clearScheduledStatusClear();
    this.controller.showLoadingStatus(message);
    this.renderStatus();
  }

  clearStatus() {
    this.clearScheduledStatusClear();
    this.controller.clearStatus();
    this.renderStatus();
  }

  scheduleClearStatus(delayMs = 1200) {
    this.clearScheduledStatusClear();
    this.statusPresenter?.scheduleClear(delayMs);
    const setTimeoutFn =
      this.services.setTimeoutFn || this.windowObj?.setTimeout?.bind(this.windowObj) || globalThis.setTimeout;
    this.statusClearTimer = setTimeoutFn(() => {
      this.statusClearTimer = null;
      this.controller.clearStatus();
      this.renderStatus();
    }, delayMs);
  }

  clearScheduledStatusClear() {
    if (this.statusClearTimer !== null) {
      const clearTimeoutFn =
        this.services.clearTimeoutFn || this.windowObj?.clearTimeout?.bind(this.windowObj) || globalThis.clearTimeout;
      clearTimeoutFn(this.statusClearTimer);
      this.statusClearTimer = null;
    }
  }
}

export { GeneratorControlsView };
