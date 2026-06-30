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
} from '../generation/test-data-amend.js';
import { createTestDataGenerationService } from '../generation/test-data-generation-service.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { CombinationsTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { identifyFakerCommands, getMethodPickerOptions, FAKER_COMMANDS } from '../schema/test-data-command-catalog.js';
import {
  createSchemaTextSyncState,
  showSchemaError,
  initializeSchemaErrorDisplay,
} from '../schema/test-data-grid-schema-text-sync.js';
import {
  createTestDataUiStatusService,
  setTestDataStatus,
  setTestDataLoadingStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
} from '../ui/test-data-ui-status.js';
import {
  validateSchemaRows as validateSharedSchemaRows,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensShared,
} from '../../../shared/test-data/schema/schema-editor-core.js';
import { mapDataRuleToSchemaRow } from '../../../shared/test-data/schema/schema-row-mapper.js';
import { buildDataRuleFromSchemaRow } from '../../../shared/schema-row-rule-mapper.js';
import { createAppSchemaDefinitionProps } from '../schema/test-data-grid-schema-grid-controller.js';
import { createTestDataGridActionAdapter } from '../controller/test-data-grid-action-adapter.js';
import { createDataPopulationPanelComponent } from '../../data-population-panel/index.js';
import { resolveDocumentObj } from '../../../shared/dom/default-objects.js';
import { createCombinationsDialogComponent } from '../../../shared/combinations-dialog/index.js';
import { createConfirmDialogService } from '../../../shared/dialog-services/confirm-dialog-service.js';
import { createTextInputDialogService } from '../../../shared/dialog-services/text-input-dialog-service.js';
import { DEFAULT_ENUM_LIMIT, createEnumSchemaRowsFromGrid, normaliseEnumLimit } from '../schema/grid-to-enum-schema.js';

import { faker } from '@faker-js/faker';

