/*
 * Responsibilities:
 * - Generator-page preview/export workflows and pairwise eligibility checks.
 * - Keeps generator shell responsibilities thin while delegating execution to the shared generation engine.
 */

import { applyExportTextEncoding } from '@anywaydata/core';
import { isNWiseEligibleForSchemaRows } from '../../shared/test-data/generation/ui-derived-state.js';
import {
  presentUiGenerationNotice,
  presentUiGenerationResult,
} from '../../shared/test-data/generation/ui-generation-status-presenter.js';
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

function surfaceGenerationResult({ operationKind, result, surfacePageError, setGenerationStatus, filename = '' }) {
  const presentation = presentUiGenerationResult({
    surface: 'generator',
    operationKind,
    result,
    filename,
  });

  if (presentation.schemaMessage) {
    surfacePageError(presentation.schemaMessage, { useSchemaStatus: true });
  }

  if (presentation.statusMessage) {
    setGenerationStatus?.(presentation.statusMessage, presentation.statusOptions || undefined);
  }
}

function previewGeneratorData({
  getPreviewRowCount,
  schemaGenerationService,
  setPreviewDataTable,
  clearOutputPreview,
  renderOutputPreviewForCurrentSelection,
  surfacePageError,
  clearPageError,
  recordLastUsedSchema = () => null,
}) {
  function applyResult(result) {
    if (!result?.ok) {
      setPreviewDataTable?.(null);
      clearOutputPreview?.();
      surfaceGenerationResult({
        operationKind: 'generateRows',
        result: result || {},
        surfacePageError,
      });
      return;
    }

    clearPageError?.();
    setPreviewDataTable?.(result.dataTable);
    renderOutputPreviewForCurrentSelection();
    void recordLastUsedSchemaSafely(recordLastUsedSchema);
  }

  const rowCount = getPreviewRowCount();
  if (rowCount.errors.length > 0) {
    setPreviewDataTable?.(null);
    clearOutputPreview?.();
    surfacePageError(rowCount.errors.join('\n'));
    return;
  }

  const result = schemaGenerationService?.generateRows?.({ rowCount: rowCount.value });
  if (typeof result?.then === 'function') {
    return result.then(applyResult);
  }

  return applyResult(result);
}

async function recordLastUsedSchemaSafely(recordLastUsedSchema) {
  try {
    await Promise.resolve(recordLastUsedSchema?.());
  } catch (error) {
    console.error('Failed to record last used schema.', error);
  }
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
  recordLastUsedSchema = () => null,
}) {
  const rowCount = getGenerateRowCount();
  if (rowCount.errors.length > 0) {
    surfacePageError(rowCount.errors.join('\n'));
    return;
  }

  const result = await schemaGenerationService?.generateRows?.({ rowCount: rowCount.value });
  if (!result?.ok) {
    surfaceGenerationResult({
      operationKind: 'generateRows',
      result: result || {},
      surfacePageError,
      setGenerationStatus,
    });
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
    await recordLastUsedSchemaSafely(recordLastUsedSchema);
    const presentation = presentUiGenerationResult({
      surface: 'generator',
      operationKind: 'generateRows',
      result,
      filename,
    });
    setGenerationStatus(presentation.statusMessage);
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
  recordLastUsedSchema = () => null,
}) {
  const result = schemaGenerationService?.generatePairwise?.();
  if (!result?.ok) {
    surfaceGenerationResult({
      operationKind: 'generatePairwise',
      result: result || {},
      surfacePageError,
      setGenerationStatus,
    });
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
    await recordLastUsedSchemaSafely(recordLastUsedSchema);
    const presentation = presentUiGenerationResult({
      surface: 'generator',
      operationKind: 'generatePairwise',
      result,
      filename,
    });
    setGenerationStatus(presentation.statusMessage);
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
  recordLastUsedSchema = () => null,
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
    const presentation = presentUiGenerationNotice({
      noticeKind: 'cartesianSkipped',
      surface: 'generator',
    });
    setGenerationStatus(presentation.statusMessage, presentation.statusOptions);
    return;
  }

  const result = schemaGenerationService?.generateCombinations?.({ strength, algorithm });
  if (!result?.ok) {
    surfaceGenerationResult({
      operationKind: 'generateCombinations',
      result: result || {},
      surfacePageError,
      setGenerationStatus,
    });
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
    await recordLastUsedSchemaSafely(recordLastUsedSchema);
    const presentation = presentUiGenerationResult({
      surface: 'generator',
      operationKind: 'generateCombinations',
      result,
      filename,
    });
    setGenerationStatus(presentation.statusMessage);
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
