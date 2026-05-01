import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { Download } from './download.js';
import { GridExtension as TabulatorGridExtension } from './data-grid-editor/tabulator/gridExtension-tabulator.js';
import { CsvDelimitedOptions } from './options_panels/options-csv-delimited-controls.js';
import { DelimitedOptions } from './options_panels/options-delimited-controls.js';
import { MarkdownOptionsPanel } from './options_panels/options-markdown-panel.js';
import { JsonOptionsPanel } from './options_panels/options-json-panel.js';
import { JavaOptionsPanel } from './options_panels/options-java-panel.js';
import { JavascriptOptionsPanel } from './options_panels/options-javascript-panel.js';
import { PythonOptionsPanel } from './options_panels/options-python-panel.js';
import { PhpOptionsPanel } from './options_panels/options-php-panel.js';
import { RubyOptionsPanel } from './options_panels/options-ruby-panel.js';
import { KotlinOptionsPanel } from './options_panels/options-kotlin-panel.js';
import { CSharpOptionsPanel } from './options_panels/options-csharp-panel.js';
import { PerlOptionsPanel } from './options_panels/options-perl-panel.js';
import { TypeScriptOptionsPanel } from './options_panels/options-typescript-panel.js';
import { XmlOptionsPanel } from './options_panels/options-xml-panel.js';
import { SqlOptionsPanel } from './options_panels/options-sql-panel.js';
import { HtmlOptionsPanel } from './options_panels/options-html-panel.js';
import { GherkinOptionsPanel } from './options_panels/options-gherkin-panel.js';
import { AsciiTableOptionsPanel } from './options_panels/options-ascii-table.js';
import { getKnownFakerCommandsAlphabetical, getKnownFakerCommandsLongestFirst } from './faker-commands.js';
import { getFakerCommandHelp } from './faker-command-help-metadata.js';

const SOURCE_TYPE_FAKER = 'faker';
const SOURCE_TYPE_REGEX = 'regex';
const SOURCE_TYPE_LITERAL = 'literal';
const REGEX_HELP_URL = 'https://anywaydata.com/docs/test-data/regex-test-data';
const FAKER_HELP_URL = 'https://anywaydata.com/docs/test-data/faker-test-data';
const LITERAL_HELP_URL = 'https://anywaydata.com/docs/category/generating-data';

function normaliseFakerCommand(commandValue) {
  const command = String(commandValue || '').trim();
  if (command.startsWith('faker.')) {
    return command.replace('faker.', '');
  }
  return command;
}

function normaliseSourceType(sourceType) {
  const normalised = String(sourceType || '')
    .trim()
    .toLowerCase();
  if (normalised === SOURCE_TYPE_FAKER || normalised === SOURCE_TYPE_REGEX || normalised === SOURCE_TYPE_LITERAL) {
    return normalised;
  }
  return SOURCE_TYPE_REGEX;
}

function buildRuleSpecFromSchemaRow(row) {
  const sourceType = normaliseSourceType(row?.sourceType);
  if (sourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(row?.command);
    const params = String(row?.params ?? '').trim();
    return `${command}${params}`;
  }
  return String(row?.value ?? '').trim();
}

function schemaRowsToSpec(schemaRows) {
  const lines = [];
  (schemaRows || []).forEach((row) => {
    lines.push(String(row?.name ?? '').trim());
    lines.push(buildRuleSpecFromSchemaRow(row));
  });
  return lines.join('\n');
}

function validateSchemaRows(schemaRows) {
  const errors = [];
  const rows = (schemaRows || []).map((row, index) => {
    return {
      id: row?.id ?? `row-${index + 1}`,
      name: String(row?.name ?? '').trim(),
      sourceType: normaliseSourceType(row?.sourceType),
      command: normaliseFakerCommand(row?.command),
      params: String(row?.params ?? '').trim(),
      value: String(row?.value ?? '').trim(),
      order: index,
    };
  });

  if (rows.length === 0) {
    errors.push('Add at least one schema row.');
  }

  rows.forEach((row, index) => {
    if (row.name.length === 0) {
      errors.push(`Row ${index + 1}: column name is required.`);
    }
    if (row.sourceType === SOURCE_TYPE_FAKER && row.command.length === 0) {
      errors.push(`Row ${index + 1}: faker command is required.`);
    }
  });

  return { errors, rows };
}

