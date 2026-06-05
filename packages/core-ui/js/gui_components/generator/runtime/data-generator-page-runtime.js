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
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT as GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
} from '../../shared/test-data/schema/index.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
  normaliseFakerCommand,
} from '../../shared/schema-row-rule-mapper.js';
import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';
import { buildGeneratorSchemaModeHelpHtml } from '../help/index.js';
import { createGeneratorSchemaDefinitionSupport, createGeneratorSchemaRowFactory } from '../schema-support/index.js';
import { createGeneratorPageComponent } from '../page/index.js';
import { getDefaultDocumentObj } from '../../shared/dom/default-objects.js';
import { createGeneratorPageComponentConfig } from './create-generator-page-component-config.js';
import { createGeneratorMountedPageBridge } from './generator-mounted-page-bridge.js';
import { createGeneratorSchemaRuntimeBridge } from './generator-schema-runtime-bridge.js';
import { createGeneratorSchemaStateBridge } from './generator-schema-state-bridge.js';
import { createGeneratorViewStateBridge } from './generator-view-state-bridge.js';
import { createGeneratorRuntimeActionsBridge } from './generator-runtime-actions-bridge.js';
import { createGeneratorSchemaGenerationBridge } from '../generation/index.js';

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

function createUnavailableRowCountResult(inputId) {
  return {
    value: 0,
    valid: false,
    errors: [`${inputId} must be a number greater than or equal to 0.`],
  };
}

