/*
 * Responsibilities:
 * - Generator-page preview/export workflows and pairwise eligibility checks.
 * - Keeps generator shell responsibilities thin while delegating execution to the shared generation engine.
 */

import { applyExportTextEncoding } from '@anywaydata/core';
import { schemaErrorsToText } from '../../shared/test-data/schema/schema-error-text.js';
import { isNWiseEligibleForSchemaRows } from '../../shared/test-data/generation/ui-derived-state.js';
import { confirmCartesianProductSelection } from './n-wise-generation-options.js';

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
  return !parsed.errors?.length && !errors.length && isNWiseEligibleForSchemaRows(rows);
}

function surfaceGenerationErrors(result, surfacePageError) {
  surfacePageError(schemaErrorsToText(result.errors || []), { useSchemaStatus: true });
}

function previewGeneratorData({
  getPreviewRowCount,
  schemaGenerationService,
  setPreviewDataTable,
  renderOutputPreviewForCurrentSelection,
  surfacePageError,
  clearPageError,
}) {
  function applyResult(result) {
    if (!result?.ok) {
      surfaceGenerationErrors(result || {}, surfacePageError);
      return;
    }

    clearPageError?.();
    setPreviewDataTable?.(result.dataTable);
    renderOutputPreviewForCurrentSelection();
  }

  const rowCount = getPreviewRowCount();
  if (rowCount.errors.length > 0) {
    surfacePageError(rowCount.errors.join('\n'));
    return;
  }

  const result = schemaGenerationService?.generateRows?.({ rowCount: rowCount.value });
  if (typeof result?.then === 'function') {
    return result.then(applyResult);
  }

  return applyResult(result);
}

async function generateGeneratorDataFile({
  getGenerateRowCount,
  schemaGenerationService,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  getExportEncodingSettings,
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

  const result = await schemaGenerationService?.generateRows?.({ rowCount: rowCount.value });
  if (!result?.ok) {
    surfaceGenerationErrors(result || {}, surfacePageError);
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
    clearPageError?.();
    result.dataTable.__generatorFilename = `generated-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable: result.dataTable,
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
  schemaGenerationService,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  getExportEncodingSettings,
  DownloadClass,
  surfacePageError,
  clearPageError,
  scheduleClearGenerationStatus,
}) {
  const result = schemaGenerationService?.generatePairwise?.();
  if (!result?.ok) {
    surfaceGenerationErrors(result || {}, surfacePageError);
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
    clearPageError?.();
    result.dataTable.__generatorFilename = `all-pairs-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable: result.dataTable,
      exporter,
      DownloadClass,
      showGenerationLoadingStatus,
      exportEncodingSettings: getExportEncodingSettings?.(),
    });
    setGenerationStatus(`Download ready: ${filename} (${result.dataTable.getRowCount()} combinations)`);
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
  schemaGenerationService,
  getSelectedOutputType,
  exporter,
  clearGenerationStatus,
  setGenerationButtonBusy,
  setGenerationStatus,
  showGenerationLoadingStatus,
  DownloadClass,
  surfacePageError,
  clearPageError,
  scheduleClearGenerationStatus,
  selection,
  requestConfirm,
}) {
  const strength = Number.parseInt(selection?.strength, 10);
  const algorithm = selection?.algorithm;
  const combinationInput = schemaGenerationService?.getCombinationInput?.() || {
    enumColumnCount: 0,
    enumValueCounts: [],
  };

  const confirmed = await confirmCartesianProductSelection({
    algorithm,
    valueCounts: combinationInput.enumValueCounts || [],
    requestConfirm,
  });
  if (!confirmed) {
    setGenerationStatus('Cartesian product generation skipped.', { severity: 'warning', dismissable: true });
    return;
  }

  const result = schemaGenerationService?.generateCombinations?.({ strength, algorithm });
  if (!result?.ok) {
    surfaceGenerationErrors(result || {}, surfacePageError);
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
    clearPageError?.();
    result.dataTable.__generatorFilename = `n-wise-combinations-data${exporter.getFileExtensionFor(type)}`;
    const { filename } = await exportDataTableToDownload({
      type,
      dataTable: result.dataTable,
      exporter,
      DownloadClass,
      showGenerationLoadingStatus,
    });
    setGenerationStatus(`Download ready: ${filename} (${result.dataTable.getRowCount()} combinations)`);
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
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
  generateGeneratorCombinationsDataFile,
};
