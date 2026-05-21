import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { Download } from '../shared/download.js';
import { GridExtension as TabulatorGridExtension } from '../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { sanitizeUiOptionsForFormat } from './options-catalog-adapter.js';
import { createOptionsPanelsForParent, getOutputFormatGroups } from './options-ui-schema.js';
import { getKnownFakerCommandsAlphabetical } from '../shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../shared/domain-commands.js';
import { escapeHtml } from '../shared/html-escape.js';
import { TimedErrorDisplay } from '../shared/timed-error-display.js';
import {
  createSchemaEditingSession,
  schemaRowsToSpec as schemaRowsToSpecCore,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensCore,
  validateSchemaRows as validateSchemaRowsCore,
  mapDataRuleToSchemaRow,
  schemaErrorsToText,
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT as GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
} from '../shared/test-data/schema/index.js';
import {
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
  getVisibleDomainCommands,
} from '../shared/test-data/help/index.js';
import { createStatusPresenter } from '../shared/test-data/ui/index.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
  parseNonNegativeCount,
  isPairwiseEligibleForSchemaRows,
} from '../shared/test-data/generation/index.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseSourceType,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
} from '../shared/schema-row-rule-mapper.js';

const GENERATE_TO_FILE_HELP_URL = 'https://anywaydata.com/docs/test-data/generate-to-file';
function schemaRowsToSpec(schemaRows) {
  return schemaRowsToSpecCore({
    schemaRows,
    schemaRowsToDataRules,
    dataRulesToSchemaText,
  });
}

function schemaRowsToSpecWithTokens(schemaRows, schemaTokens) {
  return schemaRowsToSpecWithTokensCore({
    schemaRows,
    schemaTokens,
    buildDataRuleFromSchemaRow,
    dataRulesToSchemaText,
  });
}

function validateSchemaRows(schemaRows) {
  return validateSchemaRowsCore({
    schemaRows,
    schemaRowsToDataRules,
  });
}

class DataGeneratorPage {
  constructor({
    parentElement,
    documentObj = document,
    faker,
    RandExp,
    TabulatorCtor = globalThis?.Tabulator,
    GridExtensionClass = TabulatorGridExtension,
    ExporterClass = Exporter,
    DownloadClass = Download,
    TestDataGeneratorClass = TestDataGenerator,
  } = {}) {
    this.parentElement = parentElement;
    this.documentObj = documentObj;
    this.faker = faker;
    this.RandExp = RandExp;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.ExporterClass = ExporterClass;
    this.DownloadClass = DownloadClass;
    this.TestDataGeneratorClass = TestDataGeneratorClass;

    this.rowIdCounter = 1;
    this.schemaSession = createSchemaEditingSession({
      createBlankSchemaRow: () => this.createBlankSchemaRow(),
      schemaTextToDataRules,
      faker: this.faker,
      RandExp: this.RandExp,
      mapRuleToRow: (rule, leadingTextLines = []) => {
        const row = this.ruleToSchemaRow(rule);
        row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
        return row;
      },
      schemaRowsToSpecWithTokens,
    });
    this.fakerCommands = getKnownFakerCommandsAlphabetical().filter((command) => command !== 'RegEx');
    this.domainCommands = getKnownDomainCommandsAlphabetical();
    this.optionsPanels = {};
    this.statusPresenter = undefined;
    this.schemaErrorDisplay = undefined;
    this.lastPreviewDataTable = undefined;
  }

  get schemaRows() {
    return this.schemaSession.getRows();
  }

  set schemaRows(rows) {
    this.schemaSession.setRows(rows);
  }

  get schemaTextTokens() {
    return this.schemaSession.getTokens();
  }

  set schemaTextTokens(tokens) {
    this.schemaSession.setTokens(tokens);
  }

  get isTextMode() {
    return this.schemaSession.getTextMode();
  }

  set isTextMode(isTextMode) {
    this.schemaSession.setTextMode(isTextMode);
  }

