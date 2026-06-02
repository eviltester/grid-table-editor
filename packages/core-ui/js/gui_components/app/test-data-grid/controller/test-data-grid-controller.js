/*
 * Responsibilities:
 * - Exposes the app-page entrypoint for the embedded test-data generation panel.
 * - Creates per-instance controller state instead of relying on singleton module variables.
 * - Composes the focused helpers for panel HTML, schema-grid sync, generation, and UI bindings.
 */

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Debouncer } from '@anywaydata/core/utils/debouncer.js';
import {
  TEST_DATA_MODES,
  createAmendedTable,
  createTableFromGenerator,
  normaliseCount,
  createTestDataGenerationService,
} from '../generation/index.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { FAKER_COMMANDS, identifyFakerCommands, getMethodPickerOptions } from '../schema/index.js';
import {
  setTestDataStatus,
  setTestDataLoadingStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
} from '../ui/test-data-ui-status.js';
import { createSchemaTextSyncState, showSchemaError, initializeSchemaErrorDisplay } from '../schema/index.js';
import {
  mapDataRuleToSchemaRow,
  validateSchemaRows as validateSharedSchemaRows,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensShared,
} from '../../../shared/test-data/schema/index.js';
import { buildDataRuleFromSchemaRow } from '../../../shared/schema-row-rule-mapper.js';
import { getGenerationMode as getGenerationModeFromUi } from '../controller/test-data-grid-generation-mode.js';
import { createAppSchemaDefinitionProps } from '../schema/test-data-grid-schema-grid-controller.js';
import { createTestDataGridActionAdapter } from '../controller/test-data-grid-action-adapter.js';
import { createDataPopulationPanelComponent } from '../../data-population-panel/index.js';
import { resolveDocumentObj } from '../../../shared/dom/default-objects.js';

import { faker } from 'https://cdn.skypack.dev/@faker-js/faker@v9.7.0';

