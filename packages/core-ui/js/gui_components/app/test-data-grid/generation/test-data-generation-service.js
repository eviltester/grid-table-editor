/*
 * Responsibilities:
 * - Thin embedded-app shell for grid generation/amend workflows.
 * - Delegates shared execution to the session-backed UI generation engine.
 * - Keeps grid contract checks, preview sync, and user-facing status updates local to the app surface.
 */

import { schemaErrorsToText } from '../../../shared/test-data/schema/schema-error-text.js';
import { createConfiguredGeneratorFromSchemaRows } from '../../../shared/test-data/generation/generation-controller.js';
import { isNWiseEligibleForSchemaRows } from '../../../shared/test-data/generation/ui-derived-state.js';
import {
  buildConstraintImpactMessage,
  createUiGenerationSessionService,
} from '../../../shared/test-data/generation/ui-generation-session-service.js';
import {
  presentUiGenerationNotice,
  presentUiGenerationResult,
} from '../../../shared/test-data/generation/ui-generation-status-presenter.js';
import { createGenerationSession } from '@anywaydata/core';
import { confirmCartesianProductSelection } from '../../../generator/generation/n-wise-generation-options.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_REGEX,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
} from '../../../shared/schema-row-rule-mapper.js';

const MAX_CONSTRAINT_RETRY_BATCHES = 10;

