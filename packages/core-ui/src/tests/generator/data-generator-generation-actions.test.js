import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorSchemaGenerationService } from '../../../js/gui_components/generator/generation/generator-schema-generation-service.js';
import {
  generateGeneratorCombinationsDataFile,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
  previewGeneratorData,
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
} from '../../../js/gui_components/generator/generation/data-generator-generation-actions.js';

describe('generator generation actions', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="generateAllPairsButtonWrapper"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('schema-generation service resolves through its direct module', () => {
    expect(typeof createGeneratorSchemaGenerationService).toBe('function');
  });

  test('updateGeneratorPairwiseButtonVisibility hides wrapper for invalid schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      syncSchemaRowsFromTextMode: () => ({ rows: [{ sourceType: 'enum', value: 'a,b' }], errors: ['bad'] }),
      validateSchemaRows: () => ({ rows: [], errors: [] }),
    });

    expect(isVisible).toBe(false);
  });

  test('updateGeneratorPairwiseButtonVisibility returns true for pairwise-eligible schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      syncSchemaRowsFromTextMode: () => ({
        rows: [
          { sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
        errors: [],
      }),
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
    });

    expect(isVisible).toBe(true);
  });

  test('renderGeneratorOutputPreview writes through the injected preview setter only', () => {
    const setOutputPreviewText = jest.fn();
    const exporter = {
      canExport: jest.fn(() => true),
      getDataTableAs: jest.fn(() => 'json:sync:2'),
    };
    const fakeDataTable = { getRowCount: () => 2 };

    renderGeneratorOutputPreview({
      getSelectedOutputType: () => 'json',
      getPreviewDataTable: () => fakeDataTable,
      exporter,
      setOutputPreviewText,
    });

    expect(setOutputPreviewText).toHaveBeenCalledWith('json:sync:2');
  });

  test('previewGeneratorData records last used schema after a successful preview', () => {
    const recordLastUsedSchema = jest.fn();

    previewGeneratorData({
      getPreviewRowCount: () => ({ value: 2, errors: [] }),
      schemaGenerationService: {
        generateRows: () => ({
          ok: true,
          dataTable: { getRowCount: () => 2 },
        }),
      },
      setPreviewDataTable: jest.fn(),
      clearOutputPreview: jest.fn(),
      renderOutputPreviewForCurrentSelection: jest.fn(),
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      recordLastUsedSchema,
    });

    expect(recordLastUsedSchema).toHaveBeenCalledTimes(1);
  });

  test('previewGeneratorData ignores synchronous last-used persistence failures after a successful preview', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const setPreviewDataTable = jest.fn();
    const renderOutputPreviewForCurrentSelection = jest.fn();

    previewGeneratorData({
      getPreviewRowCount: () => ({ value: 2, errors: [] }),
      schemaGenerationService: {
        generateRows: () => ({
          ok: true,
          dataTable: { getRowCount: () => 2 },
        }),
      },
      setPreviewDataTable,
      clearOutputPreview: jest.fn(),
      renderOutputPreviewForCurrentSelection,
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      recordLastUsedSchema: () => {
        throw new Error('storage failed');
      },
    });

    await Promise.resolve();

    expect(setPreviewDataTable).toHaveBeenCalledTimes(1);
    expect(renderOutputPreviewForCurrentSelection).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to record last used schema.',
      expect.objectContaining({ message: 'storage failed' })
    );
  });

  test('previewGeneratorData clears stale preview surfaces when generation is blocked', () => {
    const setPreviewDataTable = jest.fn();
    const clearOutputPreview = jest.fn();
    const surfacePageError = jest.fn();

    previewGeneratorData({
      getPreviewRowCount: () => ({ value: 2, errors: [] }),
      schemaGenerationService: {
        generateRows: () => ({
          ok: false,
          errors: [{ code: 'compiler_validation_error', message: 'Bad params' }],
        }),
      },
      setPreviewDataTable,
      clearOutputPreview,
      renderOutputPreviewForCurrentSelection: jest.fn(),
      surfacePageError,
      clearPageError: jest.fn(),
    });

    expect(setPreviewDataTable).toHaveBeenCalledWith(null);
    expect(clearOutputPreview).toHaveBeenCalledTimes(1);
    expect(surfacePageError).toHaveBeenCalledWith('Bad params', { useSchemaStatus: true });
  });

  test('updateGeneratorPairwiseButtonVisibility does not require a document object', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      getCurrentSchemaState: () => ({
        rows: [
          { sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
        errors: [],
      }),
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
    });

    expect(isVisible).toBe(true);
  });

  test('generateGeneratorDataFile applies export encoding settings only to downloads', async () => {
    const downloadFile = jest.fn();
    const recordLastUsedSchema = jest.fn();
    class FakeDownload {
      constructor(filename) {
        this.filename = filename;
      }

      downloadFile(text) {
        downloadFile({ filename: this.filename, text });
      }
    }

    await generateGeneratorDataFile({
      getGenerateRowCount: () => ({ value: 2, errors: [] }),
      schemaGenerationService: {
        generateRows: jest.fn(async () => ({
          ok: true,
          dataTable: {
            __generatorFilename: 'generated-data.csv',
            getRowCount: () => 1,
          },
        })),
      },
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
        getDataTableAs: () => 'Name\nAda',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus: jest.fn(),
      showGenerationLoadingStatus: jest.fn(),
      getExportEncodingSettings: () => ({ lineEnding: 'crlf', includeBom: true }),
      DownloadClass: FakeDownload,
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
      recordLastUsedSchema,
    });

    expect(recordLastUsedSchema).toHaveBeenCalledTimes(1);
    expect(downloadFile).toHaveBeenCalledWith({
      filename: 'generated-data.csv',
      text: '\uFEFFName\r\nAda',
    });
  });

  test('generateGeneratorDataFile ignores last-used persistence failures after a successful export', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const setGenerationStatus = jest.fn();

    await generateGeneratorDataFile({
      getGenerateRowCount: () => ({ value: 2, errors: [] }),
      schemaGenerationService: {
        generateRows: jest.fn(async () => ({
          ok: true,
          dataTable: {
            __generatorFilename: 'generated-data.csv',
            getRowCount: () => 1,
          },
        })),
      },
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
        getDataTableAs: () => 'Name\nAda',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus,
      showGenerationLoadingStatus: jest.fn(),
      getExportEncodingSettings: () => ({}),
      DownloadClass: class FakeDownload {
        constructor() {}
        downloadFile() {}
      },
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
      recordLastUsedSchema: jest.fn(() => Promise.reject(new Error('storage failed'))),
    });

    expect(setGenerationStatus).toHaveBeenCalledWith('Download ready: generated-data.csv');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to record last used schema.',
      expect.objectContaining({ message: 'storage failed' })
    );
  });

  test('generateGeneratorCombinationsDataFile prompts before large cartesian runs and skips when cancelled', async () => {
    const requestConfirm = jest.fn(async () => false);
    const setGenerationStatus = jest.fn();

    await generateGeneratorCombinationsDataFile({
      schemaGenerationService: {
        getCombinationInput: () => ({ enumColumnCount: 4, enumValueCounts: [11, 11, 11, 11] }),
      },
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus,
      showGenerationLoadingStatus: jest.fn(),
      DownloadClass: class FakeDownload {},
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
      selection: { strength: 4, algorithm: 'cartesian-product' },
      requestConfirm,
    });

    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Cartesian product generation',
      message: expect.stringContaining('14,641'),
      okLabel: 'Run cartesian product',
      cancelLabel: 'Skip cartesian product',
    });
    expect(setGenerationStatus).toHaveBeenCalledWith('Cartesian product generation skipped.', {
      severity: 'warning',
      dismissable: true,
    });
  });

  test('generateGeneratorCombinationsDataFile records last used schema on success', async () => {
    const recordLastUsedSchema = jest.fn();

    await generateGeneratorCombinationsDataFile({
      schemaGenerationService: {
        getCombinationInput: () => ({ enumColumnCount: 3, enumValueCounts: [3, 2, 2] }),
        generateCombinations: () => ({
          ok: true,
          dataTable: {
            __generatorFilename: 'n-wise-combinations-data.csv',
            getRowCount: () => 1,
          },
        }),
      },
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
        getDataTableAs: () => 'data',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus: jest.fn(),
      showGenerationLoadingStatus: jest.fn(),
      DownloadClass: class FakeDownload {
        constructor() {}
        downloadFile() {}
      },
      surfacePageError: jest.fn(),
      clearPageError: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
      selection: { strength: 2, algorithm: 'greedy' },
      requestConfirm: jest.fn(async () => true),
      recordLastUsedSchema,
    });

    expect(recordLastUsedSchema).toHaveBeenCalledTimes(1);
  });

  test('generateGeneratorAllPairsDataFile rejects pairwise export before invoking session generation when fewer than two enum columns exist', async () => {
    const generatePairwise = jest.fn(() => ({
      ok: false,
      errors: [{ code: 'insufficient_enum_columns', message: 'Pairwise generation requires at least 2 enum columns.' }],
    }));
    const surfacePageError = jest.fn();

    await generateGeneratorAllPairsDataFile({
      schemaGenerationService: {
        generatePairwise,
      },
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
        getDataTableAs: () => 'Browser\nChrome',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus: jest.fn(),
      showGenerationLoadingStatus: jest.fn(),
      getExportEncodingSettings: () => ({}),
      DownloadClass: class FakeDownload {},
      surfacePageError,
      clearPageError: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
    });

    expect(generatePairwise).toHaveBeenCalledTimes(1);
    expect(surfacePageError).toHaveBeenCalledWith('Pairwise generation requires at least 2 enum columns.', {
      useSchemaStatus: true,
    });
  });
});
