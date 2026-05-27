/*
 * Responsibilities:
 * - Public DataGeneratorPage entrypoint for the standalone generator page.
 * - Composes generator host/schema/generation collaborators while keeping the class API stable.
 */

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { Download } from '../../shared/download.js';
import { GridExtension as TabulatorGridExtension } from '../../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { getKnownFakerCommandsAlphabetical } from '../../shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../shared/domain-commands.js';
import {
  createSchemaEditingSession,
  schemaRowsToSpec as schemaRowsToSpecCore,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensCore,
  validateSchemaRows as validateSchemaRowsCore,
  mapDataRuleToSchemaRow,
  schemaErrorsToText,
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT as GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
} from '../../shared/test-data/schema/index.js';
import {
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
  getVisibleDomainCommands,
} from '../../shared/test-data/help/index.js';
import {
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  normaliseFakerCommand,
  normaliseDomainCommand,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
} from '../../shared/schema-row-rule-mapper.js';
import {
  initializeDataGeneratorPageHost,
  populateGeneratorFormatOptions,
  GENERATE_TO_FILE_HELP_URL,
} from '../host/index.js';
import {
  buildSchemaModeHelpHtml,
  hideVisibleHelpTooltips,
  updateSchemaEditModeView,
  insertExampleSchema,
  renderGeneratorSchemaRows,
  handleGeneratorRowInputChange,
  handleGeneratorRowButtonClick,
} from '../schema/index.js';
import { openMethodPickerModal } from '../../shared/test-data/ui/index.js';
import {
  createConfiguredGeneratorForPage,
  buildPreviewDataTable,
  buildPairwiseDataTable,
  parseGeneratorRowCount,
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
  countGeneratorEnumColumns,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
} from '../generation/index.js';
import { createOptionsPanelsForParent, getOutputFormatGroups, sanitizeUiOptionsForFormat } from '../options/index.js';

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
    this.fakerCommands = getKnownFakerCommandsAlphabetical().filter(
      (command) => command !== 'RegEx' && command.startsWith('helpers.')
    );
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

    initializeDataGeneratorPageHost({
      page: this,
      createOptionsPanelsForParentFn: createOptionsPanelsForParent,
      populateFormatOptionsFn: () => this.populateFormatOptions(),
    });
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

  populateFormatOptions() {
    populateGeneratorFormatOptions({
      documentObj: this.documentObj,
      exporter: this.exporter,
      getOutputFormatGroupsFn: getOutputFormatGroups,
    });
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

    const windowObj = this.documentObj?.defaultView || globalThis.window;
    if (typeof windowObj?.updateHelpHints === 'function') {
      windowObj.updateHelpHints();
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
    hideVisibleHelpTooltips({ documentObj: this.documentObj });
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

  updateSchemaEditModeView() {
    updateSchemaEditModeView({
      documentObj: this.documentObj,
      isTextMode: this.isTextMode === true,
      generateToFileHelpUrl: GENERATE_TO_FILE_HELP_URL,
      sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
    });
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
    insertExampleSchema({
      documentObj: this.documentObj,
      sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
      setIsTextMode: (isTextMode) => {
        this.isTextMode = isTextMode;
      },
      updateSchemaEditModeViewFn: () => this.updateSchemaEditModeView(),
      syncSchemaRowsFromTextMode: (options) => this.syncSchemaRowsFromTextMode(options),
      renderSchemaRows: () => this.renderSchemaRows(),
    });
  }

  buildSchemaModeHelpHtml(inTextMode) {
    return buildSchemaModeHelpHtml({
      inTextMode,
      generateToFileHelpUrl: GENERATE_TO_FILE_HELP_URL,
      sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
    });
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
    renderGeneratorSchemaRows({
      documentObj: this.documentObj,
      schemaRows: this.schemaRows,
      fakerCommands: this.fakerCommands,
      getVisibleDomainCommands: (currentCommand) => this.getVisibleDomainCommands(currentCommand),
      getSchemaHelpData: (sourceType, commandValue) => this.getSchemaHelpData(sourceType, commandValue),
      updateAllPairsButtonVisibility: () => this.updateAllPairsButtonVisibility(),
    });
  }

  handleRowInputChange(event) {
    handleGeneratorRowInputChange({
      event,
      schemaRows: this.schemaRows,
      schemaSession: this.schemaSession,
      renderSchemaRows: () => this.renderSchemaRows(),
      updateAllPairsButtonVisibility: () => this.updateAllPairsButtonVisibility(),
    });
  }

  async handleRowButtonClick(event) {
    const pickerButton = event?.target?.closest?.('[data-action="pick-command"]');
    if (pickerButton) {
      const rowId = pickerButton.getAttribute('data-row-id');
      const index = this.schemaRows.findIndex((entry) => entry.id === rowId);
      if (index >= 0) {
        const row = this.schemaRows[index];
        const options = [
          {
            sourceType: SOURCE_TYPE_ENUM,
            command: 'enum',
            helpModel: buildSchemaHelpModel(SOURCE_TYPE_ENUM, 'enum'),
          },
          {
            sourceType: SOURCE_TYPE_LITERAL,
            command: 'literal',
            helpModel: buildSchemaHelpModel(SOURCE_TYPE_LITERAL, 'literal'),
          },
          {
            sourceType: SOURCE_TYPE_REGEX,
            command: 'regex',
            helpModel: buildSchemaHelpModel(SOURCE_TYPE_REGEX, 'regex'),
          },
          ...this.getVisibleDomainCommands(row.command).map((command) => ({
            sourceType: 'domain',
            command,
            helpModel: buildSchemaHelpModel('domain', command),
          })),
          ...this.fakerCommands.map((command) => ({
            sourceType: 'faker',
            command,
            helpModel: buildSchemaHelpModel('faker', command),
          })),
        ];
        const selected = await openMethodPickerModal({
          documentObj: this.documentObj,
          windowObj: this.documentObj?.defaultView || globalThis.window,
          options,
          currentCommand: row.command,
          initialTab: this.getPickerInitialTab(row.sourceType),
          title: 'Select schema method',
        });
        if (selected?.command) {
          this.schemaSession.updateRowAtIndex(index, (currentRow) => ({
            ...currentRow,
            sourceType: selected.sourceType || currentRow.sourceType,
            command: selected.command,
          }));
          this.renderSchemaRows();
        }
      }
      return;
    }

    handleGeneratorRowButtonClick({
      event,
      schemaRows: this.schemaRows,
      addRowAfter: (index) => this.addRowAfter(index),
      removeRow: (index) => this.removeRow(index),
      moveRow: (index, direction) => this.moveRow(index, direction),
    });
  }

  getPickerInitialTab(sourceType) {
    const type = String(sourceType || '').toLowerCase();
    if (type === SOURCE_TYPE_FAKER) {
      return 'faker';
    }
    if (type === SOURCE_TYPE_ENUM || type === SOURCE_TYPE_LITERAL || type === SOURCE_TYPE_REGEX) {
      return 'core';
    }
    if (type === SOURCE_TYPE_DOMAIN) {
      return 'all';
    }
    return 'all';
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
    return parseGeneratorRowCount({ documentObj: this.documentObj, inputId });
  }

  renderOutputPreviewForCurrentSelection() {
    renderGeneratorOutputPreview({
      documentObj: this.documentObj,
      getSelectedOutputType: () => this.getSelectedOutputType(),
      lastPreviewDataTable: this.lastPreviewDataTable,
      exporter: this.exporter,
    });
  }

  createConfiguredGenerator() {
    return createConfiguredGeneratorForPage({
      syncSchemaRowsFromTextMode: (options) => this.syncSchemaRowsFromTextMode(options),
      validateSchemaRows,
      schemaRowsToSpec,
      TestDataGeneratorClass: this.TestDataGeneratorClass,
      faker: this.faker,
      RandExp: this.RandExp,
    });
  }

  buildDataTable(generator, rowCount) {
    return buildPreviewDataTable({ generator, rowCount });
  }

  previewData() {
    previewGeneratorData({
      parseRowCount: (inputId) => this.parseRowCount(inputId),
      createConfiguredGenerator: () => this.createConfiguredGenerator(),
      buildDataTable: (generator, rowCount) => this.buildDataTable(generator, rowCount),
      previewGrid: this.previewGrid,
      setLastPreviewDataTable: (dataTable) => {
        this.lastPreviewDataTable = dataTable;
      },
      renderOutputPreviewForCurrentSelection: () => this.renderOutputPreviewForCurrentSelection(),
      surfacePageError: (message, options) => this.surfacePageError(message, options),
      clearPageError: () => this.clearSchemaErrorStatus(),
    });
  }

  async generateDataFile() {
    await generateGeneratorDataFile({
      parseRowCount: (inputId) => this.parseRowCount(inputId),
      createConfiguredGenerator: () => this.createConfiguredGenerator(),
      getSelectedOutputType: () => this.getSelectedOutputType(),
      exporter: this.exporter,
      clearGenerationStatus: () => this.clearGenerationStatus(),
      setGenerationButtonBusy: (isBusy) => this.setGenerationButtonBusy(isBusy),
      setGenerationStatus: (message, isLoading) => this.setGenerationStatus(message, isLoading),
      buildDataTable: (generator, rowCount) => this.buildDataTable(generator, rowCount),
      DownloadClass: this.DownloadClass,
      surfacePageError: (message, options) => this.surfacePageError(message, options),
      clearPageError: () => this.clearSchemaErrorStatus(),
      scheduleClearGenerationStatus: (delay) => this.scheduleClearGenerationStatus(delay),
    });
  }

  async generateAllPairsDataFile() {
    await generateGeneratorAllPairsDataFile({
      createConfiguredGenerator: () => this.createConfiguredGenerator(),
      countEnumColumns: () => this.countEnumColumns(),
      getSelectedOutputType: () => this.getSelectedOutputType(),
      exporter: this.exporter,
      clearGenerationStatus: () => this.clearGenerationStatus(),
      setGenerationButtonBusy: (isBusy) => this.setGenerationButtonBusy(isBusy),
      setGenerationStatus: (message, isLoading) => this.setGenerationStatus(message, isLoading),
      buildAllPairsDataTable: (generator) => this.buildAllPairsDataTable(generator),
      DownloadClass: this.DownloadClass,
      surfacePageError: (message, options) => this.surfacePageError(message, options),
      clearPageError: () => this.clearSchemaErrorStatus(),
      scheduleClearGenerationStatus: (delay) => this.scheduleClearGenerationStatus(delay),
    });
  }

  countEnumColumns() {
    return countGeneratorEnumColumns({
      syncSchemaRowsFromTextMode: (options) => this.syncSchemaRowsFromTextMode(options),
      validateSchemaRows,
    });
  }

  buildAllPairsDataTable(generator) {
    return buildPairwiseDataTable({
      generator,
      faker: this.faker,
      RandExp: this.RandExp,
    });
  }

  updateAllPairsButtonVisibility() {
    updateGeneratorPairwiseButtonVisibility({
      documentObj: this.documentObj,
      syncSchemaRowsFromTextMode: (options) => this.syncSchemaRowsFromTextMode(options),
      validateSchemaRows,
    });
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
