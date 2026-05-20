import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { Download } from './download.js';
import { GridExtension as TabulatorGridExtension } from './data-grid-editor/tabulator/gridExtension-tabulator.js';
import { sanitizeUiOptionsForFormat } from './options-catalog-adapter.js';
import { createOptionsPanelsForParent, getOutputFormatGroups } from './options-ui-schema.js';
import { getKnownFakerCommandsAlphabetical, getKnownFakerCommandsLongestFirst } from './faker-commands.js';
import { getFakerCommandHelp } from './faker-command-help-metadata.js';
import {
  getKnownDomainCommandsAlphabetical,
  getKnownDomainCommandsLongestFirst,
  getDomainKeywordByCommand,
} from './domain-commands.js';
import { getDomainCommandHelp } from './domain-command-help-metadata.js';
import { TimedErrorDisplay } from './timed-error-display.js';
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
} from './schema-row-rule-mapper.js';

const REGEX_HELP_URL = 'https://anywaydata.com/docs/test-data/regex-test-data';
const FAKER_HELP_URL = 'https://anywaydata.com/docs/test-data/faker-test-data';
const DOMAIN_HELP_URL = 'https://anywaydata.com/docs/test-data/domain/domain-test-data';
const DOMAIN_NON_SCALAR_RETURN_TYPES = new Set(['array', 'object']);
const LITERAL_HELP_URL = 'https://anywaydata.com/docs/category/generating-data';
const ENUM_HELP_URL = 'https://anywaydata.com/docs/category/generating-data';
const GENERATE_TO_FILE_HELP_URL = 'https://anywaydata.com/docs/test-data/generate-to-file';
const DEFAULT_EXAMPLE_SCHEMA_TEXT = `# Example schema
First Name
person.firstName

Last Name
person.lastName

Email
internet.email

Status
enum(active,inactive,pending)

Priority
enum(high,medium,low)

Created Date
date.recent`;

function getDisplayDomainCommand(keywordEntry) {
  const shortest = String(keywordEntry?.shortestUniqueAlias || '').trim();
  if (shortest) {
    return shortest;
  }
  return String(keywordEntry?.keyword || '').trim();
}

function normaliseReturnType(returnType) {
  return String(returnType || '')
    .trim()
    .toLowerCase();
}

function isDomainCommandVisibleByDefault(command) {
  const commandHelp = getDomainCommandHelp(command);
  const returnType = normaliseReturnType(commandHelp?.returnType);
  if (!returnType) {
    return true;
  }
  return !DOMAIN_NON_SCALAR_RETURN_TYPES.has(returnType);
}

function schemaRowsToSpec(schemaRows) {
  const renderResult = dataRulesToSchemaText({
    dataRules: schemaRowsToDataRules({ schemaRows }).dataRules,
  });
  return renderResult.text;
}

function schemaRowsToSpecWithTokens(schemaRows, schemaTokens) {
  const dataRules = (Array.isArray(schemaRows) ? schemaRows : [])
    .map((row) => buildDataRuleFromSchemaRow(row))
    .filter(Boolean);

  const renderResult = dataRulesToSchemaText({
    dataRules,
    schemaTokens,
  });
  return renderResult.text;
}

function validateSchemaRows(schemaRows) {
  const result = schemaRowsToDataRules({ schemaRows });
  return { errors: result.errors, rows: result.rows };
}

function schemaErrorsToText(errors = []) {
  return (Array.isArray(errors) ? errors : [])
    .map((error) => {
      if (error && typeof error === 'object' && typeof error.message === 'string') {
        return error.message;
      }
      return String(error ?? '');
    })
    .join('\n');
}

