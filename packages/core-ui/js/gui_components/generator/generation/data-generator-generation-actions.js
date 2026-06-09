/*
 * Responsibilities:
 * - Generator-page preview/export workflows and pairwise eligibility checks.
 * - Wraps shared generation helpers so generator UI can stay thin.
 */

import { applyExportTextEncoding } from '@anywaydata/core';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import {
  CombinationAlgorithm,
  CombinationsTestDataGenerator,
  DEFAULT_AETG_RUNS,
} from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';
import { schemaErrorsToText } from '../../shared/test-data/schema/schema-error-text.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
  createCombinationsDataTable,
} from '../../shared/test-data/generation/generation-controller.js';
import { isNWiseEligibleForSchemaRows } from '../../shared/test-data/generation/ui-derived-state.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
} from '../../shared/schema-row-rule-mapper.js';

function createConfiguredGeneratorForPage({
  syncSchemaRowsFromTextMode,
  validateSchemaRows,
  schemaRowsToSpec,
  TestDataGeneratorClass,
  faker,
  RandExp,
}) {
  const parsed = syncSchemaRowsFromTextMode({ showErrors: false, applySemanticValidation: false });
  if (parsed.errors?.length > 0) {
    return { errors: parsed.errors };
  }

  return createConfiguredGeneratorFromSchemaRows({
    schemaRows: parsed.rows,
    validateSchemaRows,
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

function buildPreviewDataTable({ generator, rowCount }) {
  return createPreviewDataTable({
    rowCount,
    generator,
    GenericDataTableClass: GenericDataTable,
  });
}

function buildPairwiseDataTable({ generator, faker, RandExp }) {
  return createPairwiseDataTable({
    generator,
    PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
    GenericDataTableClass: GenericDataTable,
    faker,
    RandExp,
  });
}

function buildCombinationsDataTable({ generator, faker, RandExp, options }) {
  return createCombinationsDataTable({
    generator,
    CombinationsTestDataGeneratorClass: CombinationsTestDataGenerator,
    GenericDataTableClass: GenericDataTable,
    faker,
    RandExp,
    options,
  });
}

function renderGeneratorOutputPreview({ getSelectedOutputType, getPreviewDataTable, exporter, setOutputPreviewText }) {
  const type = getSelectedOutputType();
  const dataTable = getPreviewDataTable?.() || null;
  if (!type || !dataTable || !exporter?.canExport(type)) {
    setOutputPreviewText?.('');
    return;
  }

  try {
    const text = exporter.getDataTableAs(type, dataTable);
    setOutputPreviewText?.(text);
  } catch (error) {
    console.error(error);
    setOutputPreviewText?.('');
  }
}

async function exportDataTableToDownload({
  type,
  dataTable,
  exporter,
  DownloadClass,
  showGenerationLoadingStatus,
  exportEncodingSettings,
}) {
  let text = '';
  if (typeof exporter.getDataTableAsAsync === 'function') {
    text = await exporter.getDataTableAsAsync(type, dataTable, (message) => {
      if (message) {
        showGenerationLoadingStatus(message);
      }
    });
  } else {
    text = exporter.getDataTableAs(type, dataTable);
  }

  const filename = dataTable.__generatorFilename;
  const downloader = new DownloadClass(filename);
  downloader.downloadFile(applyExportTextEncoding(text, exportEncodingSettings));
  return { filename };
}

function updateGeneratorPairwiseButtonVisibility({
  syncSchemaRowsFromTextMode,
  getCurrentSchemaState,
  validateSchemaRows,
}) {
  const parsed =
    typeof getCurrentSchemaState === 'function'
      ? getCurrentSchemaState()
      : syncSchemaRowsFromTextMode({ showErrors: false, applySemanticValidation: false });
  const { errors, rows } = validateSchemaRows(parsed.rows || []);
  const isVisible = !parsed.errors?.length && !errors.length && isNWiseEligibleForSchemaRows(rows);
  return isVisible;
}

function countGeneratorEnumColumns({ syncSchemaRowsFromTextMode, validateSchemaRows }) {
  const parsed = syncSchemaRowsFromTextMode({ showErrors: false, applySemanticValidation: false });
  if (parsed.errors?.length > 0) {
    return 0;
  }

  const { errors, rows } = validateSchemaRows(parsed.rows);
  if (errors.length > 0) {
    return 0;
  }

  return rows.filter(
    (row) =>
      String(row?.sourceType || '')
        .trim()
        .toLowerCase() === SOURCE_TYPE_ENUM
  ).length;
}

function getGeneratorEnumValueCounts({ syncSchemaRowsFromTextMode, validateSchemaRows }) {
  const parsed = syncSchemaRowsFromTextMode({ showErrors: false, applySemanticValidation: false });
  if (parsed.errors?.length > 0) {
    return [];
  }

  const { errors, rows } = validateSchemaRows(parsed.rows);
  if (errors.length > 0) {
    return [];
  }

  return rows
    .filter((row) => {
      const sourceType = String(row?.sourceType || '')
        .trim()
        .toLowerCase();
      const command = String(row?.command || '')
        .trim()
        .toLowerCase();
      return sourceType === SOURCE_TYPE_ENUM || (sourceType === SOURCE_TYPE_DOMAIN && command === 'datatype.enum');
    })
    .map((row) => {
      try {
        return EnumParser.extractEnumValues(buildRuleSpecFromSchemaRow(row)).length;
      } catch {
        return 0;
      }
    })
    .filter((count) => count > 0);
}

function previewGeneratorData({
  getPreviewRowCount,
  createConfiguredGenerator,
  buildDataTable,
  setPreviewDataTable,
  renderOutputPreviewForCurrentSelection,
  surfacePageError,
  clearPageError,
}) {
  const rowCount = getPreviewRowCount();
  if (rowCount.errors.length > 0) {
    surfacePageError(rowCount.errors.join('\n'));
    return;
  }

  const configured = createConfiguredGenerator();
  if (configured.errors?.length > 0) {
    surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
    return;
  }

  const dataTable = buildDataTable(configured.generator, rowCount.value);
  clearPageError?.();
  setPreviewDataTable?.(dataTable);
  renderOutputPreviewForCurrentSelection();
}

async function generateGeneratorDataFile({
  getGenerateRowCount,
  createConfiguredGenerator,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  getExportEncodingSettings,
  buildDataTable,
  DownloadClass,
  surfacePageError,
  clearPageError,
  scheduleClearGenerationStatus,
}) {
  const rowCount = getGenerateRowCount();
  if (rowCount.errors.length > 0) {
    surfacePageError(rowCount.errors.join('\n'));
    return;
  }

  const configured = createConfiguredGenerator();
  if (configured.errors?.length > 0) {
    surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
    return;
  }

  const type = getSelectedOutputType();
  if (!exporter.canExport(type)) {
    surfacePageError(`Output format ${type} is not supported.`);
    return;
  }

  clearGenerationStatus();
  setGenerationButtonBusy(true);
  showGenerationLoadingStatus(`Preparing ${type.toUpperCase()} export...`);

  try {
    const dataTable = buildDataTable(configured.generator, rowCount.value);
    clearPageError?.();
    dataTable.__generatorFilename = `generated-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable,
      exporter,
      DownloadClass,
      showGenerationLoadingStatus,
      exportEncodingSettings: getExportEncodingSettings?.(),
    });
    setGenerationStatus(`Download ready: ${filename}`);
    scheduleClearGenerationStatus();
  } catch (error) {
    console.error(error);
    surfacePageError('Unable to generate data file.');
    setGenerationStatus('Failed to generate data file.', { severity: 'error', dismissable: true });
  } finally {
    setGenerationButtonBusy(false);
  }
}

async function generateGeneratorAllPairsDataFile({
  createConfiguredGenerator,
  countEnumColumns,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  getExportEncodingSettings,
  buildAllPairsDataTable,
  DownloadClass,
  surfacePageError,
  clearPageError,
  scheduleClearGenerationStatus,
}) {
  const configured = createConfiguredGenerator();
  if (configured.errors?.length > 0) {
    surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
    return;
  }

  if (countEnumColumns() < 2) {
    surfacePageError('Pairwise generation requires at least 2 enum columns.');
    return;
  }

  const type = getSelectedOutputType();
  if (!exporter.canExport(type)) {
    surfacePageError(`Output format ${type} is not supported.`);
    return;
  }

  clearGenerationStatus();
  setGenerationButtonBusy(true);
  showGenerationLoadingStatus('Generating pairwise combinations...');

  try {
    const dataTable = buildAllPairsDataTable(configured.generator);
    if (!dataTable) {
      surfacePageError('Failed to generate pairwise data.');
      setGenerationStatus('Pairwise generation failed.', { severity: 'error', dismissable: true });
      return;
    }

    clearPageError?.();
    dataTable.__generatorFilename = `all-pairs-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable,
      exporter,
      DownloadClass,
      showGenerationLoadingStatus,
      exportEncodingSettings: getExportEncodingSettings?.(),
    });
    setGenerationStatus(`Download ready: ${filename} (${dataTable.getRowCount()} combinations)`);
    scheduleClearGenerationStatus();
  } catch (error) {
    console.error(error);
    surfacePageError('Unable to generate pairwise data file.');
    setGenerationStatus('Failed to generate pairwise data file.', { severity: 'error', dismissable: true });
  } finally {
    setGenerationButtonBusy(false);
  }
}

async function generateGeneratorCombinationsDataFile({
  createConfiguredGenerator,
  countEnumColumns,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  buildCombinationsDataTable: buildCombinationsDataTableFn,
  DownloadClass,
  surfacePageError,
  clearPageError,
  scheduleClearGenerationStatus,
  selection,
}) {
  const strength = Number.parseInt(selection?.strength, 10);
  const algorithm = selection?.algorithm;
  const enumColumnCount = countEnumColumns();
  if (!Number.isInteger(strength) || strength < 2 || strength > enumColumnCount) {
    surfacePageError(`n-wise strength must be between 2 and ${enumColumnCount} for this schema.`);
    return;
  }

  const configured = createConfiguredGenerator();
  if (configured.errors?.length > 0) {
    surfacePageError(schemaErrorsToText(configured.errors), { useSchemaStatus: true });
    return;
  }

  const type = getSelectedOutputType();
  if (!exporter.canExport(type)) {
    surfacePageError(`Output format ${type} is not supported.`);
    return;
  }

  clearGenerationStatus();
  setGenerationButtonBusy(true);
  showGenerationLoadingStatus(`Generating ${strength}-wise combinations...`);

  try {
    const dataTable = buildCombinationsDataTableFn(configured.generator, {
      strength,
      algorithm,
      seed: 1,
      candidateCount: 20,
      // AETG is randomized, so we run it twice and keep the better result.
      runs: algorithm === CombinationAlgorithm.AETG ? DEFAULT_AETG_RUNS : 1,
    });
    if (!dataTable) {
      surfacePageError('Failed to generate combinations data.');
      setGenerationStatus('Combination generation failed.', { severity: 'error', dismissable: true });
      return;
    }

    clearPageError?.();
    dataTable.__generatorFilename = `n-wise-combinations-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable,
      exporter,
      DownloadClass,
      showGenerationLoadingStatus,
    });
    setGenerationStatus(`Download ready: ${filename} (${dataTable.getRowCount()} combinations)`);
    scheduleClearGenerationStatus();
  } catch (error) {
    console.error(error);
    surfacePageError('Unable to generate combinations data file.');
    setGenerationStatus('Failed to generate combinations data file.', { severity: 'error', dismissable: true });
  } finally {
    setGenerationButtonBusy(false);
  }
}

export {
  createConfiguredGeneratorForPage,
  buildPreviewDataTable,
  buildPairwiseDataTable,
  buildCombinationsDataTable,
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
  countGeneratorEnumColumns,
  getGeneratorEnumValueCounts,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
  generateGeneratorCombinationsDataFile,
};