  init() {
    if (!this.parentElement) {
      throw new Error('DataGeneratorPage requires a parentElement');
    }
    if (typeof this.TabulatorCtor !== 'function') {
      throw new Error('Tabulator library is not available');
    }

    this.renderPageShell();
    this.schemaErrorDisplay = new TimedErrorDisplay({
      documentObj: this.documentObj,
      elementId: 'generatorSchemaErrorText',
      timeoutMs: 5000,
    });
    this.statusPresenter = createStatusPresenter({
      documentObj: this.documentObj,
      elementId: 'generatorStatusText',
      hideWhenEmpty: false,
    });
    this.renderSchemaRows();
    this.updateSchemaEditModeView();

    this.previewTableApi = new this.TabulatorCtor(this.documentObj.getElementById('generator-preview-grid'), {
      data: [],
      columns: [{ title: '~preview', field: 'column1', sorter: 'string' }],
      autoColumns: false,
      headerSort: true,
      selectableRows: true,
      selectableRowsRangeMode: 'click',
      layout: 'fitDataStretch',
      columnDefaults: {
        resizable: true,
        editor: 'input',
        editorParams: { selectContents: true },
        headerFilter: 'input',
        headerFilterFunc: 'like',
        sorter: 'string',
      },
    });
    this.previewGrid = new this.GridExtensionClass(this.previewTableApi);
    this.exporter = new this.ExporterClass(this.previewGrid);
    this.setupOptionsPanels();
    this.renderOptionsPanelForSelectedFormat();

    this.attachEventHandlers();
  }

  createBlankSchemaRow() {
    return {
      id: `schema-row-${this.rowIdCounter++}`,
      name: '',
      sourceType: SOURCE_TYPE_REGEX,
      command: '',
      params: '',
      value: '',
      comments: '',
    };
  }

  getVisibleDomainCommands(currentCommand = '') {
    return getVisibleDomainCommands({
      commands: this.domainCommands,
      currentCommand: normaliseDomainCommand(currentCommand),
    });
  }

  renderPageShell() {
    this.parentElement.innerHTML = `
        <section class="generator-page" aria-label="Data Generator">
          <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
                    <div class="generator-schema-head">
              <strong id="generatorSchemaHeading">Schema</strong>
                        <span id="generatorSchemaErrorText" class="generator-schema-error-text" aria-live="polite" role="status"></span>
                        <span class="generator-button-with-help">
                          <span id="schemaModeHelpIcon" class="helpicon" data-help="generator-schema-mode-help"></span>
                          <button id="schemaModeToggleButton" class="icon-button" title="Toggle schema text mode">Edit as Text</button>
                        </span>
                    </div>
                    <div id="generatorSchemaRows" class="generator-schema-rows"></div>
                    <div id="generatorSchemaTextContainer" class="generator-schema-text">
                        <textarea id="generatorSchemaText" class="testDataSchemaTextArea" placeholder="Column Name&#10;rule&#10;Column Name&#10;rule"></textarea>
                    </div>
                    <div class="generator-schema-footer">
                        <button id="addSchemaRowButton" title="Add field">+ Add Field</button>
                    </div>
          </section>

            <section class="generator-controls" id="generatorGenerateOptionsSection" data-section-order="3" aria-labelledby="generatorGenerateOptionsHeading">
                      <div class="generator-controls-head">
              <strong id="generatorGenerateOptionsHeading">Generate Data and Options</strong>
                      </div>
                      <label>Generate Rows
                        <input type="number" id="generateRowsCount" min="0" value="1000">
                      </label>
                      <label>Output Format
                        <select id="generatorOutputFormat"></select>
                      </label>
                      <span class="generator-button-with-help">
                        <span
                          class="helpicon"
                          data-help="generator-generate-data-help"
                          data-help-text='
                            <p>Generate Data for currently defined rows and output format to file.</p>
                            <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
                          '
                        ></span>
                        <button id="generateDataButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Data</button>
                      </span>
                      <span class="generator-button-with-help" id="generateAllPairsButtonWrapper" style="display:none;">
                        <span
                          class="helpicon"
                          data-help="generator-pairwise-help"
                          data-help-text='
                            <p>Generate Pairwise Data from schema to a file.</p>
                            <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
                          '
                        ></span>
                        <button id="generateAllPairsButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Pairwise</button>
                      </span>
                      <div class="generator-options-wrapper">
                        <div id="generatorOptionsPanel" class="generator-options-panel"></div>
                        <div id="generatorStatusText" class="generator-status-text" aria-live="polite" role="status"></div>
                      </div>
                    </section>

                <section class="generator-preview" id="generatorPreviewSection" data-section-order="4" aria-labelledby="generatorPreviewHeading">
                    <div class="generator-preview-head">
                        <strong id="generatorPreviewHeading">Preview</strong>
                    </div>
                      <div class="generator-preview-controls" id="generatorPreviewControlsSection" data-subsection-order="1" aria-label="Preview Controls">
                        <label for="previewRowsCount" class="generator-preview-count-label">Preview Items Count</label>
                        <input type="number" id="previewRowsCount" min="0" max="50" value="10">
                        <span class="generator-button-with-help">
                          <span
                            class="helpicon"
                            data-help="generator-preview-help"
                            data-help-text='
                              <p>Show a preview of the defined items count in the Output Preview area.</p>
                            '
                          ></span>
                          <button id="previewDataButton">Preview</button>
                        </span>
                      </div>
                      <div class="generator-output-preview" id="generatorOutputPreviewSection" data-subsection-order="2" aria-label="Output Preview">
                        <label for="generatorOutputPreview">Output Preview</label>
                        <textarea id="generatorOutputPreview" readonly spellcheck="false"></textarea>
                      </div>
                      <div class="generator-data-table-preview" id="generatorDataTablePreviewSection" data-subsection-order="3" aria-label="Data Table Preview">
                        <label for="generator-preview-grid">Data Table Preview</label>
                        <div id="generator-preview-grid" class="ag-theme-alpine"></div>
                      </div>
                </section>
            </section>
        `;

    this.populateFormatOptions();
  }