function createTestDataGridControl({
  documentObj,
  DebouncerClass = Debouncer,
  schemaTextToDataRulesFn = schemaTextToDataRules,
  dataRulesToSchemaTextFn = dataRulesToSchemaText,
  createTestDataGenerationServiceFn = createTestDataGenerationService,
  initializeSchemaErrorDisplayFn = initializeSchemaErrorDisplay,
  showSchemaErrorFn = showSchemaError,
  setTestDataStatusFn = setTestDataStatus,
  setTestDataLoadingStatusFn = setTestDataLoadingStatus,
  clearPendingStatusResetFn = clearPendingTestDataStatusReset,
  scheduleStatusResetFn = scheduleTestDataStatusReset,
  yieldToUiFn = yieldToUi,
  identifyFakerCommandsFn = identifyFakerCommands,
  createTestDataGridActionAdapterFn = createTestDataGridActionAdapter,
  createDataPopulationPanelComponentFn = createDataPopulationPanelComponent,
} = {}) {
  const state = {
    debouncer: new DebouncerClass(),
    importer: undefined,
    textPreviewRenderer: undefined,
    mainGridExtras: undefined,
    schemaTextSyncState: createSchemaTextSyncState(),
    generationService: null,
    dataPopulationPanel: null,
    actionAdapter: null,
  };

  function showTestDataSchemaError(message) {
    showSchemaErrorFn(state.schemaTextSyncState, message);
  }

  function getResolvedDocument() {
    return resolveDocumentObj(documentObj, null);
  }

  function getMainGridExtras() {
    return state.mainGridExtras || state.importer?.gridExtensions;
  }

  function getGenerationMode() {
    return (
      state.dataPopulationPanel?.getMode?.() ||
      getGenerationModeFromUi({
        documentObj: getResolvedDocument(),
        defaultMode: TEST_DATA_MODES.NEW_TABLE,
      })
    );
  }

  function applyModeDefaultRowCount(mode) {
    const gridExtras = getMainGridExtras();
    if (mode === TEST_DATA_MODES.AMEND_TABLE) {
      state.dataPopulationPanel?.setRowCountValue?.(gridExtras?.getRowCount?.() || 0);
      return;
    }
    if (mode === TEST_DATA_MODES.AMEND_SELECTED) {
      state.dataPopulationPanel?.setRowCountValue?.(gridExtras?.getSelectedRowIndexes?.()?.length || 0);
    }
  }

  function updatePairwiseButtonVisibility() {
    state.generationService?.updatePairwiseButtonVisibility?.();
  }

  function createGenerationService() {
    return createTestDataGenerationServiceFn({
      schemaTextToDataRules: schemaTextToDataRulesFn,
      schemaRowsToSpec: (schemaRows) =>
        schemaRowsToSpecWithTokensShared({
          schemaRows,
          schemaTokens: [],
          buildDataRuleFromSchemaRow,
          dataRulesToSchemaText: dataRulesToSchemaTextFn,
        }),
      TestDataGeneratorClass: TestDataGenerator,
      PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
      GenericDataTableClass: GenericDataTable,
      TEST_DATA_MODES,
      normaliseCount,
      createTableFromGenerator,
      createAmendedTable,
      faker,
      RandExp,
      debouncer: state.debouncer,
      syncSchemaTextFromGridBeforeGenerate: () => state.dataPopulationPanel?.syncSchemaTextFromRows?.(),
      setTestDataStatus: setTestDataStatusFn,
      setTestDataLoadingStatus: setTestDataLoadingStatusFn,
      showSchemaError: showTestDataSchemaError,
      yieldToUi: yieldToUiFn,
      validateCurrentSchemaRows: (options) => state.dataPopulationPanel?.validateSchemaRows?.(options),
      getImporter: () => state.importer,
      getTextPreviewRenderer: () => state.textPreviewRenderer,
      getMainGridExtras,
      getGenerationMode,
      getRequestedRowCount: () => state.dataPopulationPanel?.getRowCountInputValue?.(),
      setGenerateBusy: (isBusy) => state.dataPopulationPanel?.setGenerateBusy?.(isBusy),
      setGeneratePairwiseBusy: (isBusy) => state.dataPopulationPanel?.setGeneratePairwiseBusy?.(isBusy),
      setRefreshPreviewBusy: (isBusy) => state.dataPopulationPanel?.setRefreshPreviewBusy?.(isBusy),
      setPairwiseVisible: (isVisible) => state.dataPopulationPanel?.setPairwiseVisible?.(isVisible),
    });
  }

  function mountTestDataGenerationPanel(parentId, importer, textPreviewRenderer, gridExtras) {
    state.dataPopulationPanel?.destroy?.();
    state.debouncer?.clear?.();
    identifyFakerCommandsFn(faker);

    state.importer = importer;
    state.textPreviewRenderer = textPreviewRenderer;
    state.mainGridExtras = gridExtras;
    state.generationService = createGenerationService();
    state.actionAdapter = createTestDataGridActionAdapterFn({
      getGenerationService: () => state.generationService,
      clearPendingStatusReset: clearPendingStatusResetFn,
      scheduleStatusReset: scheduleStatusResetFn,
    });

    const resolvedDocument = getResolvedDocument();
    const parentElem = resolvedDocument?.getElementById?.(parentId) || null;
    initializeSchemaErrorDisplayFn(state.schemaTextSyncState);

    if (!resolvedDocument || !parentElem) {
      state.dataPopulationPanel = null;
      return state;
    }

    state.dataPopulationPanel = createDataPopulationPanelComponentFn({
      root: parentElem,
      documentObj: resolvedDocument,
      props: {
        selectedMode: TEST_DATA_MODES.NEW_TABLE,
        pairwiseVisible: false,
        modeOptions: [
          { value: TEST_DATA_MODES.NEW_TABLE, label: 'New Table' },
          { value: TEST_DATA_MODES.AMEND_TABLE, label: 'Amend Table' },
          { value: TEST_DATA_MODES.AMEND_SELECTED, label: 'Amend Selected' },
        ],
        rowCountProps: {
          inputId: 'generateCount',
          label: 'How Many?',
          min: 1,
          step: 1,
          value: 1,
          normalizeOnInput: true,
        },
        schemaDefinitionProps: createAppSchemaDefinitionProps({
          schemaTextToDataRules: schemaTextToDataRulesFn,
          dataRulesToSchemaText: dataRulesToSchemaTextFn,
          schemaTextSyncState: state.schemaTextSyncState,
          updatePairwiseButtonVisibility,
          faker,
          RandExp,
          getMethodPickerOptions,
          fakerCommands: FAKER_COMMANDS.filter((command) => command !== 'RegEx' && command.startsWith('helpers.')),
          validateSchemaRows: (schemaRows) =>
            validateSharedSchemaRows({
              schemaRows,
              schemaRowsToDataRules,
            }),
          getVisibleDomainCommandOptions: (currentValue) => {
            const options = getMethodPickerOptions(currentValue).filter((option) => option.sourceType === 'domain');
            return options.map((option) => ({ value: option.command, label: option.command }));
          },
          mapRuleToRow: mapDataRuleToSchemaRow,
        }),
      },
      callbacks: {
        onGenerate: () => state.actionAdapter.generateTestData(),
        onGeneratePairwise: () => state.actionAdapter.generatePairwiseTestData(),
        onRefreshPreview: () => state.actionAdapter.refreshTestDataPreview(),
        onModeChange: applyModeDefaultRowCount,
        schemaDefinition: {
          onSchemaError: (message) => state.schemaTextSyncState?.schemaErrorDisplay?.show?.(message),
          onSchemaClear: () => state.schemaTextSyncState?.schemaErrorDisplay?.clear?.(),
          onSchemaParseError: () => setTestDataStatusFn('', false),
        },
      },
    });

    return state;
  }

  return {
    mountTestDataGenerationPanel,
    // Legacy public alias retained for downstream callers that still use the pre-component entrypoint name.
    enableTestDataGenerationInterface: mountTestDataGenerationPanel,
    getState: () => state,
    destroy: () => {
      state.dataPopulationPanel?.destroy?.();
      state.debouncer?.clear?.();
    },
  };
}

const defaultTestDataGridControl = createTestDataGridControl();

function mountTestDataGenerationPanel(parentId, importer, textPreviewRenderer, gridExtras) {
  return defaultTestDataGridControl.mountTestDataGenerationPanel(parentId, importer, textPreviewRenderer, gridExtras);
}

// Legacy public alias retained for downstream callers that still use the pre-component entrypoint name.
const enableTestDataGenerationInterface = mountTestDataGenerationPanel;

export { createTestDataGridControl, mountTestDataGenerationPanel, enableTestDataGenerationInterface };