function createTestDataGenerationService({
  schemaTextToDataRules,
  TestDataGeneratorClass,
  PairwiseTestDataGeneratorClass: _PairwiseTestDataGeneratorClass,
  CombinationsTestDataGeneratorClass,
  GenericDataTableClass,
  TEST_DATA_MODES,
  normaliseCount,
  createAmendedTable: _createAmendedTable,
  schemaRowsToSpec,
  faker,
  RandExp,
  debouncer,
  syncSchemaTextFromGridBeforeGenerate,
  getSchemaText = () => '',
  setTestDataStatus,
  setTestDataLoadingStatus,
  showSchemaError,
  yieldToUi,
  validateCurrentSchemaRows,
  getImporter,
  getTextPreviewRenderer,
  getMainGridExtras,
  getGenerationMode,
  getRequestedRowCount = () => null,
  setGenerateBusy = () => {},
  setGeneratePairwiseBusy = () => {},
  setPairwiseVisible = () => {},
  requestConfirm,
  createGenerationSessionFn = createGenerationSession,
}) {
  function getCurrentSchemaRowValidation(options) {
    return validateCurrentSchemaRows?.(options) || { errors: [], rows: [] };
  }

  function createConfiguredGenerator(validationOptions) {
    const rowValidation = getCurrentSchemaRowValidation(validationOptions);
    if (rowValidation.errors.length > 0) {
      return { generator: null, errors: rowValidation.errors, rows: rowValidation.rows || [] };
    }

    return createConfiguredGeneratorFromSchemaRows({
      schemaRows: rowValidation.rows || [],
      validateSchemaRows: () => rowValidation,
      schemaRowsToSpec,
      schemaText: getSchemaText(),
      schemaTextToDataRules,
      TestDataGeneratorClass,
      faker,
      RandExp,
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

  const generationEngine = createUiGenerationSessionService({
    getValidatedSchemaState: getCurrentSchemaRowValidation,
    getSchemaText,
    schemaRowsToSpec,
    schemaSource: 'app-test-data-grid',
    GenericDataTableClass,
    CombinationsTestDataGeneratorClass,
    createConfiguredGenerator,
    createGenerationSessionFn,
    faker,
    RandExp,
  });

  function getRulesParserFromTextArea(rowValidation = getCurrentSchemaRowValidation({ syncFromText: false })) {
    if (rowValidation.errors.length > 0) {
      return { generator: null, errors: rowValidation.errors };
    }
    const parseResult = createConfiguredGenerator({ schemaState: rowValidation });
    return { generator: parseResult.generator, errors: parseResult.errors };
  }

  function showPairwiseButton() {
    setPairwiseVisible(true);
  }

  function hidePairwiseButton() {
    setPairwiseVisible(false);
  }

  function shouldSyncTextPreviewFromGrid() {
    const textPreviewRenderer = getTextPreviewRenderer?.();
    const previewState = textPreviewRenderer?.getState?.();
    if (!previewState) {
      return false;
    }

    if (previewState.mode === 'edit') {
      return true;
    }

    return previewState.mode === 'preview' && previewState.autoPreviewEnabled === true;
  }

  async function syncTextPreviewFromGrid() {
    if (!shouldSyncTextPreviewFromGrid()) {
      return false;
    }

    const textPreviewRenderer = getTextPreviewRenderer?.();
    if (!textPreviewRenderer?.renderTextFromGrid) {
      return false;
    }

    await Promise.resolve(textPreviewRenderer.renderTextFromGrid());
    return true;
  }

  function updatePairwiseButtonVisibility() {
    const rowValidation = getCurrentSchemaRowValidation({ syncFromText: false });
    if (rowValidation.errors.length > 0) {
      hidePairwiseButton();
      return;
    }
    if (isNWiseEligibleForSchemaRows(rowValidation.rows || [])) {
      showPairwiseButton();
    } else {
      hidePairwiseButton();
    }
  }

  async function requestConstraintImpactDecision({ generatedRows = 0, failedRows = 0 } = {}) {
    if (typeof requestConfirm !== 'function') {
      return false;
    }

    return Boolean(
      await requestConfirm({
        title: 'Schema Constraints are impacting row generation',
        message: buildConstraintImpactMessage({ generatedRows, failedRows }),
        okLabel: 'Continue',
        cancelLabel: 'Abort',
      })
    );
  }

  function countEnumColumns() {
    return generationEngine.countEnumColumns({ syncFromText: false });
  }

  function getEnumValueCounts() {
    return generationEngine.getEnumValueCounts({ syncFromText: false });
  }

  function surfaceEnginePresentation(presentation) {
    if (presentation?.schemaMessage) {
      showSchemaError(presentation.schemaMessage);
    }
    if (presentation?.statusMessage) {
      setTestDataStatus(presentation.statusMessage, presentation.statusOptions || { dismissable: true });
    }
  }

  async function applyGeneratedTableAndStatus({
    dataTable,
    loadingMessage = 'Applying data to grid...',
    presentationOptions,
  }) {
    setTestDataLoadingStatus(loadingMessage);
    await yieldToUi();
    await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
    const previewUpdated = await syncTextPreviewFromGrid();
    const presentation = presentUiGenerationResult({
      surface: 'app',
      previewUpdated,
      ...presentationOptions,
    });
    if (presentation.schemaMessage) {
      showSchemaError(presentation.schemaMessage);
    }
    setTestDataStatus(presentation.statusMessage, presentation.statusOptions || { dismissable: true });
  }

  async function generatePairwiseTestData() {
    debouncer.clear('populateTestDataGrid');
    syncSchemaTextFromGridBeforeGenerate();
    setTestDataLoadingStatus('Generating pairwise...');
    setGeneratePairwiseBusy(true);

    try {
      await yieldToUi();
      setTestDataLoadingStatus('Generating pairwise combinations...');
      await yieldToUi();

      const result = generationEngine.generatePairwise();
      if (!result.ok) {
        surfaceEnginePresentation(
          presentUiGenerationResult({
            surface: 'app',
            operationKind: 'generatePairwise',
            result,
          })
        );
        return;
      }

      await applyGeneratedTableAndStatus({
        dataTable: result.dataTable,
        presentationOptions: {
          operationKind: 'generatePairwise',
          result,
        },
      });
      await yieldToUi();
    } catch (error) {
      console.error('Pairwise generation error:', error);
      showSchemaError(`Pairwise generation failed: ${error.message}`);
      setTestDataStatus('Pairwise generation failed.', { severity: 'error', dismissable: true });
    } finally {
      setGeneratePairwiseBusy(false);
    }
  }

  async function generateCombinationsTestData(selection) {
    debouncer.clear('populateTestDataGrid');
    syncSchemaTextFromGridBeforeGenerate();
    setGeneratePairwiseBusy(true);

    try {
      const algorithm = selection?.algorithm;
      const confirmed = await confirmCartesianProductSelection({
        algorithm,
        valueCounts: generationEngine.getCombinationInput({ syncFromText: false }).enumValueCounts,
        requestConfirm,
      });
      if (!confirmed) {
        const presentation = presentUiGenerationNotice({
          noticeKind: 'cartesianSkipped',
          surface: 'app',
        });
        setTestDataStatus(presentation.statusMessage, presentation.statusOptions);
        return;
      }

      const strength = Number.parseInt(selection?.strength, 10);
      setTestDataLoadingStatus(`Generating ${strength}-wise combinations...`);
      await yieldToUi();

      const result = generationEngine.generateCombinations({
        strength,
        algorithm,
        validationOptions: { syncFromText: false },
      });
      if (!result.ok) {
        surfaceEnginePresentation(
          presentUiGenerationResult({
            surface: 'app',
            operationKind: 'generateCombinations',
            result,
          })
        );
        return;
      }

      await applyGeneratedTableAndStatus({
        dataTable: result.dataTable,
        presentationOptions: {
          operationKind: 'generateCombinations',
          result,
          strength,
        },
      });
      await yieldToUi();
    } catch (error) {
      console.error('Combination generation error:', error);
      showSchemaError(`Combination generation failed: ${error.message}`);
      setTestDataStatus('Combination generation failed.', { severity: 'error', dismissable: true });
    } finally {
      setGeneratePairwiseBusy(false);
    }
  }

  async function generateTestData() {
    debouncer.clear('populateTestDataGrid');
    syncSchemaTextFromGridBeforeGenerate();
    setTestDataLoadingStatus('Validating schema...');
    setGenerateBusy(true);

    try {
      const requestedRowCount = getRequestedRowCount();
      const desiredRowCountRaw = requestedRowCount == null ? '' : `${requestedRowCount}`;
      const desiredRowCountParsed = Number.parseInt(desiredRowCountRaw, 10);
      const desiredRowCount = normaliseCount(desiredRowCountRaw);
      const generationMode = getGenerationMode();
      const gridExtras = getMainGridExtras();

      if (
        !Number.isFinite(desiredRowCountParsed) ||
        (desiredRowCountParsed < 1 && generationMode !== TEST_DATA_MODES.AMEND_SELECTED)
      ) {
        showSchemaError('Enter how many rows to generate.');
        setTestDataStatus('Invalid row count.', { severity: 'warning', dismissable: true });
        return;
      }

      if (
        (generationMode === TEST_DATA_MODES.AMEND_TABLE || generationMode === TEST_DATA_MODES.AMEND_SELECTED) &&
        !gridExtras
      ) {
        showSchemaError('Grid interface unavailable.');
        setTestDataStatus('Unable to access current grid.', { severity: 'error', dismissable: true });
        return;
      }

      if (
        generationMode === TEST_DATA_MODES.AMEND_SELECTED &&
        typeof gridExtras?.getSelectedRowIndexes !== 'function'
      ) {
        showSchemaError('Grid interface unavailable.');
        setTestDataStatus('Unable to access current grid.', { severity: 'error', dismissable: true });
        return;
      }

      if (
        (generationMode === TEST_DATA_MODES.AMEND_TABLE || generationMode === TEST_DATA_MODES.AMEND_SELECTED) &&
        typeof gridExtras?.applyGeneratedSchemaAmend !== 'function' &&
        typeof gridExtras?.getGridAsGenericDataTable !== 'function'
      ) {
        showSchemaError('Grid interface unavailable.');
        setTestDataStatus('Unable to access current grid.', { severity: 'error', dismissable: true });
        return;
      }

      const selectedRowIndexes =
        generationMode === TEST_DATA_MODES.AMEND_SELECTED ? gridExtras.getSelectedRowIndexes() || [] : [];

      if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && selectedRowIndexes.length === 0) {
        showSchemaError('No rows selected.');
        setTestDataStatus('No selected rows to amend.', { severity: 'warning', dismissable: true });
        return;
      }

      await yieldToUi();
      setTestDataLoadingStatus(
        generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generating rows...' : 'Preparing table amend...'
      );
      await yieldToUi();

      if (generationMode === TEST_DATA_MODES.NEW_TABLE) {
        let retryLimitReached = false;
        const result = await generationEngine.generateRows({
          rowCount: desiredRowCount,
          onConstraintImpact: async ({ generatedRows, failedRows, retryCount, continueGeneration }) => {
            if (retryCount >= MAX_CONSTRAINT_RETRY_BATCHES) {
              retryLimitReached = true;
              return;
            }

            const shouldContinue = await requestConstraintImpactDecision({ generatedRows, failedRows });
            if (shouldContinue) {
              continueGeneration();
            }
          },
        });

        if (!result.ok && !result.aborted) {
          surfaceEnginePresentation(
            presentUiGenerationResult({
              surface: 'app',
              operationKind: 'generateRows',
              result,
            })
          );
          return;
        }

        if (result.aborted) {
          await applyGeneratedTableAndStatus({
            dataTable: result.dataTable,
            loadingMessage: 'Applying valid rows to grid...',
            presentationOptions: {
              operationKind: 'generateRows',
              result,
              retryLimitReached,
            },
          });
          return;
        }

        await applyGeneratedTableAndStatus({
          dataTable: result.dataTable,
          presentationOptions: {
            operationKind: 'generateRows',
            result,
          },
        });
        return;
      }

      if (typeof gridExtras.applyGeneratedSchemaAmend === 'function') {
        const directAmendAdapter = generationEngine.createDirectAmendAdapter({ syncFromText: false });
        if (!directAmendAdapter.ok) {
          showSchemaError(schemaErrorsToText(directAmendAdapter.errors || []));
          setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
          return;
        }

        setTestDataLoadingStatus('Amending rows...');
        await yieldToUi();
        const directAmendResult = await Promise.resolve(
          gridExtras.applyGeneratedSchemaAmend({
            mode: generationMode,
            desiredRowCount,
            schemaHeaders: directAmendAdapter.schemaHeaders,
            generateRow: directAmendAdapter.generateRow,
            selectedRowIndexes,
          })
        );

        if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && directAmendResult?.noSelectedRows) {
          showSchemaError('No rows selected.');
          setTestDataStatus('No selected rows to amend.', { severity: 'warning', dismissable: true });
          return;
        }

        const previewUpdated = await syncTextPreviewFromGrid();
        const presentation = presentUiGenerationNotice({
          noticeKind: 'amendSuccess',
          surface: 'app',
          previewUpdated,
        });
        setTestDataStatus(presentation.statusMessage, presentation.statusOptions);
        return;
      }

      const amendResult = generationEngine.amendRows({
        dataTable: gridExtras.getGridAsGenericDataTable(),
        rowCount: desiredRowCount,
        mode: generationMode,
        selectedRowIndexes,
      });

      if (!amendResult.ok) {
        surfaceEnginePresentation(
          presentUiGenerationResult({
            surface: 'app',
            operationKind: 'amendRows',
            result: amendResult,
          })
        );
        return;
      }

      await applyGeneratedTableAndStatus({
        dataTable: amendResult.dataTable,
        presentationOptions: {
          operationKind: 'amendRows',
          result: amendResult,
        },
      });
    } catch (error) {
      console.error('Generate/amend failed', error);
      setTestDataStatus('Generate failed. Check console for details.', { severity: 'error', dismissable: true });
      showSchemaError('Generate failed. Check console for details.');
    } finally {
      setGenerateBusy(false);
    }
  }

  return {
    schemaErrorsToText,
    getRulesParserFromTextArea,
    updatePairwiseButtonVisibility,
    countEnumColumns,
    getEnumValueCounts,
    generatePairwiseTestData,
    generateCombinationsTestData,
    generateTestData,
  };
}

export { createTestDataGenerationService };