class DataGeneratorPage {
  constructor({
    parentElement,
    documentObj = document,
    alertFn,
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
    this.alertFn =
      typeof alertFn === 'function'
        ? alertFn
        : (message) => {
            const windowAlert = this.documentObj?.defaultView?.alert || globalThis?.alert;
            if (typeof windowAlert === 'function') {
              windowAlert.call(this.documentObj?.defaultView || globalThis, message);
              return;
            }
            console.error(message);
          };
    this.faker = faker;
    this.RandExp = RandExp;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.ExporterClass = ExporterClass;
    this.DownloadClass = DownloadClass;
    this.TestDataGeneratorClass = TestDataGeneratorClass;

    this.rowIdCounter = 1;
    this.schemaRows = [];
    this.fakerCommands = getKnownFakerCommandsAlphabetical().filter((command) => command !== 'RegEx');
    this.fakerCommandsLongestFirst = getKnownFakerCommandsLongestFirst().filter((command) => command !== 'RegEx');
    this.isTextMode = false;
    this.optionsPanels = {};
    this.generationStatusTimer = undefined;
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
    };
  }

  renderPageShell() {
    this.parentElement.innerHTML = `
        <section class="generator-page" aria-label="Data Generator">
          <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
                    <div class="generator-schema-head">
              <strong id="generatorSchemaHeading">Schema</strong>
                        <button id="schemaModeToggleButton" class="icon-button" title="Toggle schema text mode">Edit as Text</button>
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
                      <button id="generateDataButton">Generate Data</button>
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
                        <button id="previewDataButton">Preview</button>
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

    const orderedTypes = ['csv', 'json', 'jsonl', 'xml', 'sql', 'markdown', 'dsv', 'html', 'gherkin', 'asciitable'];
    orderedTypes.forEach((type) => {
      if (!this.exporter?.canExport?.(type) && this.exporter) {
        return;
      }
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = type.toUpperCase();
      outputSelect.appendChild(option);
    });

    const codeTypes = [
      { type: 'csharp', label: 'C#' },
      { type: 'java', label: 'Java' },
      { type: 'javascript', label: 'JavaScript' },
      { type: 'kotlin', label: 'Kotlin' },
      { type: 'perl', label: 'Perl' },
      { type: 'php', label: 'PHP' },
      { type: 'python', label: 'Python' },
      { type: 'ruby', label: 'Ruby' },
      { type: 'typescript', label: 'TypeScript' },
    ];
    const codeGroup = this.documentObj.createElement('optgroup');
    codeGroup.label = '-- Code --';
    codeTypes.forEach(({ type, label }) => {
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
    outputSelect.value = 'csv';
  }
  attachEventHandlers() {
    const addSchemaRowButton = this.documentObj.getElementById('addSchemaRowButton');
    addSchemaRowButton.addEventListener('click', () => {
      this.addRowAfter(this.schemaRows.length - 1);
    });

    const schemaModeToggleButton = this.documentObj.getElementById('schemaModeToggleButton');
    schemaModeToggleButton.addEventListener('click', () => this.toggleSchemaEditMode());

    const previewDataButton = this.documentObj.getElementById('previewDataButton');
    previewDataButton.addEventListener('click', () => this.previewData());

    const generateDataButton = this.documentObj.getElementById('generateDataButton');
    generateDataButton.addEventListener('click', () => {
      void this.generateDataFile();
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

    this.optionsPanels = {};
    this.optionsPanels['csv'] = new CsvDelimitedOptions(optionsParent);
    this.optionsPanels['dsv'] = new DelimitedOptions(optionsParent);
    this.optionsPanels['markdown'] = new MarkdownOptionsPanel(optionsParent);
    this.optionsPanels['json'] = new JsonOptionsPanel(optionsParent);
    this.optionsPanels['jsonl'] = new JsonOptionsPanel(optionsParent, 'jsonl-options', { jsonlMode: true });
    this.optionsPanels['javascript'] = new JavascriptOptionsPanel(optionsParent);
    this.optionsPanels['java'] = new JavaOptionsPanel(optionsParent);
    this.optionsPanels['python'] = new PythonOptionsPanel(optionsParent);
    this.optionsPanels['kotlin'] = new KotlinOptionsPanel(optionsParent);
    this.optionsPanels['csharp'] = new CSharpOptionsPanel(optionsParent);
    this.optionsPanels['perl'] = new PerlOptionsPanel(optionsParent);
    this.optionsPanels['php'] = new PhpOptionsPanel(optionsParent);
    this.optionsPanels['ruby'] = new RubyOptionsPanel(optionsParent);
    this.optionsPanels['typescript'] = new TypeScriptOptionsPanel(optionsParent);
    this.optionsPanels['xml'] = new XmlOptionsPanel(optionsParent);
    this.optionsPanels['sql'] = new SqlOptionsPanel(optionsParent);
    this.optionsPanels['html'] = new HtmlOptionsPanel(optionsParent);
    this.optionsPanels['gherkin'] = new GherkinOptionsPanel(optionsParent);
    this.optionsPanels['asciitable'] = new AsciiTableOptionsPanel(optionsParent);
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
    const type = this.getSelectedOutputType();
    if (!type || !options) {
      return;
    }
    this.exporter?.setOptionsForType?.(type, options);
    this.renderOutputPreviewForCurrentSelection();
    this.setGenerationStatus(`${type.toUpperCase()} options applied.`);
    this.scheduleClearGenerationStatus();
  }

  setGenerationButtonBusy(isBusy) {
    const generateDataButton = this.documentObj.getElementById('generateDataButton');
    if (!generateDataButton) {
      return;
    }
    generateDataButton.disabled = isBusy;
    generateDataButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
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

  toggleSchemaEditMode() {
    if (this.isTextMode) {
      const textArea = this.documentObj.getElementById('generatorSchemaText');
      const parsed = this.parseSchemaTextToRows(textArea?.value || '');
      if (parsed.errors.length > 0) {
        this.alertFn(parsed.errors.join('\n'));
        return;
      }
      this.schemaRows = parsed.rows.length > 0 ? parsed.rows : [this.createBlankSchemaRow()];
      this.renderSchemaRows();
      this.isTextMode = false;
      this.updateSchemaEditModeView();
      return;
    }

    const textArea = this.documentObj.getElementById('generatorSchemaText');
    textArea.value = schemaRowsToSpec(this.schemaRows);
    this.isTextMode = true;
    this.updateSchemaEditModeView();
  }

  updateSchemaEditModeView() {
    const rowsContainer = this.documentObj.getElementById('generatorSchemaRows');
    const textContainer = this.documentObj.getElementById('generatorSchemaTextContainer');
    const footer = this.documentObj.querySelector('.generator-schema-footer');
    const toggleButton = this.documentObj.getElementById('schemaModeToggleButton');

    const inTextMode = this.isTextMode === true;
    rowsContainer.style.display = inTextMode ? 'none' : 'flex';
    textContainer.style.display = inTextMode ? 'block' : 'none';
    footer.style.display = inTextMode ? 'none' : 'block';
    toggleButton.textContent = inTextMode ? 'Edit as Schema' : 'Edit as Text';
  }

  parseSchemaTextToRows(schemaText) {
    const text = String(schemaText ?? '');
    if (text.trim().length === 0) {
      return { rows: [], errors: [] };
    }

    const generator = new this.TestDataGeneratorClass(this.faker, this.RandExp);
    generator.importSpec(text);
    generator.compile();
    if (!generator.isValid()) {
      return { rows: [], errors: generator.errors() };
    }

    const rows = generator.testDataRules().map((rule) => this.ruleToSchemaRow(rule));
    return { rows, errors: [] };
  }

  ruleToSchemaRow(rule) {
    const row = this.createBlankSchemaRow();
    row.name = String(rule?.name ?? '');
    row.sourceType = normaliseSourceType(rule?.type);

    if (row.sourceType === SOURCE_TYPE_FAKER) {
      const parts = this.extractFakerCommandAndParams(rule?.ruleSpec);
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

  renderSchemaRows() {
    const container = this.documentObj.getElementById('generatorSchemaRows');
    if (!container) {
      return;
    }

    container.innerHTML = '';

    this.schemaRows.forEach((row, index) => {
      const normalisedSourceType = normaliseSourceType(row.sourceType);
      const isFakerSource = normalisedSourceType === SOURCE_TYPE_FAKER;
      const schemaHelp = this.getSchemaHelpData(normalisedSourceType, row.command);
      const showRowHelpLink = schemaHelp.show;
      const rowElem = this.documentObj.createElement('div');
      rowElem.className = `generator-schema-row ${isFakerSource ? 'generator-schema-row-faker' : 'generator-schema-row-non-faker'}`;
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
                    <option value="${SOURCE_TYPE_FAKER}" ${row.sourceType === SOURCE_TYPE_FAKER ? 'selected' : ''}>faker</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${row.sourceType === SOURCE_TYPE_REGEX ? 'selected' : ''}>regex</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${row.sourceType === SOURCE_TYPE_LITERAL ? 'selected' : ''}>literal</option>
                </select>
                ${
                  isFakerSource
                    ? `<select data-field="command">
                    <option value="">Select faker command</option>
                    ${this.fakerCommands
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
                  isFakerSource
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

    row[fieldName] = event.target.value;
    if (fieldName === 'sourceType') {
      row.sourceType = normaliseSourceType(row.sourceType);
      this.renderSchemaRows();
      return;
    }

    if (fieldName === 'command') {
      row.command = normaliseFakerCommand(row.command);
      this.renderSchemaRows();
    }
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
    this.renderSchemaRows();
  }

  removeRow(index) {
    if (this.schemaRows.length <= 1) {
      this.schemaRows = [this.createBlankSchemaRow()];
    } else {
      this.schemaRows.splice(index, 1);
    }
    this.renderSchemaRows();
  }

  moveRow(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.schemaRows.length) {
      return;
    }
    const [row] = this.schemaRows.splice(index, 1);
    this.schemaRows.splice(targetIndex, 0, row);
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
    const { errors, rows } = validateSchemaRows(this.schemaRows);
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
      if (row.sourceType === SOURCE_TYPE_LITERAL) {
        rule.type = SOURCE_TYPE_LITERAL;
        rule.ruleSpec = row.value;
        return;
      }
      rule.type = SOURCE_TYPE_REGEX;
      rule.ruleSpec = row.value;
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
      dataTable.appendDataRow(generator.generateRow());
    }
    return dataTable;
  }

  previewData() {
    const rowCount = this.parseRowCount('previewRowsCount');
    if (rowCount.errors.length > 0) {
      this.alertFn(rowCount.errors.join('\n'));
      return;
    }

    const configured = this.createConfiguredGenerator();
    if (configured.errors?.length > 0) {
      this.alertFn(configured.errors.join('\n'));
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
      this.alertFn(rowCount.errors.join('\n'));
      return;
    }

    const configured = this.createConfiguredGenerator();
    if (configured.errors?.length > 0) {
      this.alertFn(configured.errors.join('\n'));
      return;
    }

    const type = this.getSelectedOutputType();
    if (!this.exporter.canExport(type)) {
      this.alertFn(`Output format ${type} is not supported.`);
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
      this.alertFn('Unable to generate data file.');
      this.setGenerationStatus('Failed to generate data file.');
    } finally {
      this.setGenerationButtonBusy(false);
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
    if (normalisedSourceType === SOURCE_TYPE_LITERAL) {
      return LITERAL_HELP_URL;
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

  buildFakerCallSignature(heading, params) {
    const commandName = heading.startsWith('faker.') ? heading : `faker.${heading}`;
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

  buildFakerCommandHelpHtml({ heading, summary, docsUrl, params, example }) {
    const sections = [`<p><strong>${this.escapeHtml(heading)}</strong></p>`, `<p>${this.escapeHtml(summary)}</p>`];

    sections.push(
      `<p><strong>Call:</strong> <code>${this.escapeHtml(this.buildFakerCallSignature(heading, params))}</code></p>`
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

    const commandName = heading.startsWith('faker.') ? heading.replace('faker.', '') : heading;
    const docsLinkText = commandName.length > 0 ? `Learn more: faker.${commandName}` : 'Learn more';
    sections.push(
      `<p><a class="helplink" href="${this.escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(docsLinkText)}</a></p>`
    );

    return sections.join('');
  }
}

export { DataGeneratorPage, buildRuleSpecFromSchemaRow, schemaRowsToSpec, validateSchemaRows, normaliseFakerCommand };
