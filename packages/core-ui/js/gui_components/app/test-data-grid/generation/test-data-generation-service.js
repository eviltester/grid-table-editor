/*
 * Responsibilities:
 * - Encapsulates generate/amend/pairwise execution flows for test-data grid.
 * - Handles schema parsing into generator rules and validation error surfacing.
 * - Owns generation progress/status transitions and preview refresh behavior.
 */

import { schemaErrorsToText } from '../../../shared/test-data/schema/index.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPairwiseDataTable,
  isPairwiseEligibleForSchemaRows,
} from '../../../shared/test-data/generation/index.js';
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

function createTestDataGenerationService({
  TestDataGeneratorClass,
  PairwiseTestDataGeneratorClass,
  GenericDataTableClass,
  TEST_DATA_MODES,
  normaliseCount,
  createTableFromGenerator,
  createAmendedTable,
  schemaRowsToSpec,
  faker,
  RandExp,
  debouncer,
  syncSchemaTextFromGridBeforeGenerate,
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
  setRefreshPreviewBusy = () => {},
  setPairwiseVisible = () => {},
}) {
  function getCurrentSchemaRowValidation(options) {
    return validateCurrentSchemaRows?.(options) || { errors: [], rows: [] };
  }

  function createGeneratorFromSchemaRows(schemaRows) {
    return createConfiguredGeneratorFromSchemaRows({
      schemaRows,
      validateSchemaRows: () => ({ errors: [], rows: schemaRows }),
      schemaRowsToSpec,
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

  function getRulesParserFromTextArea(rowValidation = getCurrentSchemaRowValidation({ syncFromText: false })) {
    if (rowValidation.errors.length > 0) {
      return { generator: null, errors: rowValidation.errors };
    }
    const parseResult = createGeneratorFromSchemaRows(rowValidation.rows || []);
    return { generator: parseResult.generator, errors: parseResult.errors };
  }

  function showPairwiseButton() {
    setPairwiseVisible(true);
  }

  function hidePairwiseButton() {
    setPairwiseVisible(false);
  }

  function updatePairwiseButtonVisibility() {
    const rowValidation = getCurrentSchemaRowValidation({ syncFromText: false });
    if (rowValidation.errors.length > 0) {
      hidePairwiseButton();
      return;
    }
    if (isPairwiseEligibleForSchemaRows(rowValidation.rows || [])) {
      showPairwiseButton();
    } else {
      hidePairwiseButton();
    }
  }

  async function generatePairwiseTestData() {
    debouncer.clear('populateTestDataGrid');
    syncSchemaTextFromGridBeforeGenerate();
    setTestDataLoadingStatus('Generating pairwise...');
    setGeneratePairwiseBusy(true);

    try {
      const rowValidation = getCurrentSchemaRowValidation();
      if (rowValidation.errors.length > 0) {
        const errorMessages = schemaErrorsToText(rowValidation.errors);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      const { generator, errors } = getRulesParserFromTextArea(rowValidation);

      if (errors.length > 0 || !generator) {
        const errorMessages = schemaErrorsToText(errors);
        console.log(errorMessages);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      if (!isPairwiseEligibleForSchemaRows(rowValidation.rows || [])) {
        showSchemaError('Pairwise generation requires at least 2 enum columns.');
        setTestDataStatus('Insufficient enum columns.', { severity: 'warning', dismissable: true });
        return;
      }

      await yieldToUi();
      setTestDataLoadingStatus('Generating pairwise combinations...');
      await yieldToUi();

      const dataTable = createPairwiseDataTable({
        generator,
        PairwiseTestDataGeneratorClass,
        GenericDataTableClass,
        faker,
        RandExp,
      });
      if (!dataTable) {
        showSchemaError('Failed to generate pairwise data.');
        setTestDataStatus('Pairwise generation failed.', { severity: 'error', dismissable: true });
        return;
      }

      if (dataTable) {
        setTestDataLoadingStatus('Applying data to grid...');
        await yieldToUi();
        await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
      }

      setTestDataStatus(`Generated ${dataTable.getRowCount()} pairwise combinations.`, { dismissable: true });
      await yieldToUi();
    } catch (error) {
      console.error('Pairwise generation error:', error);
      showSchemaError(`Pairwise generation failed: ${error.message}`);
      setTestDataStatus('Pairwise generation failed.', { severity: 'error', dismissable: true });
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
      const rowValidation = getCurrentSchemaRowValidation();

      if (rowValidation.errors.length > 0) {
        const errorMessages = schemaErrorsToText(rowValidation.errors);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      const { generator, errors } = getRulesParserFromTextArea(rowValidation);

      if (errors.length > 0 || !generator) {
        const errorMessages = schemaErrorsToText(errors);
        console.log(errorMessages);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      if (
        !Number.isFinite(desiredRowCountParsed) ||
        (desiredRowCountParsed < 1 && generationMode !== TEST_DATA_MODES.AMEND_SELECTED)
      ) {
        showSchemaError('Enter how many rows to generate.');
        setTestDataStatus('Invalid row count.', { severity: 'warning', dismissable: true });
        return;
      }

      await yieldToUi();
      setTestDataLoadingStatus(
        generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generating rows...' : 'Preparing table amend...'
      );
      await yieldToUi();

      let dataTable;
      if (generationMode === TEST_DATA_MODES.NEW_TABLE) {
        dataTable = createTableFromGenerator(desiredRowCount, generator);
      } else {
        const gridExtras = getMainGridExtras();
        if (!gridExtras) {
          showSchemaError('Grid interface unavailable for amend mode.');
          setTestDataStatus('Grid interface unavailable.', { severity: 'error', dismissable: true });
          return;
        }

        const selectedRowIndexes =
          generationMode === TEST_DATA_MODES.AMEND_SELECTED ? gridExtras.getSelectedRowIndexes() : [];

        if (typeof gridExtras.applyGeneratedSchemaAmend === 'function') {
          setTestDataLoadingStatus('Amending rows...');
          await yieldToUi();
          const directAmendResult = await Promise.resolve(
            gridExtras.applyGeneratedSchemaAmend({
              mode: generationMode,
              desiredRowCount,
              schemaHeaders: generator.generateHeadersArray(),
              generateRow: () => generator.generateRow(),
              selectedRowIndexes,
            })
          );

          if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && directAmendResult?.noSelectedRows) {
            showSchemaError('No rows selected.');
            setTestDataStatus('No selected rows to amend.', { severity: 'warning', dismissable: true });
            return;
          }

          dataTable = null;
        } else {
          const currentDataTable = gridExtras.getGridAsGenericDataTable();
          const amendResult = createAmendedTable({
            mode: generationMode,
            desiredRowCount,
            generator,
            currentDataTable,
            selectedRowIndexes,
          });

          if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && amendResult.noSelectedRows) {
            showSchemaError('No rows selected.');
            setTestDataStatus('No selected rows to amend.', { severity: 'warning', dismissable: true });
            return;
          }

          dataTable = amendResult.dataTable;
        }
      }

      if (dataTable) {
        setTestDataLoadingStatus('Applying data to grid...');
        await yieldToUi();
        await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
      }

      const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generate' : 'Amend';
      setTestDataStatus(`${completedModeLabel} complete. Refresh text preview if needed.`, { dismissable: true });
    } catch (error) {
      console.error('Generate/amend failed', error);
      setTestDataStatus('Generate failed. Check console for details.', { severity: 'error', dismissable: true });
      showSchemaError('Generate failed. Check console for details.');
    } finally {
      setGenerateBusy(false);
    }
  }

  async function refreshTestDataPreview({ clearPendingStatusReset, scheduleStatusReset }) {
    const textPreviewRenderer = getTextPreviewRenderer();
    if (!textPreviewRenderer) {
      return;
    }
    clearPendingStatusReset();
    setTestDataLoadingStatus('Refreshing text preview...');
    setRefreshPreviewBusy(true);

    try {
      await yieldToUi();
      await Promise.resolve(textPreviewRenderer.renderTextFromGrid());
      setTestDataStatus('Text preview refreshed.');
      scheduleStatusReset();
    } catch (error) {
      console.error('Failed to refresh text preview', error);
      setTestDataStatus('Text preview refresh failed. Check console for details.', {
        severity: 'error',
        dismissable: true,
      });
    } finally {
      setRefreshPreviewBusy(false);
    }
  }

  return {
    schemaErrorsToText,
    getRulesParserFromTextArea,
    updatePairwiseButtonVisibility,
    generatePairwiseTestData,
    generateTestData,
    refreshTestDataPreview,
  };
}

export { createTestDataGenerationService };