function createTestDataGenerationPanelManager({
  documentObj,
  RandExpClass,
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
  createTestDataUiStatusServiceFn = createTestDataUiStatusService,
  createCombinationsDialogComponentFn = createCombinationsDialogComponent,
  createConfirmDialogServiceFn = createConfirmDialogService,
  createTextInputDialogServiceFn = createTextInputDialogService,
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
    uiStatusService: null,
    combinationsDialog: null,
    textInputDialogService: null,
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
    return state.dataPopulationPanel?.getMode?.() || TEST_DATA_MODES.NEW_TABLE;
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

  function getRandExpClass() {
    return RandExpClass || globalThis.RandExp;
  }

  function getStatusServiceApi() {
    if (state.uiStatusService) {
      return {
        setTestDataStatus: (...args) => state.uiStatusService?.setTestDataStatus?.(...args),
        setTestDataLoadingStatus: (...args) => state.uiStatusService?.setTestDataLoadingStatus?.(...args),
        clearPendingStatusReset: () => state.uiStatusService?.clearPendingTestDataStatusReset?.(),
        scheduleStatusReset: (delayMs) => state.uiStatusService?.scheduleTestDataStatusReset?.(delayMs),
      };
    }
    return {
      setTestDataStatus: setTestDataStatusFn,
      setTestDataLoadingStatus: setTestDataLoadingStatusFn,
      clearPendingStatusReset: clearPendingStatusResetFn,
      scheduleStatusReset: scheduleStatusResetFn,
    };
  }

  function shouldUseScopedStatusService() {
    const hasCustomStatusOverrides =
      setTestDataStatusFn !== setTestDataStatus ||
      setTestDataLoadingStatusFn !== setTestDataLoadingStatus ||
      clearPendingStatusResetFn !== clearPendingTestDataStatusReset ||
      scheduleStatusResetFn !== scheduleTestDataStatusReset;
    const hasCustomStatusServiceFactory = createTestDataUiStatusServiceFn !== createTestDataUiStatusService;
    return !hasCustomStatusOverrides || hasCustomStatusServiceFactory;
  }

  function createGenerationService() {
    const resolvedRandExpClass = getRandExpClass();
    const statusServiceApi = getStatusServiceApi();
    const confirmDialogService = createConfirmDialogServiceFn({ documentObj: getResolvedDocument() });
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
      CombinationsTestDataGeneratorClass: CombinationsTestDataGenerator,
      GenericDataTableClass: GenericDataTable,
      TEST_DATA_MODES,
      normaliseCount,
      createTableFromGenerator,
      createAmendedTable,
      faker,
      RandExp: resolvedRandExpClass,
      debouncer: state.debouncer,
      syncSchemaTextFromGridBeforeGenerate: () => state.dataPopulationPanel?.syncSchemaTextFromRows?.(),
      getSchemaText: () => state.dataPopulationPanel?.getSchemaText?.() || '',
      setTestDataStatus: statusServiceApi.setTestDataStatus,
      setTestDataLoadingStatus: statusServiceApi.setTestDataLoadingStatus,
      showSchemaError: showTestDataSchemaError,
      yieldToUi: yieldToUiFn,
      validateCurrentSchemaRows: (options) => state.dataPopulationPanel?.validateSchemaRows?.(options),
      getImporter: () => state.importer,
      getTextPreviewRenderer: () => state.textPreviewRenderer,
      getMainGridExtras,
      getGenerationMode,
      getRequestedRowCount: () => state.dataPopulationPanel?.getRowCountInputValue?.(),
      getUnsafeFakerExpressions: () => state.dataPopulationPanel?.getUnsafeFakerExpressions?.() ?? true,
      setGenerateBusy: (isBusy) => state.dataPopulationPanel?.setGenerateBusy?.(isBusy),
      setGeneratePairwiseBusy: (isBusy) => state.dataPopulationPanel?.setGeneratePairwiseBusy?.(isBusy),
      setPairwiseVisible: (isVisible) => state.dataPopulationPanel?.setPairwiseVisible?.(isVisible),
      requestConfirm: confirmDialogService.requestConfirm,
      recordLastUsedSchema: () => state.dataPopulationPanel?.recordCurrentSchemaAsLastUsed?.(),
    });
  }

  function ensureTextInputDialogService() {
    if (!state.textInputDialogService) {
      state.textInputDialogService = createTextInputDialogServiceFn({ documentObj: getResolvedDocument() });
    }
    return state.textInputDialogService;
  }

  async function generateEnumSchemaFromGrid() {
    const statusServiceApi = getStatusServiceApi();
    const gridExtras = getMainGridExtras();
    const schemaDefinition = state.dataPopulationPanel?.getSchemaDefinition?.();
    const createBlankRow = state.dataPopulationPanel?.getState?.()?.schemaDefinitionProps?.createBlankRow;

    if (!gridExtras?.getGridAsGenericDataTable || !schemaDefinition || typeof createBlankRow !== 'function') {
      showTestDataSchemaError('Grid to schema is not available.');
      statusServiceApi.setTestDataStatus('Unable to build schema from the grid.', {
        severity: 'error',
        dismissable: true,
      });
      return false;
    }

    try {
      state.dataPopulationPanel?.setGenerateSchemaBusy?.(true);
      statusServiceApi.setTestDataLoadingStatus('Scanning grid for enum schema...');
      const dataTable = await Promise.resolve(gridExtras.getGridAsGenericDataTable());
      const initialSummary = createEnumSchemaRowsFromGrid({
        dataTable,
        maxEnumValues: DEFAULT_ENUM_LIMIT,
      });

      if (initialSummary.usableColumns.length === 0) {
        showTestDataSchemaError('No non-empty column values were found to build enum schema rows.');
        statusServiceApi.setTestDataStatus('No enum schema rows generated from the current grid.', {
          severity: 'warning',
          dismissable: true,
        });
        return false;
      }

      const suggestedLimit = Math.min(initialSummary.maxUniqueValueCount || DEFAULT_ENUM_LIMIT, DEFAULT_ENUM_LIMIT);
      const requestedLimit = await ensureTextInputDialogService().requestTextInput({
        title: 'Grid to Enum Schema',
        message: `- largest Column has ${initialSummary.maxUniqueValueCount} unique values`,
        label: 'Limit imported enum(s) to max size of',
        initialValue: String(suggestedLimit),
        okLabel: 'Build Schema',
        cancelLabel: 'Cancel',
        inputType: 'number',
        min: 1,
        step: 1,
      });
      if (requestedLimit === null) {
        statusServiceApi.setTestDataStatus('Grid to enum schema cancelled.', {
          severity: 'warning',
          dismissable: true,
        });
        return false;
      }

      const maxEnumValues = normaliseEnumLimit(requestedLimit);
      const summary = createEnumSchemaRowsFromGrid({
        dataTable,
        maxEnumValues,
        createBlankRow,
      });

      if (summary.truncatedColumnCount > 0) {
        const confirmDialogService = createConfirmDialogServiceFn({ documentObj: getResolvedDocument() });
        const shouldTruncate = await confirmDialogService.requestConfirm({
          title: 'Confirm enum truncation',
          message: `Enum limit ${maxEnumValues} is less than current values. Truncate to first ${maxEnumValues} values for affected columns?`,
          okLabel: 'Truncate Schema',
          cancelLabel: 'Cancel',
        });
        confirmDialogService.destroy();
        if (!shouldTruncate) {
          statusServiceApi.setTestDataStatus('Grid to enum schema cancelled.', {
            severity: 'warning',
            dismissable: true,
          });
          return false;
        }
      }

      const validation = state.dataPopulationPanel?.replaceSchemaRows?.(summary.rows) || { errors: [] };
      if (validation.errors?.length > 0) {
        statusServiceApi.setTestDataStatus('Schema replacement completed with validation warnings.', {
          severity: 'warning',
          dismissable: true,
        });
      } else {
        statusServiceApi.setTestDataStatus(
          `Created ${summary.rows.length} enum schema rows${summary.truncatedColumnCount > 0 ? ` with truncation in ${summary.truncatedColumnCount} column${summary.truncatedColumnCount === 1 ? '' : 's'}` : ''}.`,
          { dismissable: true }
        );
      }
      return true;
    } finally {
      state.dataPopulationPanel?.setGenerateSchemaBusy?.(false);
    }
  }

  function ensureCombinationsDialog(resolvedDocument) {
    if (state.combinationsDialog) {
      return state.combinationsDialog;
    }

    state.combinationsDialog = createCombinationsDialogComponentFn({
      documentObj: resolvedDocument,
      callbacks: {
        onSubmit: (selection) => {
          void state.generationService?.generateCombinationsTestData?.(selection);
        },
      },
    });

    return state.combinationsDialog;
  }

  function openGenerateCombinationsDialog() {
    const resolvedDocument = getResolvedDocument();
    const enumColumnCount = state.generationService?.countEnumColumns?.() || 0;
    const enumValueCounts = state.generationService?.getEnumValueCounts?.() || [];

    if (enumColumnCount < 2) {
      showTestDataSchemaError(
        'Combination generation requires at least 2 enum columns because n-wise generation combines finite enum values.'
      );
      getStatusServiceApi().setTestDataStatus('Insufficient enum columns.', {
        severity: 'warning',
        dismissable: true,
      });
      return false;
    }

    ensureCombinationsDialog(resolvedDocument).open({ enumColumnCount, enumValueCounts });
    return true;
  }

  function mountTestDataGenerationPanel(parentId, importer, textPreviewRenderer, gridExtras) {
    state.dataPopulationPanel?.destroy?.();
    state.uiStatusService?.destroy?.();
    state.combinationsDialog?.destroy?.();
    state.textInputDialogService?.destroy?.();
    state.combinationsDialog = null;
    state.textInputDialogService = null;
    state.debouncer?.clear?.();
    identifyFakerCommandsFn(faker);

    state.importer = importer;
    state.textPreviewRenderer = textPreviewRenderer;
    state.mainGridExtras = gridExtras;
    state.uiStatusService = null;

    const resolvedDocument = getResolvedDocument();
    const parentElem = resolvedDocument?.getElementById?.(parentId) || null;

    if (
      resolvedDocument &&
      parentElem &&
      typeof createTestDataUiStatusServiceFn === 'function' &&
      shouldUseScopedStatusService()
    ) {
      state.uiStatusService = createTestDataUiStatusServiceFn({
        documentObj: resolvedDocument,
        windowObj: resolvedDocument.defaultView,
        getStatusElement: () => parentElem.querySelector('[data-role="population-status"]'),
      });
    }

    state.generationService = createGenerationService();
    state.actionAdapter = createTestDataGridActionAdapterFn({
      getGenerationService: () => state.generationService,
    });

    if (!resolvedDocument || !parentElem) {
      state.dataPopulationPanel = null;
      return state;
    }

    const resolvedRandExpClass = getRandExpClass();

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
          RandExp: resolvedRandExpClass,
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
        storedSchemasEnabled: true,
        storedSchemasProps: {},
        unsafeFakerExpressions: true,
      },
      callbacks: {
        onGenerate: () => state.actionAdapter.generateTestData(),
        onGeneratePairwise: () => openGenerateCombinationsDialog(),
        onGenerateSchemaFromGrid: generateEnumSchemaFromGrid,
        onModeChange: applyModeDefaultRowCount,
        schemaDefinition: {
          onSchemaError: (message) => state.schemaTextSyncState?.schemaErrorDisplay?.show?.(message),
          onSchemaClear: () => state.schemaTextSyncState?.schemaErrorDisplay?.clear?.(),
          onSchemaParseError: () => getStatusServiceApi().setTestDataStatus('', false),
        },
        storedSchemas: {
          onStatus: (message, options = {}) => getStatusServiceApi().setTestDataStatus(message, options),
        },
      },
    });
    initializeSchemaErrorDisplayFn(state.schemaTextSyncState, {
      documentObj: resolvedDocument,
      getSchemaErrorElement: () => parentElem.querySelector('[data-role="schema-error"]'),
    });

    return state;
  }

  return {
    mountTestDataGenerationPanel,
    getState: () => state,
    destroy: () => {
      state.dataPopulationPanel?.destroy?.();
      state.uiStatusService?.destroy?.();
      state.combinationsDialog?.destroy?.();
      state.textInputDialogService?.destroy?.();
      state.combinationsDialog = null;
      state.textInputDialogService = null;
      state.debouncer?.clear?.();
    },
  };
}

const defaultTestDataGenerationPanelManager = createTestDataGenerationPanelManager();

function mountTestDataGenerationPanel(parentId, importer, textPreviewRenderer, gridExtras) {
  return defaultTestDataGenerationPanelManager.mountTestDataGenerationPanel(
    parentId,
    importer,
    textPreviewRenderer,
    gridExtras
  );
}

export { createTestDataGenerationPanelManager, mountTestDataGenerationPanel };
