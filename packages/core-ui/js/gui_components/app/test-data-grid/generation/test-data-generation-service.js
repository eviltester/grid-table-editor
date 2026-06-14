/*
 * Responsibilities:
 * - Encapsulates generate/amend/pairwise execution flows for test-data grid.
 * - Handles schema parsing into generator rules and validation error surfacing.
 * - Owns generation progress/status transitions and preview refresh behavior.
 */

import { schemaErrorsToText } from '../../../shared/test-data/schema/schema-error-text.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createCombinationsDataTable,
} from '../../../shared/test-data/generation/generation-controller.js';
import {} from '../../../shared/test-data/generation/generation-runtime.js';
import { isNWiseEligibleForSchemaRows } from '../../../shared/test-data/generation/ui-derived-state.js';
import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';
import { CONSTRAINT_FAILURE_BATCH_SIZE, createGenerationSession } from '@anywaydata/core';
import {
  CombinationAlgorithm,
  DEFAULT_AETG_RUNS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
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

  function createGeneratorFromSchemaRows(schemaRows) {
    return createConfiguredGeneratorFromSchemaRows({
      schemaRows,
      validateSchemaRows: () => ({ errors: [], rows: schemaRows }),
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

  function getRulesParserFromTextArea(rowValidation = getCurrentSchemaRowValidation({ syncFromText: false })) {
    if (rowValidation.errors.length > 0) {
      return { generator: null, errors: rowValidation.errors };
    }
    const parseResult = createGeneratorFromSchemaRows(rowValidation.rows || []);
    return { generator: parseResult.generator, errors: parseResult.errors };
  }

  function buildGenerationSchemaText(rowValidation = getCurrentSchemaRowValidation({ syncFromText: false })) {
    const explicitSchemaText = String(getSchemaText?.() || '').trim();
    if (explicitSchemaText.length > 0) {
      return explicitSchemaText;
    }

    return schemaRowsToSpec(rowValidation.rows || []);
  }

  function createCoreGenerationSession(rowValidation = getCurrentSchemaRowValidation({ syncFromText: false })) {
    if (rowValidation.errors.length > 0) {
      return { session: null, errors: rowValidation.errors };
    }

    const generatorParse = getRulesParserFromTextArea(rowValidation);
    if (generatorParse.errors.length > 0) {
      return { session: null, errors: generatorParse.errors };
    }

    const session = createGenerationSessionFn({
      textSpec: buildGenerationSchemaText(rowValidation),
      schemaSource: 'app-test-data-grid',
      fakerInstance: faker,
      RandExpClass: RandExp,
    });

    if (!session.isValid()) {
      return { session: null, errors: session.getErrors() };
    }

    return { session, errors: [] };
  }

  function createDataTableFromResult(result) {
    const dataTable = new GenericDataTableClass();
    if (typeof dataTable.setHeaders !== 'function') {
      dataTable.headers = [];
      dataTable.rows = [];
      dataTable.setHeaders = (headers) => {
        dataTable.headers = Array.isArray(headers) ? [...headers] : [];
      };
      dataTable.appendDataRow = (row) => {
        dataTable.rows.push(Array.isArray(row) ? [...row] : []);
      };
      dataTable.getRowCount = () => dataTable.rows.length;
      dataTable.getRow = (index) => dataTable.rows[index];
    }

    dataTable.setHeaders(result.headers || []);
    (result.rows || []).forEach((row) => {
      dataTable.appendDataRow(Array.isArray(row) ? [...row] : []);
    });
    return dataTable;
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

  function buildConstraintImpactMessage({ generatedRows = 0, failedRows = 0 } = {}) {
    return `Schema Constraints are impacting row generation - generated ${generatedRows} rows, failed to generate ${failedRows} rows. Consider changing constraints to improve row generation.`;
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

      const { session, errors } = createCoreGenerationSession(rowValidation);

      if (errors.length > 0 || !session) {
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

      const result = session.generatePairwise({
        outputFormat: 'json',
      });
      if (!result.ok) {
        showSchemaError('Failed to generate pairwise data.');
        setTestDataStatus('Pairwise generation failed.', { severity: 'error', dismissable: true });
        return;
      }
      const dataTable = createDataTableFromResult(result);

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

      const confirmed = await confirmCartesianProductSelection({
        algorithm,
        valueCounts: getEnumValueCounts(),
        requestConfirm,
      });
      if (!confirmed) {
        setTestDataStatus('Cartesian product generation skipped.', { severity: 'warning', dismissable: true });
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
      const gridExtras = getMainGridExtras();
      const selectedRowIndexes =
        generationMode === TEST_DATA_MODES.AMEND_SELECTED ? gridExtras?.getSelectedRowIndexes?.() || [] : [];

      if (rowValidation.errors.length > 0) {
        const errorMessages = schemaErrorsToText(rowValidation.errors);
        showSchemaError(errorMessages);
        setTestDataStatus('Schema validation failed.', { severity: 'error', dismissable: true });
        return;
      }

      const { session, errors } = createCoreGenerationSession(rowValidation);

      if (errors.length > 0 || !session) {
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

      let dataTable;
      let constraintImpactMessage = '';
      let retryLimitReached = false;
      if (generationMode === TEST_DATA_MODES.NEW_TABLE) {
        const monitoredGeneration = await session.generateRows({
          rowCount: desiredRowCount,
          hooks: {
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
          },
        });
        if (!monitoredGeneration.ok && !monitoredGeneration.aborted) {
          throw new Error(schemaErrorsToText(monitoredGeneration.errors || []));
        }
        dataTable = createDataTableFromResult(monitoredGeneration);

        if (monitoredGeneration.aborted) {
          setTestDataLoadingStatus('Applying valid rows to grid...');
          await yieldToUi();
          await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));

          const previewUpdated = await syncTextPreviewFromGrid();
          const message = buildConstraintImpactMessage({
            generatedRows: monitoredGeneration.rows.length,
            failedRows: monitoredGeneration.diagnostics?.failedRows || CONSTRAINT_FAILURE_BATCH_SIZE,
          });
          const surfacedMessage = retryLimitReached ? `${message} Retry limit reached.` : message;
          showSchemaError(surfacedMessage);
          setTestDataStatus(`${surfacedMessage} ${previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'}`, {
            severity: 'warning',
            dismissable: true,
          });
          return;
        }
      } else {
        if (!gridExtras) {
          showSchemaError('Grid interface unavailable for amend mode.');
          setTestDataStatus('Grid interface unavailable.', { severity: 'error', dismissable: true });
          return;
        }
        if (typeof gridExtras.applyGeneratedSchemaAmend === 'function') {
          const { generator } = getRulesParserFromTextArea(rowValidation);
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
          const amendResult = session.amendRows({
            headers: currentDataTable?.getHeaders?.() || [],
            rows: currentDataTable?.rows || [],
            rowCount: desiredRowCount,
            mode: generationMode,
            selectedRowIndexes,
          });

          if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && amendResult.diagnostics?.noSelectedRows) {
            showSchemaError('No rows selected.');
            setTestDataStatus('No selected rows to amend.', { severity: 'warning', dismissable: true });
            return;
          }

          if (!amendResult.ok) {
            constraintImpactMessage = buildConstraintImpactMessage({
              generatedRows: amendResult.diagnostics?.rowCount || 0,
              failedRows: amendResult.diagnostics?.failedCount || CONSTRAINT_FAILURE_BATCH_SIZE,
            });
            showSchemaError(constraintImpactMessage);
          }

          dataTable = createDataTableFromResult(
            amendResult.ok ? amendResult : { headers: amendResult.headers || [], rows: amendResult.rows || [] }
          );
        }
      }

      if (dataTable) {
        setTestDataLoadingStatus('Applying data to grid...');
        await yieldToUi();
        await Promise.resolve(getImporter().setGridFromGenericDataTable(dataTable));
      }

      const previewUpdated = await syncTextPreviewFromGrid();
      if (constraintImpactMessage) {
        setTestDataStatus(
          `${constraintImpactMessage} ${previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'}`,
          {
            severity: 'warning',
            dismissable: true,
          }
        );
      } else {
        const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generate' : 'Amend';
        setTestDataStatus(
          `${completedModeLabel} complete. ${previewUpdated ? 'Grid and preview updated.' : 'Grid updated.'}`,
          { dismissable: true }
        );
      }
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
