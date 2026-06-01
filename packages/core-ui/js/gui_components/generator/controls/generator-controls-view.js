import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';

class GeneratorControlsView {
  constructor({ root, controller, documentObj = document, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.services = services;
    this.rowCountControls = [];
    this.formatOptionsPanel = null;
    this.statusPresenter = null;
    this.loadingStatusPresenter = null;
    this.handleGenerateDataClick = () => this.controller.triggerGenerateData();
    this.handleGeneratePairwiseClick = () => this.controller.triggerGeneratePairwise();
    this.handleOutputFormatChange = () => {
      const select = this.getOutputFormatSelect();
      this.controller.setSelectedFormat(select?.value || 'csv');
      this.render();
    };
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
    return `
      <section class="generator-controls" id="generatorGenerateOptionsSection" data-section-order="3" aria-labelledby="generatorGenerateOptionsHeading">
        <div class="generator-controls-head">
          <strong id="generatorGenerateOptionsHeading">Generate Data and Options</strong>
        </div>
        <div id="generateRowsCountControl"></div>
        <label>Output Format
          <select id="generatorOutputFormat"></select>
        </label>
        <span class="generator-button-with-help">
          <button
            type="button"
            class="helpicon"
            data-help="generator-generate-data-help"
            aria-label="Show file generation help"
            data-help-text='
              <p>Generate Data for currently defined rows and output format to file.</p>
              <p><a class="helplink" href="${GENERATE_TO_FILE_HELP_URL}" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
            '
          ></button>
          <button id="generateDataButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Data</button>
        </span>
        <span class="generator-button-with-help" id="generateAllPairsButtonWrapper" style="display:none;">
          <button
            type="button"
            class="helpicon"
            data-help="generator-pairwise-help"
            aria-label="Show pairwise generation help"
            data-help-text='
              <p>Generate Pairwise Data from schema to a file.</p>
              <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
            '
          ></button>
          <button id="generateAllPairsButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Pairwise</button>
        </span>
        <div class="generator-options-wrapper">
          <div id="generatorOptionsPanel" class="generator-options-panel"></div>
          <div id="generatorStatusText" class="generator-status-text" aria-live="polite" role="status"></div>
        </div>
      </section>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    if (typeof createRowCountControl === 'function') {
      const generateRowsRoot = this.root.querySelector('#generateRowsCountControl');
      if (generateRowsRoot) {
        this.rowCountControls.push(
          createRowCountControl({
            root: generateRowsRoot,
            documentObj: this.documentObj,
            props: {
              inputId: 'generateRowsCount',
              label: 'Generate Rows',
              min: 0,
              step: 1,
              value: 1000,
            },
          })
        );
      }
    }

    const outputSelect = this.getOutputFormatSelect();
    this.populateOutputFormats(outputSelect);

    const createStatusPresenter = this.services.createStatusPresenter;
    if (typeof createStatusPresenter === 'function') {
      this.statusPresenter = createStatusPresenter({
        documentObj: this.documentObj,
        elementId: 'generatorStatusText',
        hideWhenEmpty: false,
      });
    }

    const createLoadingStatusPresenter = this.services.createLoadingStatusPresenter;
    if (typeof createLoadingStatusPresenter === 'function') {
      this.loadingStatusPresenter = createLoadingStatusPresenter({
        documentObj: this.documentObj,
        elementId: 'generatorStatusText',
        hideWhenEmpty: false,
      });
    }

    const optionsParent = this.root.querySelector('#generatorOptionsPanel');
    const createFormatOptionsPanel = this.services.createFormatOptionsPanel;
    if (optionsParent && typeof createFormatOptionsPanel === 'function') {
      const state = this.controller.getState();
      this.formatOptionsPanel = createFormatOptionsPanel({
        root: optionsParent,
        documentObj: this.documentObj,
        windowObj: this.documentObj?.defaultView || globalThis.window,
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
    this.root.querySelector('#generateDataButton')?.addEventListener('click', this.handleGenerateDataClick);
    this.root.querySelector('#generateAllPairsButton')?.addEventListener('click', this.handleGeneratePairwiseClick);
    this.root.querySelector('#generatorOutputFormat')?.addEventListener('change', this.handleOutputFormatChange);
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

  render() {
    const state = this.controller.getState();
    const outputSelect = this.getOutputFormatSelect();
    if (outputSelect && outputSelect.value !== state.selectedFormat) {
      outputSelect.value = state.selectedFormat || 'csv';
    }

    this.root.querySelector('#generateAllPairsButtonWrapper').style.display = state.pairwiseVisible
      ? 'inline-flex'
      : 'none';
    this.formatOptionsPanel?.update({
      selectedFormat: state.selectedFormat,
      currentOptions: state.currentOptions,
    });
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.querySelector('#generateDataButton')?.removeEventListener('click', this.handleGenerateDataClick);
    this.root.querySelector('#generateAllPairsButton')?.removeEventListener('click', this.handleGeneratePairwiseClick);
    this.root.querySelector('#generatorOutputFormat')?.removeEventListener('change', this.handleOutputFormatChange);
    this.formatOptionsPanel?.destroy?.();
    this.rowCountControls.forEach((control) => control?.destroy?.());
    this.rowCountControls = [];
    this.root.replaceChildren();
  }

  getOutputFormatSelect() {
    return this.root.querySelector('#generatorOutputFormat');
  }

  getSelectedOutputType() {
    return this.getOutputFormatSelect()?.value;
  }

  setGenerationButtonsBusy(isBusy) {
    const generateDataButton = this.root.querySelector('#generateDataButton');
    if (generateDataButton) {
      generateDataButton.disabled = isBusy;
      generateDataButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    const generateAllPairsButton = this.root.querySelector('#generateAllPairsButton');
    if (generateAllPairsButton) {
      generateAllPairsButton.disabled = isBusy;
      generateAllPairsButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }
  }

  setStatus(message, options = {}) {
    this.statusPresenter?.setStatus(message, options);
  }

  showLoadingStatus(message) {
    this.loadingStatusPresenter?.setStatus(message);
  }

  clearStatus() {
    this.statusPresenter?.clear();
  }

  scheduleClearStatus(delayMs = 1200) {
    this.statusPresenter?.scheduleClear(delayMs);
  }

  getFormatOptionsPanel() {
    return this.formatOptionsPanel;
  }
}

export { GeneratorControlsView };