function normaliseGeneratedCellValue(value) {
  if (value === undefined || value === null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return value;
}

function normaliseGeneratedRow(row = []) {
  if (!Array.isArray(row)) {
    return [];
  }
  return row.map((value) => normaliseGeneratedCellValue(value));
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
    this.schemaRows = [];
    this.schemaTextTokens = [];
    this.fakerCommands = getKnownFakerCommandsAlphabetical().filter((command) => command !== 'RegEx');
    this.fakerCommandsLongestFirst = getKnownFakerCommandsLongestFirst().filter((command) => command !== 'RegEx');
    this.domainCommands = getKnownDomainCommandsAlphabetical();
    this.domainCommandsLongestFirst = getKnownDomainCommandsLongestFirst();
    this.isTextMode = false;
    this.optionsPanels = {};
    this.generationStatusTimer = undefined;
    this.schemaErrorDisplay = undefined;
    this.lastPreviewDataTable = undefined;
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
    this.schemaRows = [this.createBlankSchemaRow()];
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
    const visible = this.domainCommands.filter((command) => isDomainCommandVisibleByDefault(command));
    const selectedCommand = normaliseDomainCommand(currentCommand);
    if (!selectedCommand) {
      return visible;
    }
    if (!visible.includes(selectedCommand) && this.domainCommands.includes(selectedCommand)) {
      visible.push(selectedCommand);
      visible.sort((a, b) => a.localeCompare(b));
    }
    return visible;
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
                        <textarea id="generatorSchemaText" class="testDataDefn" placeholder="Column Name&#10;rule&#10;Column Name&#10;rule"></textarea>
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
    const statusElement = this.documentObj.getElementById('generatorStatusText');
    if (!statusElement) {
      return;
    }
    statusElement.textContent = message || '';
    statusElement.classList.toggle('is-loading', isLoading && Boolean(message));
  }

  clearGenerationStatus() {
    if (this.generationStatusTimer) {
      clearTimeout(this.generationStatusTimer);
      this.generationStatusTimer = undefined;
    }
    this.setGenerationStatus('', false);
  }

  scheduleClearGenerationStatus(delay = 1200) {
    if (this.generationStatusTimer) {
      clearTimeout(this.generationStatusTimer);
    }
    this.generationStatusTimer = setTimeout(() => {
      this.generationStatusTimer = undefined;
      this.setGenerationStatus('', false);
    }, delay);
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
      const parsed = this.parseSchemaTextToRows(textArea?.value || '');
      if (parsed.errors.length > 0) {
        this.showSchemaErrorStatus(schemaErrorsToText(parsed.errors));
        return;
      }
      this.clearSchemaErrorStatus();
      this.schemaRows = parsed.rows.length > 0 ? parsed.rows : [this.createBlankSchemaRow()];
      this.schemaTextTokens = parsed.tokens || [];
      this.isTextMode = false;
      this.updateSchemaEditModeView();
      this.renderSchemaRows();
      return;
    }

    const textArea = this.documentObj.getElementById('generatorSchemaText');
    textArea.value = schemaRowsToSpecWithTokens(this.schemaRows, this.schemaTextTokens);
    this.isTextMode = true;
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

  getTrailingTextLinesFromSchemaTokens() {
    if (!Array.isArray(this.schemaTextTokens) || this.schemaTextTokens.length === 0) {
      return [];
    }

    const trailing = [];
    for (let index = this.schemaTextTokens.length - 1; index >= 0; index -= 1) {
      const token = this.schemaTextTokens[index];
      if (token?.kind === 'rule') {
        break;
      }
      if (token?.kind === 'blank' || token?.kind === 'comment') {
        trailing.unshift(String(token.text ?? ''));
      }
    }
    return trailing;
  }

  invalidateSchemaTokensFromRows() {
    const trailingLines = this.getTrailingTextLinesFromSchemaTokens();
    if (trailingLines.length > 0 && this.schemaRows.length > 0) {
      const lastRow = this.schemaRows[this.schemaRows.length - 1];
      const existingComments = String(lastRow?.comments ?? '');
      const trailingText = trailingLines.join('\n');
      lastRow.comments = existingComments.length > 0 ? `${existingComments}\n${trailingText}` : trailingText;
    }
    this.schemaTextTokens = [];
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
      textArea.value = DEFAULT_EXAMPLE_SCHEMA_TEXT;
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
    const text = String(schemaText ?? '');
    if (text.trim().length === 0) {
      return { rows: [], errors: [], tokens: [] };
    }

    const parseResult = schemaTextToDataRules({
      schemaText: text,
      faker: this.faker,
      RandExp: this.RandExp,
      TestDataGeneratorClass: this.TestDataGeneratorClass,
    });
    if (parseResult.errors.length > 0) {
      return { rows: [], errors: parseResult.errors, tokens: [] };
    }

    const rows = parseResult.dataRules.map((rule) => this.ruleToSchemaRow(rule));
    const tokens = parseResult.schemaTokens || [];
    const rowsByTokenOrder = [];
    let pendingLeadingTextLines = [];
    tokens.forEach((token) => {
      if (token?.kind === 'comment' || token?.kind === 'blank') {
        pendingLeadingTextLines.push(String(token?.text ?? ''));
        return;
      }
      if (token?.kind === 'rule') {
        const row = rows[rowsByTokenOrder.length];
        if (row) {
          row.leadingTextLines = pendingLeadingTextLines.slice();
          rowsByTokenOrder.push(row);
        }
        pendingLeadingTextLines = [];
      }
    });
    return { rows, errors: [], tokens };
  }

  syncSchemaRowsFromTextMode({ showErrors = false } = {}) {
    if (!this.isTextMode) {
      return { rows: this.schemaRows, errors: [], tokens: this.schemaTextTokens };
    }

    const textArea = this.documentObj.getElementById('generatorSchemaText');
    const parsed = this.parseSchemaTextToRows(textArea?.value || '');
    if (parsed.errors.length > 0) {
      if (showErrors) {
        this.surfacePageError(schemaErrorsToText(parsed.errors), { useSchemaStatus: true });
      }
      return parsed;
    }

    // Keep empty text schemas as zero rows while in text mode so validation can
    // report "Add at least one schema row." instead of introducing a synthetic blank row.
    this.schemaRows = parsed.rows;
    this.schemaTextTokens = parsed.tokens || [];
    return { rows: this.schemaRows, errors: [], tokens: this.schemaTextTokens };
  }

  ruleToSchemaRow(rule) {
    const row = this.createBlankSchemaRow();
    row.name = String(rule?.name ?? '');
    row.comments = String(rule?.comments ?? '');
    row.leadingTextLines = [];
    row.sourceType = normaliseSourceType(rule?.type);

    if (row.sourceType === SOURCE_TYPE_FAKER) {
      const parts = this.extractFakerCommandAndParams(rule?.ruleSpec);
      row.command = parts.command;
      row.params = parts.params;
      row.value = '';
      return row;
    }
    if (row.sourceType === SOURCE_TYPE_DOMAIN) {
      const parts = this.extractDomainCommandAndParams(rule?.ruleSpec);
      row.command = parts.command;
      row.params = parts.params;
      row.value = '';
      return row;
    }

    row.value = String(rule?.ruleSpec ?? '');
    row.command = '';
    row.params = '';
    return row;
  }

  extractFakerCommandAndParams(ruleSpec) {
    const normalisedSpec = normaliseFakerCommand(String(ruleSpec ?? '').trim());
    for (const command of this.fakerCommandsLongestFirst) {
      if (normalisedSpec === command) {
        return { command, params: '' };
      }
      if (normalisedSpec.startsWith(command)) {
        return {
          command,
          params: normalisedSpec.slice(command.length),
        };
      }
    }

    return { command: '', params: normalisedSpec };
  }

  extractDomainCommandAndParams(ruleSpec) {
    const normalisedSpec = normaliseDomainCommand(String(ruleSpec ?? '').trim());
    const exactKeyword = getDomainKeywordByCommand(normalisedSpec);
    if (exactKeyword) {
      return { command: getDisplayDomainCommand(exactKeyword), params: '' };
    }

    const openParenIndex = normalisedSpec.indexOf('(');
    if (openParenIndex > 0) {
      const commandPart = normalisedSpec.slice(0, openParenIndex).trim();
      const commandKeyword = getDomainKeywordByCommand(commandPart);
      if (commandKeyword) {
        return {
          command: getDisplayDomainCommand(commandKeyword),
          params: normalisedSpec.slice(openParenIndex),
        };
      }
    }

    for (const command of this.domainCommandsLongestFirst) {
      if (normalisedSpec === command) {
        return { command, params: '' };
      }
      if (normalisedSpec.startsWith(command)) {
        const remainder = normalisedSpec.slice(command.length);
        if (remainder.length > 0 && !remainder.startsWith('(')) {
          continue;
        }
        return {
          command,
          params: remainder,
        };
      }
    }
    return { command: '', params: normalisedSpec };
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
                    <button class="icon-button" data-action="up" data-row-id="${row.id}" title="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="icon-button" data-action="down" data-row-id="${row.id}" title="Move down" ${index === this.schemaRows.length - 1 ? 'disabled' : ''}>↓</button>
                </div>
                <input type="text" data-field="name" placeholder="Column Name" value="${this.escapeHtml(row.name)}">
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
                        return `<option value="${this.escapeHtml(command)}" ${selected}>${this.escapeHtml(command)}</option>`;
                      })
                      .join('')}
                </select>`
                    : ''
                }
                <a
                    data-field="faker-doc-link"
                    class="helpicon generator-schema-help-link"
                  data-help="generator-schema-help"
                  href="${this.escapeHtml(schemaHelp.docsUrl)}"
                  aria-label="${this.escapeHtml(schemaHelp.title)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ${showRowHelpLink ? '' : 'hidden'}
                ></a>
                ${
                  isCommandSource
                    ? `<input type="text" data-field="params" placeholder="Params e.g. (10)" value="${this.escapeHtml(row.params)}">`
                    : `<input type="text" data-field="value" placeholder="Value / Regex" value="${this.escapeHtml(row.value)}">`
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
    const row = this.schemaRows.find((entry) => entry.id === rowId);
    if (!row) {
      return;
    }

    const fieldName = event.target.getAttribute('data-field');
    if (!fieldName) {
      return;
    }

    this.invalidateSchemaTokensFromRows();
    row[fieldName] = event.target.value;
    if (fieldName === 'sourceType') {
      row.sourceType = normaliseSourceType(row.sourceType);
      this.renderSchemaRows();
      return;
    }

    if (fieldName === 'command') {
      if (row.sourceType === SOURCE_TYPE_DOMAIN) {
        row.command = normaliseDomainCommand(row.command);
      } else {
        row.command = normaliseFakerCommand(row.command);
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
    const insertAt = Math.min(Math.max(index + 1, 0), this.schemaRows.length);
    this.schemaRows.splice(insertAt, 0, this.createBlankSchemaRow());
    this.invalidateSchemaTokensFromRows();
    this.renderSchemaRows();
  }

  removeRow(index) {
    if (this.schemaRows.length <= 1) {
      this.schemaRows = [this.createBlankSchemaRow()];
    } else {
      this.schemaRows.splice(index, 1);
    }
    this.invalidateSchemaTokensFromRows();
    this.renderSchemaRows();
  }

  moveRow(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.schemaRows.length) {
      return;
    }
    const [row] = this.schemaRows.splice(index, 1);
    this.schemaRows.splice(targetIndex, 0, row);
    this.invalidateSchemaTokensFromRows();
    this.renderSchemaRows();
  }

  parseRowCount(inputId) {
    const inputElem = this.documentObj.getElementById(inputId);
    const rawValue = Number.parseInt(inputElem?.value, 10);
    if (Number.isNaN(rawValue) || rawValue < 0) {
      return { value: 0, errors: [`${inputId} must be a number greater than or equal to zero.`] };
    }

    if (inputElem?.max) {
      const maxValue = Number.parseInt(inputElem.max, 10);
      if (!Number.isNaN(maxValue) && rawValue > maxValue) {
        return { value: maxValue, errors: [`${inputId} must be less than or equal to ${maxValue}.`] };
      }
    }

    return { value: rawValue, errors: [] };
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

    const { errors, rows } = validateSchemaRows(parsed.rows);
    if (errors.length > 0) {
      return { errors };
    }

    const generator = new this.TestDataGeneratorClass(this.faker, this.RandExp);
    generator.importSpec(schemaRowsToSpec(rows));
    generator.compile();

    const rules = generator.testDataRules();
    rows.forEach((row, index) => {
      const rule = rules[index];
      if (!rule) {
        return;
      }
      if (row.sourceType === SOURCE_TYPE_FAKER) {
        rule.type = SOURCE_TYPE_FAKER;
        rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
        return;
      }
      if (row.sourceType === SOURCE_TYPE_DOMAIN) {
        rule.type = SOURCE_TYPE_DOMAIN;
        rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
        return;
      }
      if (row.sourceType === SOURCE_TYPE_LITERAL) {
        rule.type = SOURCE_TYPE_LITERAL;
        rule.ruleSpec = extractLiteralValueFromRuleSpec(buildRuleSpecFromSchemaRow(row));
        return;
      }
      if (row.sourceType === SOURCE_TYPE_ENUM) {
        rule.type = SOURCE_TYPE_ENUM;
        rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
        return;
      }
      rule.type = SOURCE_TYPE_REGEX;
      rule.ruleSpec = extractRegexValueFromRuleSpec(buildRuleSpecFromSchemaRow(row));
    });

    generator.compiler.validate();
    if (!generator.isValid()) {
      return { errors: generator.errors() };
    }

    return { generator };
  }

  buildDataTable(generator, rowCount) {
    const dataTable = new GenericDataTable();
    dataTable.setHeaders(generator.generateHeadersArray());
    for (let row = 0; row < rowCount; row++) {
      dataTable.appendDataRow(normaliseGeneratedRow(generator.generateRow()));
    }
    return dataTable;
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
    return rows.filter((row) => row.sourceType === SOURCE_TYPE_ENUM).length;
  }

  buildAllPairsDataTable(generator) {
    try {
      // Pass the same faker and RandExp instances used by the main generator
      const pairwiseGenerator = new PairwiseTestDataGenerator(this.faker, this.RandExp);
      const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules());

      if (initResult.isError) {
        console.error('Pairwise initialization error:', initResult.errorMessage);
        return null;
      }

      const dataResult = pairwiseGenerator.generateAllDataRecordsAsRows();
      if (dataResult.isError) {
        console.error('Pairwise generation error:', dataResult.errorMessage);
        return null;
      }

      // Convert to GenericDataTable format
      const dataTable = new GenericDataTable();
      const [headers, ...rows] = dataResult.data.data; // Access the nested data array
      dataTable.setHeaders(headers);
      rows.forEach((row) => {
        dataTable.appendDataRow(row);
      });

      return dataTable;
    } catch (error) {
      console.error('Pairwise table creation error:', error);
      return null;
    }
  }

  updateAllPairsButtonVisibility() {
    const enumCount = this.countEnumColumns();
    const buttonWrapper = this.documentObj.getElementById('generateAllPairsButtonWrapper');
    if (buttonWrapper) {
      buttonWrapper.style.display = enumCount >= 2 ? 'inline-flex' : 'none';
    }
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  getFakerHelpUrl(commandValue) {
    const command = normaliseFakerCommand(commandValue);
    if (!command) {
      return FAKER_HELP_URL;
    }

    const moduleName = command.split('.')[0];
    if (!moduleName) {
      return FAKER_HELP_URL;
    }

    return `https://fakerjs.dev/api/${moduleName}`;
  }

  getSchemaHelpUrl(sourceType, commandValue) {
    const normalisedSourceType = normaliseSourceType(sourceType);
    if (normalisedSourceType === SOURCE_TYPE_REGEX) {
      return REGEX_HELP_URL;
    }
    if (normalisedSourceType === SOURCE_TYPE_FAKER) {
      return this.getFakerHelpUrl(commandValue);
    }
    if (normalisedSourceType === SOURCE_TYPE_DOMAIN) {
      return DOMAIN_HELP_URL;
    }
    if (normalisedSourceType === SOURCE_TYPE_LITERAL) {
      return LITERAL_HELP_URL;
    }
    if (normalisedSourceType === SOURCE_TYPE_ENUM) {
      return ENUM_HELP_URL;
    }
    return '';
  }

  getSchemaHelpData(sourceType, commandValue) {
    const normalisedSourceType = normaliseSourceType(sourceType);
    if (normalisedSourceType === SOURCE_TYPE_REGEX) {
      return {
        show: true,
        title: 'Regex data help',
        docsUrl: REGEX_HELP_URL,
        html: this.buildTypeHelpHtml(
          'Regex',
          'Regex patterns generate random values that match the specified expression.',
          REGEX_HELP_URL
        ),
      };
    }

    if (normalisedSourceType === SOURCE_TYPE_LITERAL) {
      return {
        show: true,
        title: 'Literal data help',
        docsUrl: LITERAL_HELP_URL,
        html: this.buildTypeHelpHtml(
          'Literal',
          'Literal data repeats the exact text you enter for every generated row.',
          LITERAL_HELP_URL
        ),
      };
    }

    if (normalisedSourceType === SOURCE_TYPE_ENUM) {
      return {
        show: true,
        title: 'Enum data help',
        docsUrl: ENUM_HELP_URL,
        html: this.buildTypeHelpHtml(
          'Enum',
          'Enum values allow you to specify a list of discrete options. Use formats like "Red,Blue,Green" or "enum("Option1", "Option2")".',
          ENUM_HELP_URL
        ),
      };
    }

    if (normalisedSourceType === SOURCE_TYPE_FAKER) {
      const command = normaliseFakerCommand(commandValue);
      if (!command) {
        return {
          show: true,
          title: 'Faker data help',
          docsUrl: FAKER_HELP_URL,
          html: this.buildTypeHelpHtml(
            'Faker',
            'Faker commands generate realistic random values such as names, addresses, and dates.',
            FAKER_HELP_URL
          ),
        };
      }

      const commandHelp = getFakerCommandHelp(command);
      const docsUrl = commandHelp?.docsUrl || this.getFakerHelpUrl(command);
      const heading = `faker.${command}`;
      const summary = commandHelp?.summary || `Generates data using ${heading}.`;
      return {
        show: true,
        title: `Faker command help: ${command}`,
        docsUrl,
        html: this.buildFakerCommandHelpHtml({
          heading,
          summary,
          docsUrl,
          params: commandHelp?.params || [],
          example: commandHelp?.example,
        }),
      };
    }
    if (normalisedSourceType === SOURCE_TYPE_DOMAIN) {
      const command = normaliseDomainCommand(commandValue);
      if (!command) {
        return {
          show: true,
          title: 'Domain data help',
          docsUrl: DOMAIN_HELP_URL,
          html: this.buildTypeHelpHtml(
            'Domain',
            'Domain commands provide a controlled interface for data generation.',
            DOMAIN_HELP_URL
          ),
        };
      }
      const commandHelp = getDomainCommandHelp(command);
      const heading = commandHelp?.canonical || command;
      const docsUrl = commandHelp?.docsUrl || DOMAIN_HELP_URL;
      const summary = commandHelp?.summary || `Generates data using ${heading}.`;
      return {
        show: true,
        title: `Domain command help: ${command}`,
        docsUrl,
        html: this.buildCommandHelpHtml({
          heading,
          summary,
          docsUrl,
          params: commandHelp?.args || [],
          example: commandHelp?.example,
        }),
      };
    }

    return { show: false, title: '', docsUrl: '', html: '' };
  }

  buildTypeHelpHtml(typeName, summary, docsUrl) {
    return [
      `<p><strong>${this.escapeHtml(typeName)}</strong></p>`,
      `<p>${this.escapeHtml(summary)}</p>`,
      `<p><a class="helplink" href="${this.escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">Learn more</a></p>`,
    ].join('');
  }

  cleanFakerParamTypeForHelp(typeText) {
    const withoutDocComments = String(typeText || '').replace(/\/\*\*[\s\S]*?\*\//g, ' ');
    return withoutDocComments.replace(/\s+/g, ' ').trim();
  }

  buildCallSignature(heading, params) {
    const commandName = String(heading || '').trim();
    if (!Array.isArray(params) || params.length === 0) {
      return `${commandName}()`;
    }

    const args = params.map((param) => `${param.name}${param.optional ? '?' : ''}`).join(', ');
    return `${commandName}(${args})`;
  }

  buildSchemaParamsHint(params) {
    if (!Array.isArray(params) || params.length === 0) {
      return '()';
    }
    return `(${params.map((param) => param.name).join(', ')})`;
  }

  cleanFakerParamDescriptionForHelp(descriptionText) {
    return String(descriptionText || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  buildCommandHelpHtml({ heading, summary, docsUrl, params, example }) {
    const sections = [`<p><strong>${this.escapeHtml(heading)}</strong></p>`, `<p>${this.escapeHtml(summary)}</p>`];

    sections.push(
      `<p><strong>Call:</strong> <code>${this.escapeHtml(this.buildCallSignature(heading, params))}</code></p>`
    );

    if (Array.isArray(params) && params.length > 0) {
      const paramItems = params
        .map((param) => {
          const paramName = `${param.name}${param.optional ? '?' : ''}`;
          const paramType = this.cleanFakerParamTypeForHelp(param.type);
          const paramDescription = this.cleanFakerParamDescriptionForHelp(param.description);
          const descriptionHtml = paramDescription.length > 0 ? ` - ${this.escapeHtml(paramDescription)}` : '';
          return `<li><code>${this.escapeHtml(paramName)}</code>: <code>${this.escapeHtml(paramType)}</code>${descriptionHtml}</li>`;
        })
        .join('');

      sections.push(
        `<p><strong>Schema params field:</strong> <code>${this.escapeHtml(this.buildSchemaParamsHint(params))}</code></p>`
      );
      sections.push(`<p><strong>Params:</strong></p><ul>${paramItems}</ul>`);
    }

    if (String(example || '').length > 0) {
      sections.push(`<p><strong>Example:</strong> <code>${this.escapeHtml(example)}</code></p>`);
    } else {
      sections.push('<p><strong>Example:</strong> Output depends on your selected params.</p>');
    }

    const docsLinkText = `Learn more: ${heading}`;
    sections.push(
      `<p><a class="helplink" href="${this.escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(docsLinkText)}</a></p>`
    );

    return sections.join('');
  }

  buildFakerCommandHelpHtml({ heading, summary, docsUrl, params, example }) {
    return this.buildCommandHelpHtml({ heading, summary, docsUrl, params, example });
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
