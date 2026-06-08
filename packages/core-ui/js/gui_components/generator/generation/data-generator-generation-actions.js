/*
 * Responsibilities:
 * - Generator-page preview/export workflows and pairwise eligibility checks.
 * - Wraps shared generation helpers so generator UI can stay thin.
 */

import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { schemaErrorsToText } from '../../shared/test-data/schema/schema-error-text.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
} from '../../shared/test-data/generation/generation-controller.js';
import { isPairwiseEligibleForSchemaRows } from '../../shared/test-data/generation/ui-derived-state.js';
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

async function exportDataTableToDownload({ type, dataTable, exporter, DownloadClass, showGenerationLoadingStatus }) {
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
  downloader.downloadFile(text);
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
  const isVisible = !parsed.errors?.length && !errors.length && isPairwiseEligibleForSchemaRows(rows);
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

export {
  createConfiguredGeneratorForPage,
  buildPreviewDataTable,
  buildPairwiseDataTable,
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
  countGeneratorEnumColumns,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
};