  populateFormatOptions() {
    const outputSelect = this.documentObj.getElementById('generatorOutputFormat');
    if (!outputSelect) {
      return;
    }

    const formatGroups = getOutputFormatGroups();
    formatGroups.core.forEach(({ type, label }) => {
      if (!this.exporter?.canExport?.(type) && this.exporter) {
        return;
      }
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = label;
      outputSelect.appendChild(option);
    });

    const codeGroup = this.documentObj.createElement('optgroup');
    codeGroup.label = '-- Code --';
    formatGroups.code.forEach(({ type, label }) => {
      if (!this.exporter?.canExport?.(type) && this.exporter) {
        return;
      }
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = label;
      codeGroup.appendChild(option);
    });
    if (codeGroup.children.length > 0) {
      outputSelect.appendChild(codeGroup);
    }
    const unitTestCodeGroup = this.documentObj.createElement('optgroup');
    unitTestCodeGroup.label = '-- Code (Unit Test) --';
    formatGroups.unitTest.forEach(({ type, label }) => {
      if (!this.exporter?.canExport?.(type) && this.exporter) {
        return;
      }
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = label;
      unitTestCodeGroup.appendChild(option);
    });
    if (unitTestCodeGroup.children.length > 0) {
      outputSelect.appendChild(unitTestCodeGroup);
    }
    outputSelect.value = 'csv';
  }
  attachEventHandlers() {
    const addSchemaRowButton = this.documentObj.getElementById('addSchemaRowButton');
    addSchemaRowButton.addEventListener('click', () => {
      this.addRowAfter(this.schemaRows.length - 1);
    });

    const schemaModeToggleButton = this.documentObj.getElementById('schemaModeToggleButton');
    schemaModeToggleButton.addEventListener('click', () => this.toggleSchemaEditMode());
    const schemaTextArea = this.documentObj.getElementById('generatorSchemaText');
    schemaTextArea?.addEventListener('input', () => {
      this.updateAllPairsButtonVisibility();
    });
    this.documentObj.addEventListener('click', (event) => this.handleGlobalButtonClick(event));

    const previewDataButton = this.documentObj.getElementById('previewDataButton');
    previewDataButton.addEventListener('click', () => this.previewData());

    const generateDataButton = this.documentObj.getElementById('generateDataButton');
    generateDataButton.addEventListener('click', () => {
      void this.generateDataFile();
    });

    const generateAllPairsButton = this.documentObj.getElementById('generateAllPairsButton');
    generateAllPairsButton.addEventListener('click', () => {
      void this.generateAllPairsDataFile();
    });

    const outputFormat = this.documentObj.getElementById('generatorOutputFormat');
    outputFormat.addEventListener('change', () => {
      this.renderOptionsPanelForSelectedFormat();
      this.renderOutputPreviewForCurrentSelection();
    });

    const schemaRowsContainer = this.documentObj.getElementById('generatorSchemaRows');
    schemaRowsContainer.addEventListener('input', (event) => this.handleRowInputChange(event));
    schemaRowsContainer.addEventListener('change', (event) => this.handleRowInputChange(event));
    schemaRowsContainer.addEventListener('click', (event) => this.handleRowButtonClick(event));
  }

  setupOptionsPanels() {
    const optionsParent = this.documentObj.getElementById('generatorOptionsPanel');
    if (!optionsParent) {
      return;
    }

    this.optionsPanels = createOptionsPanelsForParent(optionsParent);
  }

  getSelectedOutputType() {
    return this.documentObj.getElementById('generatorOutputFormat')?.value;
  }

