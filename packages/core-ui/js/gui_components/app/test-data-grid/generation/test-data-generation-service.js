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
  showSchemaError,
  yieldToUi,
  validateCurrentSchemaRows,
  getImporter,
  getTextPreviewRenderer,
  getMainGridExtras,
  getGenerationMode,
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

  function getRulesParserFromTextArea() {
    const rowValidation = getCurrentSchemaRowValidation({ syncFromText: false });
    if (rowValidation.errors.length > 0) {
      return { generator: null, errors: rowValidation.errors };
    }
    const parseResult = createGeneratorFromSchemaRows(rowValidation.rows || []);
    return { generator: parseResult.generator, errors: parseResult.errors };
  }

  function showPairwiseButton() {
    const button = document.getElementById('generateallpairs');
    if (button) {
      button.style.display = '';
    }
  }

  function hidePairwiseButton() {
    const button = document.getElementById('generateallpairs');
    if (button) {
      button.style.display = 'none';
    }
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
    const generateButton = document.getElementById('generateallpairs');
    setTestDataStatus('Generating pairwise...', true);
    if (generateButton) {
      generateButton.disabled = true;
    }

    try {
      const rowValidation = getCurrentSchemaRowValidation();
      if (rowValidation.errors.length > 0) {
        const errorMessages = schemaErrorsToText(rowValidation.errors);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', false);
        return;
      }

      const { generator, errors } = getRulesParserFromTextArea();

      if (errors.length > 0 || !generator) {
        const errorMessages = schemaErrorsToText(errors);
        console.log(errorMessages);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', false);
        return;
      }

      if (!isPairwiseEligibleForSchemaRows(rowValidation.rows || [])) {
        showSchemaError('Pairwise generation requires at least 2 enum columns.');
        setTestDataStatus('Insufficient enum columns.', false);
        return;
      }

      await yieldToUi();
      setTestDataStatus('Generating pairwise combinations...', true);
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
        setTestDataStatus('Pairwise generation failed.', false);
        return;
      }

      if (dataTable) {
        setTestDataStatus('Applying data to grid...', true);
        await yieldToUi();
        await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
      }

      setTestDataStatus(`Generated ${dataTable.getRowCount()} pairwise combinations.`, false);
      await yieldToUi();
    } catch (error) {
      console.error('Pairwise generation error:', error);
      showSchemaError(`Pairwise generation failed: ${error.message}`);
      setTestDataStatus('Pairwise generation failed.', false);
    } finally {
      if (generateButton) {
        generateButton.disabled = false;
      }
    }
  }

  async function generateTestData() {
    debouncer.clear('populateTestDataGrid');
    syncSchemaTextFromGridBeforeGenerate();
    const generateButton = document.getElementById('generatedata');
    setTestDataStatus('Validating schema...', true);
    if (generateButton) {
      generateButton.disabled = true;
    }

    try {
      const desiredRowCountRaw = document.getElementById('generateCount').value;
      const desiredRowCountParsed = Number.parseInt(desiredRowCountRaw, 10);
      const desiredRowCount = normaliseCount(desiredRowCountRaw);
      const generationMode = getGenerationMode();
      const rowValidation = getCurrentSchemaRowValidation();

      if (rowValidation.errors.length > 0) {
        const errorMessages = schemaErrorsToText(rowValidation.errors);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', false);
        return;
      }

      const { generator, errors } = getRulesParserFromTextArea();

      if (errors.length > 0 || !generator) {
        const errorMessages = schemaErrorsToText(errors);
        console.log(errorMessages);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', false);
        return;
      }

      if (
        !Number.isFinite(desiredRowCountParsed) ||
        (desiredRowCountParsed < 1 && generationMode !== TEST_DATA_MODES.AMEND_SELECTED)
      ) {
        showSchemaError('Enter how many rows to generate.');
        setTestDataStatus('Invalid row count.', false);
        return;
      }

      await yieldToUi();
      setTestDataStatus(
        generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generating rows...' : 'Preparing table amend...',
        true
      );
      await yieldToUi();

      let dataTable;
      if (generationMode === TEST_DATA_MODES.NEW_TABLE) {
        dataTable = createTableFromGenerator(desiredRowCount, generator);
      } else {
        const gridExtras = getMainGridExtras();
        if (!gridExtras) {
          showSchemaError('Grid interface unavailable for amend mode.');
          setTestDataStatus('Grid interface unavailable.', false);
          return;
        }

        const selectedRowIndexes =
          generationMode === TEST_DATA_MODES.AMEND_SELECTED ? gridExtras.getSelectedRowIndexes() : [];

        if (typeof gridExtras.applyGeneratedSchemaAmend === 'function') {
          setTestDataStatus('Amending rows...', true);
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
            setTestDataStatus('No selected rows to amend.', false);
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
            setTestDataStatus('No selected rows to amend.', false);
            return;
          }

          dataTable = amendResult.dataTable;
        }
      }

      if (dataTable) {
        setTestDataStatus('Applying data to grid...', true);
        await yieldToUi();
        await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
      }

      const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generate' : 'Amend';
      setTestDataStatus(`${completedModeLabel} complete. Refresh text preview if needed.`, false);
    } catch (error) {
      console.error('Generate/amend failed', error);
      setTestDataStatus('Generate failed. Check console for details.', false);
      showSchemaError('Generate failed. Check console for details.');
    } finally {
      if (generateButton) {
        generateButton.disabled = false;
      }
    }
  }

  async function refreshTestDataPreview({ clearPendingStatusReset, scheduleStatusReset }) {
    const textPreviewRenderer = getTextPreviewRenderer();
    if (!textPreviewRenderer) {
      return;
    }
    const refreshButton = document.getElementById('refreshtestdatapreview');
    clearPendingStatusReset();
    setTestDataStatus('Refreshing text preview...', true);
    if (refreshButton) {
      refreshButton.disabled = true;
    }

    try {
      await yieldToUi();
      await Promise.resolve(textPreviewRenderer.renderTextFromGrid());
      setTestDataStatus('Text preview refreshed.', false);
      scheduleStatusReset();
    } catch (error) {
      console.error('Failed to refresh text preview', error);
      setTestDataStatus('Text preview refresh failed. Check console for details.', false);
    } finally {
      if (refreshButton) {
        refreshButton.disabled = false;
      }
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