class DataGeneratorPage {
  constructor({
    parentElement,
    documentObj = getDefaultDocumentObj(),
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

    this.fakerCommands = getKnownFakerCommandsAlphabetical().filter(
      (command) => command !== 'RegEx' && command.startsWith('helpers.')
    );
    this.domainCommands = getKnownDomainCommandsAlphabetical();
    const createBlankGeneratorSchemaRow = createGeneratorSchemaRowFactory();
    this.generatorSchemaDefinitionSupport = createGeneratorSchemaDefinitionSupport({
      createBlankRow: createBlankGeneratorSchemaRow,
      fakerCommands: this.fakerCommands,
      domainCommands: this.domainCommands,
      buildModeHelpHtml: ({ inTextMode }) =>
        buildGeneratorSchemaModeHelpHtml({
          inTextMode,
          generateToFileHelpUrl: GENERATE_TO_FILE_HELP_URL,
        }),
      validateSchemaRows,
    });
    this.schemaSession = createSchemaEditingSession({
      createBlankSchemaRow: this.generatorSchemaDefinitionSupport.createBlankRow,
      schemaTextToDataRules,
      faker: this.faker,
      RandExp: this.RandExp,
      mapRuleToRow: this.generatorSchemaDefinitionSupport.mapRuleToRow,
      schemaRowsToSpecWithTokens,
    });
    this.schemaErrorDisplay = undefined;
    this.schemaDefinition = undefined;
    this.generatorControls = undefined;
    this.generatorPreview = undefined;
    this.generatorPage = undefined;
    this.generatorViewState = createGeneratorViewStateBridge({
      getGeneratorControls: () => this.generatorControls,
      getGeneratorPreview: () => this.generatorPreview,
      getExporter: () => this.exporter,
      createUnavailableRowCountResult,
    });
    this.generatorSchemaRuntime = createGeneratorSchemaRuntimeBridge({
      getSchemaDefinition: () => this.schemaDefinition,
      getSchemaRows: () => this.schemaRows,
      getSchemaTextTokens: () => this.schemaTextTokens,
      validateSchemaRows,
      showSchemaErrorStatus: (message) => this.schemaErrorDisplay?.show(message),
      clearSchemaErrorStatus: () => this.schemaErrorDisplay?.clear(),
      setGenerationStatus: (message, options) => this.generatorViewState.setGenerationStatus(message, options),
      scheduleClearGenerationStatus: (delay) => this.generatorViewState.scheduleClearGenerationStatus(delay),
    });
    this.generatorSchemaGeneration = createGeneratorSchemaGenerationBridge({
      syncSchemaRowsFromTextMode: (options) => this.generatorSchemaRuntime?.syncSchemaRowsFromTextMode(options),
      validateSchemaRows,
      schemaRowsToSpec,
      TestDataGeneratorClass: this.TestDataGeneratorClass,
      faker: this.faker,
      RandExp: this.RandExp,
    });
    this.generatorSchemaState = createGeneratorSchemaStateBridge({
      getSchemaDefinition: () => this.schemaDefinition,
      getSchemaSession: () => this.schemaSession,
      updatePairwiseButtonVisibility: () => this.updateAllPairsButtonVisibility(),
    });
    this.generatorMountedPage = createGeneratorMountedPageBridge();
    this.generatorRuntimeActions = createGeneratorRuntimeActionsBridge({
      getCurrentSelectedType: () => this.generatorViewState.getSelectedOutputType(),
      getExporter: () => this.exporter,
      getDownloadClass: () => this.DownloadClass,
      getFaker: () => this.faker,
      getRandExp: () => this.RandExp,
      getViewState: () => this.generatorViewState,
      getSchemaRuntime: () => this.generatorSchemaRuntime,
      getSchemaGeneration: () => this.generatorSchemaGeneration,
    });
    this.schemaTextToDataRules = schemaTextToDataRules;
    this.dataRulesToSchemaText = dataRulesToSchemaText;
    this.sampleSchemaText = GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT;
  }

  get schemaRows() {
    return this.generatorSchemaState.getRows();
  }

  set schemaRows(rows) {
    this.generatorSchemaState.setRows(rows);
  }

  get schemaTextTokens() {
    return this.generatorSchemaState.getTokens();
  }

  set schemaTextTokens(tokens) {
    this.generatorSchemaState.setTokens(tokens);
  }

  get isTextMode() {
    return this.generatorSchemaState.getTextMode();
  }

  set isTextMode(isTextMode) {
    this.generatorSchemaState.setTextMode(isTextMode);
  }

  init() {
    if (!this.parentElement) {
      throw new Error('DataGeneratorPage requires a parentElement');
    }
    if (typeof this.TabulatorCtor !== 'function') {
      throw new Error('Tabulator library is not available');
    }

    const pageComponentConfig = createGeneratorPageComponentConfig({
      schemaTextToDataRules: this.schemaTextToDataRules,
      dataRulesToSchemaText: this.dataRulesToSchemaText,
      faker: this.faker,
      RandExp: this.RandExp,
      generatorSchemaDefinitionSupport: this.generatorSchemaDefinitionSupport,
      fakerCommands: this.fakerCommands,
      sampleSchemaText: this.sampleSchemaText,
      getExporter: () => this.exporter,
      TabulatorCtor: this.TabulatorCtor,
      GridExtensionClass: this.GridExtensionClass,
      onApplyOptions: (sanitized) => this.applyCurrentTypeOptions(sanitized),
      onGenerateData: () => {
        void this.generateDataFile();
      },
      onGeneratePairwise: () => {
        void this.generateAllPairsDataFile();
      },
      onPreview: () => this.previewData(),
      onRenderOutputPreview: () => this.generatorViewState.renderOutputPreviewForCurrentSelection(),
      onSchemaError: (message) => this.generatorSchemaRuntime?.showSchemaErrorStatus(message),
      onSchemaClear: () => this.generatorSchemaRuntime?.clearSchemaErrorStatus(),
      onRowsChanged: () => this.updateAllPairsButtonVisibility?.(),
    });

    this.generatorPage = createGeneratorPageComponent({
      root: this.parentElement,
      documentObj: this.documentObj,
      ...pageComponentConfig,
    });

    Object.assign(
      this,
      this.generatorMountedPage.connectMountedPage({
        generatorPage: this.generatorPage,
        ExporterClass: this.ExporterClass,
        getPreviewGrid: () => this.generatorViewState.getPreviewGrid(),
      })
    );

    this.generatorMountedPage.initializeMountedPage({
      renderSchemaRows: () => this.renderSchemaRows(),
      syncInitialFormatState: () => this.generatorViewState.syncGeneratorControlsFormatState('csv'),
    });
  }

  getSelectedOutputType() {
    return this.generatorViewState.getSelectedOutputType();
  }

  syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat = this.getSelectedOutputType()) {
    return this.generatorViewState.syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat);
  }

  applyCurrentTypeOptions(options) {
    return this.generatorRuntimeActions.applyCurrentTypeOptions(options);
  }

  destroy() {
    this.generatorPage?.destroy?.();
  }

  renderSchemaRows() {
    this.generatorSchemaState.renderSchemaRows();
  }

  getPreviewRowCount() {
    return this.generatorViewState.getPreviewRowCount();
  }

  getGenerateRowCount() {
    return this.generatorViewState.getGenerateRowCount();
  }

  previewData() {
    return this.generatorRuntimeActions.previewData();
  }

  async generateDataFile() {
    await this.generatorRuntimeActions.generateDataFile();
  }

  async generateAllPairsDataFile() {
    await this.generatorRuntimeActions.generateAllPairsDataFile();
  }

  updateAllPairsButtonVisibility() {
    return this.generatorRuntimeActions.updateAllPairsButtonVisibility({
      getCurrentSchemaState: () => ({
        rows: this.schemaRows,
        errors: [],
      }),
    });
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
