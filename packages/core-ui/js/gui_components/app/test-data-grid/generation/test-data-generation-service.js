/*
 * Responsibilities:
 * - Encapsulates generate/amend/pairwise execution flows for test-data grid.
 * - Handles schema parsing into generator rules and validation error surfacing.
 * - Owns generation progress/status transitions and preview refresh behavior.
 */

import { schemaErrorsToText } from '../../../shared/test-data/schema/schema-error-text.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPairwiseDataTable,
  createCombinationsDataTable,
} from '../../../shared/test-data/generation/generation-controller.js';
import { isNWiseEligibleForSchemaRows } from '../../../shared/test-data/generation/ui-derived-state.js';
import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';
import {
  CombinationAlgorithm,
  DEFAULT_AETG_RUNS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
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
  CombinationsTestDataGeneratorClass,
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

  function countEnumColumns() {
    const rowValidation = getCurrentSchemaRowValidation({ syncFromText: false });
    if (rowValidation.errors.length > 0) {
      return 0;
    }
    return (rowValidation.rows || []).filter((row) => {
      try {
        return (
          String(row?.sourceType || '')
            .trim()
            .toLowerCase() === SOURCE_TYPE_ENUM
        );
      } catch {
        return false;
      }
    }).length;
  }

  function getEnumValueCounts() {
    const rowValidation = getCurrentSchemaRowValidation({ syncFromText: false });
    if (rowValidation.errors.length > 0) {
      return [];
    }

    return (rowValidation.rows || [])
      .filter(
        (row) =>
          String(row?.sourceType || '')
            .trim()
            .toLowerCase() === SOURCE_TYPE_ENUM
      )
      .map((row) => {
        try {
          const ruleSpec = buildRuleSpecFromSchemaRow(row);
          return EnumParser.extractEnumValues(ruleSpec).length;
        } catch (error) {
          console.error('Failed to extract enum values for schema row rule spec.', {
            row,
            ruleSpec: row?.params,
            error,
          });
          return 0;
        }
      })
      .filter((count) => count > 0);
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

      if (!isNWiseEligibleForSchemaRows(rowValidation.rows || [])) {
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

      const previewUpdated = await syncTextPreviewFromGrid();
      setTestDataStatus(
        `Generated ${dataTable.getRowCount()} pairwise combinations. ${
          previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'
        }`,
        { dismissable: true }
      );
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

    const strength = Number.parseInt(selection?.strength, 10);
    const algorithm = selection?.algorithm;
    const enumColumnCount = countEnumColumns();

    if (!Number.isInteger(strength) || strength < 2 || strength > enumColumnCount) {
      showSchemaError(`n-wise strength must be between 2 and ${enumColumnCount} for this schema.`);
      setTestDataStatus('Invalid n-wise strength.', { severity: 'warning', dismissable: true });
      return;
    }

    setTestDataLoadingStatus(`Generating ${strength}-wise combinations...`);
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
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      if (!isNWiseEligibleForSchemaRows(rowValidation.rows || [])) {
        showSchemaError(
          'Combination generation requires at least 2 enum columns because n-wise generation combines finite enum values.'
        );
        setTestDataStatus('Insufficient enum columns.', { severity: 'warning', dismissable: true });
        return;
      }

      await yieldToUi();

      const dataTable = createCombinationsDataTable({
        generator,
        CombinationsTestDataGeneratorClass,
        GenericDataTableClass,
        faker,
        RandExp,
        options: {
          strength,
          algorithm,
          seed: 1,
          candidateCount: 20,
          // AETG is randomized, so we run it twice and keep the better result.
          runs: algorithm === CombinationAlgorithm.AETG ? DEFAULT_AETG_RUNS : 1,
        },
      });

      if (!dataTable) {
        showSchemaError('Failed to generate combinations data.');
        setTestDataStatus('Combination generation failed.', { severity: 'error', dismissable: true });
        return;
      }

      setTestDataLoadingStatus('Applying data to grid...');
      await yieldToUi();
      await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));

      const previewUpdated = await syncTextPreviewFromGrid();
      setTestDataStatus(
        `Generated ${dataTable.getRowCount()} ${strength}-wise combinations. ${
          previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'
        }`,
        { dismissable: true }
      );
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

      const previewUpdated = await syncTextPreviewFromGrid();
      const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generate' : 'Amend';
      setTestDataStatus(
        `${completedModeLabel} complete. ${previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'}`,
        { dismissable: true }
      );
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