  renderOptionsPanelForSelectedFormat() {
    const type = this.getSelectedOutputType();
    const optionsParent = this.documentObj.getElementById('generatorOptionsPanel');
    if (!optionsParent) {
      return;
    }

    optionsParent.innerHTML = '';
    const panel = this.optionsPanels[type];
    if (!panel) {
      return;
    }

    panel.addToGui();
    const currentOptions = this.exporter?.getOptionsForType?.(type);
    if (currentOptions && typeof panel.setFromOptions === 'function') {
      panel.setFromOptions(currentOptions);
    }

    if (typeof panel.setApplyCallback === 'function') {
      this.configureOptionsApplyDirtyState(optionsParent);
      panel.setApplyCallback((options) => {
        this.applyCurrentTypeOptions(options);
        this.setOptionsApplyDirtyState(optionsParent, false);
      });
    }

    if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
      window.updateHelpHints();
    }
  }

  setOptionsApplyDirtyState(optionsParent, isDirty) {
    const applyButton = optionsParent?.querySelector?.('.apply-options');
    if (!applyButton) {
      return;
    }

    applyButton.disabled = isDirty !== true;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  configureOptionsApplyDirtyState(optionsParent) {
    const panelRoot = optionsParent?.firstElementChild;
    if (!panelRoot) {
      return;
    }

    this.setOptionsApplyDirtyState(optionsParent, false);

    const markDirty = (event) => {
      const target = event?.target;
      if (!target || typeof target.closest !== 'function') {
        return;
      }
      if (target.closest('.apply-options')) {
        return;
      }
      this.setOptionsApplyDirtyState(optionsParent, true);
    };

    panelRoot.addEventListener('input', markDirty);
    panelRoot.addEventListener('change', markDirty);
  }

  applyCurrentTypeOptions(options) {
    if (!options) {
      return;
    }
    const requestedType = options.outputFormat || this.getSelectedOutputType();
    if (!requestedType) {
      return;
    }

    // Persist options for the target format before rendering its panel.
    const sanitized = sanitizeUiOptionsForFormat(requestedType, options?.options || options);
    this.exporter?.setOptionsForType?.(requestedType, sanitized);

    const outputSelect = this.documentObj.getElementById('generatorOutputFormat');
    if (outputSelect && outputSelect.value !== requestedType) {
      outputSelect.value = requestedType;
      this.renderOptionsPanelForSelectedFormat();
    }

    const type = this.getSelectedOutputType() || requestedType;
    this.renderOutputPreviewForCurrentSelection();
    this.setGenerationStatus(`${type.toUpperCase()} options applied.`);
    this.scheduleClearGenerationStatus();
  }

  setGenerationButtonBusy(isBusy) {
    const generateDataButton = this.documentObj.getElementById('generateDataButton');
    if (generateDataButton) {
      generateDataButton.disabled = isBusy;
      generateDataButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    const generateAllPairsButton = this.documentObj.getElementById('generateAllPairsButton');
    if (generateAllPairsButton) {
      generateAllPairsButton.disabled = isBusy;
      generateAllPairsButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }
  }

  setGenerationStatus(message, isLoading = false) {
    this.statusPresenter?.setStatus(message, isLoading);
  }

  clearGenerationStatus() {
    this.statusPresenter?.clear();
  }

  scheduleClearGenerationStatus(delay = 1200) {
    this.statusPresenter?.scheduleClear(delay);
  }

  surfacePageError(message, { useSchemaStatus = false } = {}) {
    const text = String(message || '').trim();
    if (!text) {
      return;
    }
    if (useSchemaStatus) {
      this.showSchemaErrorStatus(text);
    } else {
      this.setGenerationStatus(text, false);
      this.scheduleClearGenerationStatus(5000);
    }
  }

  toggleSchemaEditMode() {
    this.hideVisibleHelpTooltips();
    if (this.isTextMode) {
      const textArea = this.documentObj.getElementById('generatorSchemaText');
      const toggleResult = this.schemaSession.toggleMode({
        schemaText: textArea?.value || '',
        preserveEmptyRows: true,
      });
      if (!toggleResult.ok) {
        this.showSchemaErrorStatus(schemaErrorsToText(toggleResult.errors));
        return;
      }
      this.clearSchemaErrorStatus();
      this.updateSchemaEditModeView();
      this.renderSchemaRows();
      return;
    }

    const textArea = this.documentObj.getElementById('generatorSchemaText');
    const toggleResult = this.schemaSession.toggleMode();
    textArea.value = toggleResult.schemaText || '';
    this.updateSchemaEditModeView();
  }

  showSchemaErrorStatus(message) {
    this.schemaErrorDisplay?.show(message);
  }

  clearSchemaErrorStatus() {
    this.schemaErrorDisplay?.clear();
  }

  hideVisibleHelpTooltips() {
    const modeHelpIcon = this.documentObj.getElementById('schemaModeHelpIcon');
    modeHelpIcon?._tippy?.hide?.();

    const tippyFn = this.documentObj?.defaultView?.tippy || globalThis?.tippy;
    tippyFn?.hideAll?.({ duration: 0 });
  }

  updateSchemaEditModeView() {
    const rowsContainer = this.documentObj.getElementById('generatorSchemaRows');
    const textContainer = this.documentObj.getElementById('generatorSchemaTextContainer');
    const footer = this.documentObj.querySelector('.generator-schema-footer');
    const toggleButton = this.documentObj.getElementById('schemaModeToggleButton');
    const modeHelpIcon = this.documentObj.getElementById('schemaModeHelpIcon');
    const addSchemaRowButton = this.documentObj.getElementById('addSchemaRowButton');

    const inTextMode = this.isTextMode === true;
    rowsContainer.style.display = inTextMode ? 'none' : 'flex';
    textContainer.style.display = inTextMode ? 'block' : 'none';
    footer.style.display = 'block';
    if (addSchemaRowButton) {
      addSchemaRowButton.style.display = inTextMode ? 'none' : 'inline-block';
    }
    toggleButton.textContent = inTextMode ? 'Edit as Schema' : 'Edit as Text';
    if (modeHelpIcon) {
      const modeHelpHtml = this.buildSchemaModeHelpHtml(inTextMode);
      modeHelpIcon.setAttribute('data-help-text', modeHelpHtml);
      modeHelpIcon._tippy?.setContent?.(modeHelpHtml);
    }
    if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
      window.updateHelpHints();
    }
  }

  invalidateSchemaTokensFromRows() {
    this.schemaSession.invalidateTokensFromRows();
  }

  handleGlobalButtonClick(event) {
    if (!event?.target?.closest) {
      return;
    }
    if (event.target.closest('.generator-schema-sample-button')) {
      event.preventDefault();
      event.stopPropagation();
      this.insertExampleSchema();
    }
  }

  insertExampleSchema() {
    const textArea = this.documentObj.getElementById('generatorSchemaText');
    if (textArea) {
      textArea.value = GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT;
    }
    this.isTextMode = true;
    this.updateSchemaEditModeView();
    this.syncSchemaRowsFromTextMode({ showErrors: true });
    this.renderSchemaRows();
  }

  buildSchemaModeHelpHtml(inTextMode) {
    if (inTextMode) {
      return `
        <p><strong>Edit as Schema</strong></p>
        <p>You are currently editing as text. Click <strong>Edit as Schema</strong> to return to row-based editing.</p>
        <p>Text schema uses name/rule pairs, for example:</p>
        <pre>First Name
person.firstName

Status
enum(active,inactive,pending)</pre>
        <button type="button" class="generator-schema-sample-button">Insert Example Schema</button>
      `;
    }
    return `
      <p><strong>Edit as Text</strong></p>
      <p>You are currently using row-based schema editing. Click <strong>Edit as Text</strong> to switch to text schema mode.</p>
      <p><a class="helplink" href="${GENERATE_TO_FILE_HELP_URL}" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
      <button type="button" class="generator-schema-sample-button">Insert Example Schema</button>
    `;
  }

  parseSchemaTextToRows(schemaText) {
    return this.schemaSession.parseTextToRows(schemaText);
  }

  syncSchemaRowsFromTextMode({ showErrors = false } = {}) {
    const textArea = this.documentObj.getElementById('generatorSchemaText');
    const parsed = this.schemaSession.syncRowsFromText({
      schemaText: textArea?.value || '',
      preserveEmptyRows: false,
    });
    if (parsed.errors.length > 0) {
      if (showErrors) {
        this.surfacePageError(schemaErrorsToText(parsed.errors), { useSchemaStatus: true });
      }
      return parsed;
    }
    return { rows: this.schemaRows, errors: [], tokens: this.schemaTextTokens };
  }

  ruleToSchemaRow(rule) {
    return mapDataRuleToSchemaRow(rule, {
      createBlankSchemaRow: () => this.createBlankSchemaRow(),
    });
  }

  renderSchemaRows() {
    const container = this.documentObj.getElementById('generatorSchemaRows');
    if (!container) {
      return;
    }

    container.innerHTML = '';

    this.schemaRows.forEach((row, index) => {
      const normalisedSourceType = normaliseSourceType(row.sourceType);
      const isFakerSource = normalisedSourceType === SOURCE_TYPE_FAKER;
      const isDomainSource = normalisedSourceType === SOURCE_TYPE_DOMAIN;
      const isCommandSource = isFakerSource || isDomainSource;
      const schemaHelp = this.getSchemaHelpData(normalisedSourceType, row.command);
      const showRowHelpLink = schemaHelp.show;
      const rowElem = this.documentObj.createElement('div');
      rowElem.className = `generator-schema-row ${isCommandSource ? 'generator-schema-row-faker' : 'generator-schema-row-non-faker'}`;
      rowElem.setAttribute('data-row-id', row.id);
      rowElem.innerHTML = `
                <div class="generator-row-actions">
                    <button class="icon-button" data-action="add" data-row-id="${row.id}" title="Add field">+</button>
                    <button class="icon-button" data-action="remove" data-row-id="${row.id}" title="Remove field">-</button>
                    <button class="icon-button" data-action="up" data-row-id="${row.id}" title="Move up" ${index === 0 ? 'disabled' : ''}>â†‘</button>
                    <button class="icon-button" data-action="down" data-row-id="${row.id}" title="Move down" ${index === this.schemaRows.length - 1 ? 'disabled' : ''}>â†“</button>
                </div>
                <input type="text" data-field="name" placeholder="Column Name" value="${escapeHtml(row.name)}">
                <select data-field="sourceType">
                    <option value="${SOURCE_TYPE_ENUM}" ${row.sourceType === SOURCE_TYPE_ENUM ? 'selected' : ''}>enum</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${row.sourceType === SOURCE_TYPE_LITERAL ? 'selected' : ''}>literal</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${row.sourceType === SOURCE_TYPE_REGEX ? 'selected' : ''}>regex</option>
                    <option value="${SOURCE_TYPE_FAKER}" ${row.sourceType === SOURCE_TYPE_FAKER ? 'selected' : ''}>faker</option>
                    <option value="${SOURCE_TYPE_DOMAIN}" ${row.sourceType === SOURCE_TYPE_DOMAIN ? 'selected' : ''}>domain</option>
                </select>
                ${
                  isCommandSource
                    ? `<select data-field="command">
                    <option value="">${isDomainSource ? 'Select domain command' : 'Select faker command'}</option>
                    ${(isDomainSource ? this.getVisibleDomainCommands(row.command) : this.fakerCommands)
                      .map((command) => {
                        const selected = command === row.command ? 'selected' : '';
                        return `<option value="${escapeHtml(command)}" ${selected}>${escapeHtml(command)}</option>`;
                      })
                      .join('')}
                </select>`
                    : ''
                }
                <a
                    data-field="faker-doc-link"
                    class="helpicon generator-schema-help-link"
                  data-help="generator-schema-help"
                  href="${escapeHtml(schemaHelp.docsUrl)}"
                  aria-label="${escapeHtml(schemaHelp.title)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ${showRowHelpLink ? '' : 'hidden'}
                ></a>
                ${
                  isCommandSource
                    ? `<input type="text" data-field="params" placeholder="Params e.g. (10)" value="${escapeHtml(row.params)}">`
                    : `<input type="text" data-field="value" placeholder="Value / Regex" value="${escapeHtml(row.value)}">`
                }
            `;
      const schemaHelpElement = rowElem.querySelector('[data-field="faker-doc-link"]');
      if (schemaHelpElement) {
        schemaHelpElement.setAttribute('data-help-text', schemaHelp.html);
      }
      container.appendChild(rowElem);
    });

    // Schema rows are re-rendered dynamically, so tooltips must be rebound each time.
    if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
      window.updateHelpHints();
    }

    // Update pairwise button visibility when schema rows change
    this.updateAllPairsButtonVisibility();
  }

  handleRowInputChange(event) {
    const rowElem = event.target.closest('.generator-schema-row');
    if (!rowElem) {
      return;
    }

    const rowId = rowElem.getAttribute('data-row-id');
    const index = this.schemaRows.findIndex((entry) => entry.id === rowId);
    if (index < 0) {
      return;
    }

    const fieldName = event.target.getAttribute('data-field');
    if (!fieldName) {
      return;
    }

    const updatedRow = this.schemaSession.updateRowAtIndex(index, (currentRow) => ({
      ...currentRow,
      [fieldName]: event.target.value,
    }));
    if (!updatedRow) {
      return;
    }

    if (fieldName === 'sourceType') {
      updatedRow.sourceType = normaliseSourceType(updatedRow.sourceType);
      this.renderSchemaRows();
      return;
    }

    if (fieldName === 'command') {
      if (updatedRow.sourceType === SOURCE_TYPE_DOMAIN) {
        updatedRow.command = normaliseDomainCommand(updatedRow.command);
      } else {
        updatedRow.command = normaliseFakerCommand(updatedRow.command);
      }
      this.renderSchemaRows();
    }

    // Update pairwise button visibility when schema changes
    this.updateAllPairsButtonVisibility();
  }

  handleRowButtonClick(event) {
    const action = event.target.getAttribute('data-action');
    if (!action) {
      return;
    }

    const rowId = event.target.getAttribute('data-row-id');
    const index = this.schemaRows.findIndex((row) => row.id === rowId);
    if (index < 0) {
      return;
    }

    if (action === 'add') {
      this.addRowAfter(index);
      return;
    }
    if (action === 'remove') {
      this.removeRow(index);
      return;
    }
    if (action === 'up') {
      this.moveRow(index, -1);
      return;
    }
    if (action === 'down') {
      this.moveRow(index, 1);
    }
  }

  addRowAfter(index) {
    this.schemaSession.addRowAfterIndex(index);
    this.renderSchemaRows();
  }

  removeRow(index) {
    this.schemaSession.removeRowAtIndex(index);
    this.renderSchemaRows();
  }

  moveRow(index, direction) {
    this.schemaSession.moveRowAtIndex(index, direction);
    this.renderSchemaRows();
  }

  parseRowCount(inputId) {
    const inputElem = this.documentObj.getElementById(inputId);
    const maxValue = inputElem?.max ? Number.parseInt(inputElem.max, 10) : null;
    const parsed = parseNonNegativeCount(inputElem?.value, { min: 0, max: maxValue });
    if (!parsed.valid) {
      return { value: 0, errors: [`${inputId} must be a number greater than or equal to zero.`] };
    }
    const rawValue = Number.parseInt(inputElem?.value, 10);
    if (Number.isFinite(maxValue) && Number.isFinite(rawValue) && rawValue > maxValue) {
      return { value: parsed.value, errors: [`${inputId} must be less than or equal to ${maxValue}.`] };
    }
    return { value: parsed.value, errors: [] };
  }

  renderOutputPreviewForCurrentSelection() {
    const outputPreviewElem = this.documentObj.getElementById('generatorOutputPreview');
    if (!outputPreviewElem) {
      return;
    }

    const type = this.getSelectedOutputType();
    const dataTable = this.lastPreviewDataTable;
    if (!type || !dataTable || !this.exporter?.canExport(type)) {
      outputPreviewElem.value = '';
      return;
    }

    try {
      outputPreviewElem.value = this.exporter.getDataTableAs(type, dataTable);
    } catch (error) {
      console.error(error);
      outputPreviewElem.value = '';
    }
  }

  createConfiguredGenerator() {
    const parsed = this.syncSchemaRowsFromTextMode({ showErrors: false });
    if (parsed.errors?.length > 0) {
      return { errors: parsed.errors };
    }

    return createConfiguredGeneratorFromSchemaRows({
      schemaRows: parsed.rows,
      validateSchemaRows,
      schemaRowsToSpec,
      TestDataGeneratorClass: this.TestDataGeneratorClass,
      faker: this.faker,
      RandExp: this.RandExp,
      buildRuleSpecFromSchemaRow,
      extractLiteralValueFromRuleSpec,
      extractRegexValueFromRuleSpec,
      SOURCE_TYPE_FAKER,
      SOURCE_TYPE_DOMAIN,
      SOURCE_TYPE_LITERAL,
      SOURCE_TYPE_ENUM,
      SOURCE_TYPE_REGEX,
    });
  }

  buildDataTable(generator, rowCount) {
    return createPreviewDataTable({
      rowCount,
      generator,
      GenericDataTableClass: GenericDataTable,
    });
  }

  previewData() {
    const rowCount = this.parseRowCount('previewRowsCount');
    if (rowCount.errors.length > 0) {
      this.surfacePageError(rowCount.errors.join('\n'));
      return;
    }

    const configured = this.createConfiguredGenerator();
    if (configured.errors?.length > 0) {
      this.surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
      return;
    }

    const dataTable = this.buildDataTable(configured.generator, rowCount.value);
    this.lastPreviewDataTable = dataTable;
    this.previewGrid.setGridFromGenericDataTable(dataTable);
    this.renderOutputPreviewForCurrentSelection();
  }

  async generateDataFile() {
    const rowCount = this.parseRowCount('generateRowsCount');
    if (rowCount.errors.length > 0) {
      this.surfacePageError(rowCount.errors.join('\n'));
      return;
    }

    const configured = this.createConfiguredGenerator();
    if (configured.errors?.length > 0) {
      this.surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
      return;
    }

    const type = this.getSelectedOutputType();
    if (!this.exporter.canExport(type)) {
      this.surfacePageError(`Output format ${type} is not supported.`);
      return;
    }

    this.clearGenerationStatus();
    this.setGenerationButtonBusy(true);
    this.setGenerationStatus(`Preparing ${type.toUpperCase()} export...`, true);

    try {
      const dataTable = this.buildDataTable(configured.generator, rowCount.value);
      let text = '';
      if (typeof this.exporter.getDataTableAsAsync === 'function') {
        text = await this.exporter.getDataTableAsAsync(type, dataTable, (message) => {
          if (message) {
            this.setGenerationStatus(message, true);
          }
        });
      } else {
        text = this.exporter.getDataTableAs(type, dataTable);
      }

      const filename = `generated-data${this.exporter.getFileExtensionFor(type)}`;
      const downloader = new this.DownloadClass(filename);
      downloader.downloadFile(text);
      this.setGenerationStatus(`Download ready: ${filename}`);
      this.scheduleClearGenerationStatus();
    } catch (error) {
      console.error(error);
      this.surfacePageError('Unable to generate data file.');
      this.setGenerationStatus('Failed to generate data file.');
    } finally {
      this.setGenerationButtonBusy(false);
    }
  }

  async generateAllPairsDataFile() {
    const configured = this.createConfiguredGenerator();
    if (configured.errors?.length > 0) {
      this.surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
      return;
    }

    // Count enum columns
    const enumCount = this.countEnumColumns();
    if (enumCount < 2) {
      this.surfacePageError('Pairwise generation requires at least 2 enum columns.');
      return;
    }

    const type = this.getSelectedOutputType();
    if (!this.exporter.canExport(type)) {
      this.surfacePageError(`Output format ${type} is not supported.`);
      return;
    }

    this.clearGenerationStatus();
    this.setGenerationButtonBusy(true);
    this.setGenerationStatus('Generating pairwise combinations...', true);

    try {
      const dataTable = this.buildAllPairsDataTable(configured.generator);
      if (!dataTable) {
        this.surfacePageError('Failed to generate pairwise data.');
        this.setGenerationStatus('Pairwise generation failed.');
        return;
      }

      let text = '';
      if (typeof this.exporter.getDataTableAsAsync === 'function') {
        text = await this.exporter.getDataTableAsAsync(type, dataTable, (message) => {
          if (message) {
            this.setGenerationStatus(message, true);
          }
        });
      } else {
        text = this.exporter.getDataTableAs(type, dataTable);
      }

      const filename = `all-pairs-data${this.exporter.getFileExtensionFor(type)}`;
      const downloader = new this.DownloadClass(filename);
      downloader.downloadFile(text);
      this.setGenerationStatus(`Download ready: ${filename} (${dataTable.getRowCount()} combinations)`);
      this.scheduleClearGenerationStatus();
    } catch (error) {
      console.error(error);
      this.surfacePageError('Unable to generate pairwise data file.');
      this.setGenerationStatus('Failed to generate pairwise data file.');
    } finally {
      this.setGenerationButtonBusy(false);
    }
  }

  countEnumColumns() {
    const parsed = this.syncSchemaRowsFromTextMode({ showErrors: false });
    if (parsed.errors?.length > 0) {
      return 0;
    }

    const { errors, rows } = validateSchemaRows(parsed.rows);
    if (errors.length > 0) {
      return 0;
    }
    return rows.filter(
      (row) =>
        String(row?.sourceType || '')
          .trim()
          .toLowerCase() === SOURCE_TYPE_ENUM
    ).length;
  }

  buildAllPairsDataTable(generator) {
    return createPairwiseDataTable({
      generator,
      PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
      GenericDataTableClass: GenericDataTable,
      faker: this.faker,
      RandExp: this.RandExp,
    });
  }

  updateAllPairsButtonVisibility() {
    const buttonWrapper = this.documentObj.getElementById('generateAllPairsButtonWrapper');
    if (buttonWrapper) {
      const parsed = this.syncSchemaRowsFromTextMode({ showErrors: false });
      const { errors, rows } = validateSchemaRows(parsed.rows);
      buttonWrapper.style.display =
        !parsed.errors?.length && !errors.length && isPairwiseEligibleForSchemaRows(rows) ? 'inline-flex' : 'none';
    }
  }

  getSchemaHelpData(sourceType, commandValue) {
    const model = buildSchemaHelpModel(sourceType, commandValue);
    return {
      ...model,
      html: renderSchemaHelpHtml(model),
    };
  }
}

export {
  DataGeneratorPage,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  normaliseFakerCommand,
};
