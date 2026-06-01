/*
 * Responsibilities:
 * - Generator-page runtime orchestration for the standalone generator page.
 * - Coordinates schema, controls, preview, and generation helpers while keeping page behavior testable.
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
  createSchemaRowValidation,
  mapDataRuleToSchemaRow,
  schemaErrorsToText,
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT as GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
} from '../../shared/test-data/schema/index.js';
import { getVisibleDomainCommands, buildSchemaHelpModel } from '../../shared/test-data/help/index.js';
import {
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
  normaliseDomainCommand,
  normaliseFakerCommand,
} from '../../shared/schema-row-rule-mapper.js';
import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';
import { buildSchemaModeHelpHtml } from '../schema/index.js';
import { createGeneratorPageComponent } from '../page/index.js';
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
import { applySanitizedUiOptionsToTargets } from '../options/index.js';

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
    this.schemaErrorDisplay = undefined;
    this.schemaDefinition = undefined;
    this.generatorControls = undefined;
    this.generatorPreview = undefined;
    this.generatorPage = undefined;
    this.lastPreviewDataTable = undefined;
    this.rowCountControls = [];
    this.schemaTextToDataRules = schemaTextToDataRules;
    this.dataRulesToSchemaText = dataRulesToSchemaText;
    this.sampleSchemaText = GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT;
  }

  get schemaRows() {
    if (this.schemaDefinition?.getState) {
      return this.schemaDefinition.getState().rows || [];
    }
    return this.schemaSession.getRows();
  }

  set schemaRows(rows) {
    this.schemaDefinition?.setRows?.(rows);
    this.schemaSession.setRows(rows);
  }

  get schemaTextTokens() {
    if (this.schemaDefinition?.getTokens) {
      return this.schemaDefinition.getTokens() || [];
    }
    return this.schemaSession.getTokens();
  }

  set schemaTextTokens(tokens) {
    this.schemaDefinition?.setTokens?.(tokens);
    this.schemaSession.setTokens(tokens);
  }

  get isTextMode() {
    if (this.schemaDefinition?.getState) {
      return this.schemaDefinition.getState().isTextMode === true;
    }
    return this.schemaSession.getTextMode();
  }

  set isTextMode(isTextMode) {
    this.schemaDefinition?.setTextMode?.(isTextMode);
    this.schemaSession.setTextMode(isTextMode);
  }

  init() {
    if (!this.parentElement) {
      throw new Error('DataGeneratorPage requires a parentElement');
    }
    if (typeof this.TabulatorCtor !== 'function') {
      throw new Error('Tabulator library is not available');
    }

    this.generatorPage = createGeneratorPageComponent({
      root: this.parentElement,
      documentObj: this.documentObj,
      props: {
        controlsProps: {
          selectedFormat: this.getSelectedOutputType?.() || 'csv',
          currentOptions: undefined,
          pairwiseVisible: false,
        },
        previewProps: {
          outputPreviewText: '',
        },
        schemaDefinitionProps: {
          headingText: 'Schema',
          ids: {
            rows: 'generatorSchemaRows',
            textContainer: 'generatorSchemaTextContainer',
            text: 'generatorSchemaText',
            addButton: 'addSchemaRowButton',
            toggleButton: 'schemaModeToggleButton',
            helpIcon: 'schemaModeHelpIcon',
            error: 'generatorSchemaErrorText',
          },
          schemaTextToDataRules:
            this.schemaTextToDataRules || (() => ({ dataRules: [], errors: [], schemaTokens: [] })),
          dataRulesToSchemaText: this.dataRulesToSchemaText || (() => ''),
          faker: this.faker,
          RandExp: this.RandExp,
          createBlankRow: () =>
            typeof this.createBlankSchemaRow === 'function'
              ? this.createBlankSchemaRow()
              : {
                  id: 'generator-schema-row-fallback',
                  name: '',
                  sourceType: 'regex',
                  command: '',
                  params: '',
                  value: '',
                  comments: '',
                  leadingTextLines: [],
                },
          mapRuleToRow: (rule, leadingTextLines = []) => {
            const row =
              typeof this.ruleToSchemaRow === 'function'
                ? this.ruleToSchemaRow(rule)
                : {
                    id: 'generator-schema-row-fallback',
                    name: '',
                    sourceType: 'regex',
                    command: '',
                    params: '',
                    value: '',
                    comments: '',
                    leadingTextLines: [],
                  };
            row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
            return row;
          },
          getMethodPickerOptions: (currentValue) =>
            (typeof this.getMethodPickerOptions === 'function' ? this.getMethodPickerOptions(currentValue) : []) || [],
          getVisibleDomainCommands: (currentValue) =>
            (typeof this.getVisibleDomainCommands === 'function' ? this.getVisibleDomainCommands(currentValue) : []) ||
            [],
          fakerCommands: this.fakerCommands || [],
          sampleSchemaText: this.sampleSchemaText || '',
          buildModeHelpHtml: ({ inTextMode }) =>
            typeof this.buildSchemaModeHelpHtml === 'function' ? this.buildSchemaModeHelpHtml(inTextMode) : '',
          validateSchemaRows: (rows) =>
            typeof this.validateSchemaRows === 'function' ? this.validateSchemaRows(rows) : { rows, errors: [] },
          updatePairwiseButtonVisibility: () => this.updateAllPairsButtonVisibility?.(),
        },
      },
      services: {
        generatorControlsServices: {
          canExportFormat: (type) => this.exporter?.canExport?.(type) !== false,
        },
        generatorPreviewServices: {
          TabulatorCtor: this.TabulatorCtor,
          GridExtensionClass: this.GridExtensionClass,
        },
      },
      callbacks: {
        generatorControls: {
          onFormatChanged: () => {
            this.renderOptionsPanelForSelectedFormat();
            this.renderOutputPreviewForCurrentSelection();
          },
          onApplyOptions: ({ sanitized }) => {
            this.applyCurrentTypeOptions(sanitized);
          },
          onGenerateData: () => {
            void this.generateDataFile();
          },
          onGeneratePairwise: () => {
            void this.generateAllPairsDataFile();
          },
        },
        generatorPreview: {
          onPreview: () => this.previewData(),
        },
        schemaDefinition: {
          onSchemaError: (message) => this.showSchemaErrorStatus?.(message),
          onSchemaClear: () => this.clearSchemaErrorStatus?.(),
          onRowsChanged: () => this.updateAllPairsButtonVisibility?.(),
        },
      },
    });

    this.schemaErrorDisplay = this.generatorPage.getSchemaErrorDisplay();
    this.generatorControls = this.generatorPage.getGeneratorControls();
    this.generatorPreview = this.generatorPage.getGeneratorPreview();
    this.schemaDefinition = this.generatorPage.getSchemaDefinition();
    this.previewTableApi = this.generatorPreview?.getPreviewTableApi?.() || null;
    this.previewGrid = this.generatorPreview?.getPreviewGrid?.() || null;
    this.exporter = new this.ExporterClass(this.previewGrid);
    this.formatOptionsPanel = this.generatorControls?.getFormatOptionsPanel?.() || null;
    this.optionsPanels = this.formatOptionsPanel?.getPanels?.() || {};

    this.renderSchemaRows();
    this.updateSchemaEditModeView?.();
    this.renderOptionsPanelForSelectedFormat();
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
      validation: createSchemaRowValidation(),
    };
  }

  getVisibleDomainCommands(currentCommand = '') {
    return getVisibleDomainCommands({
      commands: this.domainCommands,
      currentCommand: normaliseDomainCommand(currentCommand),
    });
  }

  getMethodPickerOptions(currentValue = '') {
    return [
      {
        sourceType: 'enum',
        command: 'enum',
        helpModel: this.getSchemaHelpData('enum', 'enum'),
      },
      {
        sourceType: 'literal',
        command: 'literal',
        helpModel: this.getSchemaHelpData('literal', 'literal'),
      },
      {
        sourceType: 'regex',
        command: 'regex',
        helpModel: this.getSchemaHelpData('regex', 'regex'),
      },
      ...this.getVisibleDomainCommands(currentValue).map((command) => ({
        sourceType: 'domain',
        command,
        helpModel: this.getSchemaHelpData('domain', command),
      })),
      ...this.fakerCommands.map((command) => ({
        sourceType: 'faker',
        command,
        helpModel: this.getSchemaHelpData('faker', command),
      })),
    ];
  }

  populateFormatOptions() {
    this.generatorControls?.update({
      selectedFormat: this.getSelectedOutputType() || 'csv',
      currentOptions: this.exporter?.getOptionsForType?.(this.getSelectedOutputType() || 'csv'),
    });
  }

  validateSchemaRows(schemaRows = this.schemaRows) {
    return validateSchemaRows(schemaRows);
  }

  getSelectedOutputType() {
    if (this.generatorControls?.getSelectedOutputType) {
      return this.generatorControls.getSelectedOutputType();
    }
    return this.documentObj.getElementById('generatorOutputFormat')?.value;
  }

  renderOptionsPanelForSelectedFormat() {
    const type = this.getSelectedOutputType();
    if (!this.generatorControls) {
      return;
    }
    this.generatorControls.update({
      selectedFormat: type,
      currentOptions: this.exporter?.getOptionsForType?.(type),
    });
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

    const sanitized = applySanitizedUiOptionsToTargets({
      requestedFormat: requestedType,
      rawOptions: options?.options || options,
      targets: [this.exporter],
    });

    const outputSelect = this.documentObj.getElementById('generatorOutputFormat');
    const resolvedType = sanitized?.outputFormat || requestedType;
    if (outputSelect && outputSelect.value !== resolvedType) {
      outputSelect.value = resolvedType;
      this.renderOptionsPanelForSelectedFormat();
    }

    const type = this.getSelectedOutputType() || resolvedType;
    this.renderOutputPreviewForCurrentSelection();
    this.setGenerationStatus(`${type.toUpperCase()} options applied.`);
    this.scheduleClearGenerationStatus();
  }

  setGenerationButtonBusy(isBusy) {
    this.generatorControls?.setGenerationButtonsBusy?.(isBusy);
  }

  setGenerationStatus(message, options = {}) {
    this.generatorControls?.setStatus?.(message, options);
  }

  showGenerationLoadingStatus(message) {
    this.generatorControls?.showLoadingStatus?.(message);
  }

  clearGenerationStatus() {
    this.generatorControls?.clearStatus?.();
  }

  scheduleClearGenerationStatus(delay = 1200) {
    this.generatorControls?.scheduleClearStatus?.(delay);
  }

  surfacePageError(message, { useSchemaStatus = false } = {}) {
    const text = String(message || '').trim();
    if (!text) {
      return;
    }
    if (useSchemaStatus) {
      this.showSchemaErrorStatus(text);
    } else {
      this.setGenerationStatus(text, { severity: 'error', dismissable: true });
      this.scheduleClearGenerationStatus(5000);
    }
  }

  toggleSchemaEditMode() {
    const toggleResult = this.schemaDefinition?.toggleMode?.();
    if (toggleResult?.errors?.length > 0) {
      this.showSchemaErrorStatus(schemaErrorsToText(toggleResult.errors));
    }
  }

  showSchemaErrorStatus(message) {
    this.schemaErrorDisplay?.show(message);
  }

  clearSchemaErrorStatus() {
    this.schemaErrorDisplay?.clear();
  }

  revalidateSchemaRows() {
    if (this.schemaDefinition?.validateRows) {
      return this.schemaDefinition.validateRows() || { rows: this.schemaRows, errors: [] };
    }
    if (this.schemaRows.length === 0) {
      return { rows: [], errors: [] };
    }
    return validateSchemaRows(this.schemaRows);
  }

  destroy() {
    this.generatorPage?.destroy?.();
    this.rowCountControls.forEach((control) => control?.destroy?.());
    this.rowCountControls = [];
  }

  updateSchemaEditModeView() {
    this.schemaDefinition?.render?.();
  }

  invalidateSchemaTokensFromRows() {
    this.schemaSession.invalidateTokensFromRows();
  }

  handleGlobalButtonClick(_event) {
    return undefined;
  }

  insertExampleSchema() {
    this.schemaDefinition?.insertSampleSchema?.();
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

  syncSchemaRowsFromTextMode({ showErrors = false, applySemanticValidation = true } = {}) {
    const state = this.schemaDefinition?.getState?.();
    const isTextMode = state?.isTextMode === true;

    if (isTextMode) {
      const parsed = this.schemaDefinition?.syncFromText?.({ showErrors, force: true }) || { rows: [], errors: [] };
      if (parsed.errors.length > 0) {
        if (showErrors) {
          this.surfacePageError(schemaErrorsToText(parsed.errors), { useSchemaStatus: true });
        }
        return parsed;
      }
    }

    const validation = applySemanticValidation ? this.revalidateSchemaRows() : { rows: this.schemaRows, errors: [] };
    return { rows: this.schemaRows, errors: validation.errors || [], tokens: this.schemaTextTokens };
  }

  ruleToSchemaRow(rule) {
    return mapDataRuleToSchemaRow(rule, {
      createBlankSchemaRow: () => this.createBlankSchemaRow(),
    });
  }

  renderSchemaRows() {
    this.schemaDefinition?.render?.();
    this.updateAllPairsButtonVisibility();
  }

  renderSchemaRowsWithoutPairwiseUpdate() {
    this.schemaDefinition?.render?.();
  }

  handleRowInputChange(event) {
    return this.schemaDefinition?.handleInput?.(event);
  }

  handleRowFocusOut(event) {
    return this.schemaDefinition?.handleFocusOut?.(event);
  }

  applySemanticValidationForRow(rowId) {
    return this.schemaDefinition?.applySemanticValidationForRow?.(rowId);
  }

  async handleRowButtonClick(event) {
    return this.schemaDefinition?.handleClick?.(event);
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
    this.schemaDefinition?.addRowAfter?.(index);
  }

  removeRow(index) {
    this.schemaDefinition?.removeRowAt?.(index);
  }

  moveRow(index, direction) {
    this.schemaDefinition?.moveRowAt?.(index, direction);
  }

  moveRowToIndex(fromIndex, toIndex) {
    const rows = this.schemaRows.slice();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= rows.length || toIndex >= rows.length) {
      return;
    }
    const [moved] = rows.splice(fromIndex, 1);
    rows.splice(toIndex, 0, moved);
    this.schemaDefinition?.setRows?.(rows);
    this.schemaDefinition?.render?.();
    this.schemaDefinition?.syncTextFromRows?.();
  }

  handleRowDragStart(event) {
    return this.schemaDefinition?.handleDragStart?.(event);
  }

  handleRowDragOver(event) {
    return this.schemaDefinition?.handleDragOver?.(event);
  }

  handleRowDrop(event) {
    return this.schemaDefinition?.handleDrop?.(event);
  }

  handleRowDragEnd() {
    return this.schemaDefinition?.handleDragEnd?.();
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
      setOutputPreviewText: (text) => this.generatorPreview?.setOutputPreviewText?.(text),
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
      setGenerationStatus: (message) => this.setGenerationStatus(message),
      showGenerationLoadingStatus: (message) => this.showGenerationLoadingStatus(message),
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
      setGenerationStatus: (message) => this.setGenerationStatus(message),
      showGenerationLoadingStatus: (message) => this.showGenerationLoadingStatus(message),
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
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      documentObj: this.documentObj,
      getCurrentSchemaState: () => ({
        rows: this.schemaRows,
        errors: [],
      }),
      validateSchemaRows,
    });
    this.generatorControls?.update?.({ pairwiseVisible: isVisible === true });
  }

  getSchemaHelpData(sourceType, commandValue) {
    return buildSchemaHelpModel(sourceType, commandValue);
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
