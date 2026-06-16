import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorSchemaGenerationService } from '../../../js/gui_components/generator/generation/generator-schema-generation-service.js';
import {
  generateGeneratorCombinationsDataFile,
  generateGeneratorDataFile,
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
      createConfiguredGenerator: () => ({
        generator: { generateHeadersArray: () => ['Name'], generateRow: () => ['Ada'] },
      }),
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
      buildDataTable: () => ({
        __generatorFilename: 'generated-data.csv',
        getRowCount: () => 1,
      }),
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

  test('generateGeneratorCombinationsDataFile prompts before large cartesian runs and skips when cancelled', async () => {
    const requestConfirm = jest.fn(async () => false);
    const setGenerationStatus = jest.fn();
    const buildCombinationsDataTable = jest.fn();

    await generateGeneratorCombinationsDataFile({
      createConfiguredGenerator: () => ({
        generator: { testDataRules: () => [{}, {}, {}, {}] },
      }),
      countEnumColumns: () => 4,
      getEnumValueCounts: () => [11, 11, 11, 11],
      getSelectedOutputType: () => 'csv',
      exporter: {
        canExport: () => true,
        getFileExtensionFor: () => '.csv',
      },
      clearGenerationStatus: jest.fn(),
      setGenerationButtonBusy: jest.fn(),
      setGenerationStatus,
      showGenerationLoadingStatus: jest.fn(),
      buildCombinationsDataTable,
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
    expect(buildCombinationsDataTable).not.toHaveBeenCalled();
    expect(setGenerationStatus).toHaveBeenCalledWith('Cartesian product generation skipped.', {
      severity: 'warning',
      dismissable: true,
    });
  });
});
