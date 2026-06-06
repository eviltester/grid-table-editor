import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeActionsBridge } from '../../../js/gui_components/generator/runtime/generator-runtime-actions-bridge.js';

describe('generator runtime actions bridge', () => {
  test('routes apply, preview, generation, and pairwise visibility through focused runtime dependencies', async () => {
    const viewState = {
      getSelectedOutputType: jest.fn(() => 'json'),
      syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
      renderOutputPreviewForCurrentSelection: jest.fn(),
      setGenerationStatus: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
      getPreviewRowCount: jest.fn(() => ({ value: 2, valid: true, errors: [] })),
      getGenerateRowCount: jest.fn(() => ({ value: 3, valid: true, errors: [] })),
      setPreviewDataTable: jest.fn(),
      clearGenerationStatus: jest.fn(),
      setGenerationButtonsBusy: jest.fn(),
      showGenerationLoadingStatus: jest.fn(),
      setPairwiseVisible: jest.fn(),
    };
    const schemaRuntime = {
      surfacePageError: jest.fn(),
      clearSchemaErrorStatus: jest.fn(),
    };
    const configuredGenerator = {
      generator: {
        id: 'generator',
        generateHeadersArray: jest.fn(() => ['City']),
        generateRow: jest.fn(() => ({ City: 'London' })),
      },
      errors: [],
    };
    const schemaGeneration = {
      createConfiguredGenerator: jest.fn(() => configuredGenerator),
      countEnumColumns: jest.fn(() => 1),
      getPairwiseVisibility: jest.fn(({ getCurrentSchemaState }) => {
        const currentState = getCurrentSchemaState();
        return currentState.rows.length > 0 && currentState.errors.length === 0;
      }),
    };
    const schemaState = {
      getCurrentSchemaState: jest.fn(() => ({ rows: [{ sourceType: 'enum' }], errors: [] })),
    };
    const exporter = {
      canExport: jest.fn(() => true),
      getDataTableAsAsync: jest.fn(async (type, dataTable, progressCallback) => {
        progressCallback?.(`Formatting ${type}`);
        return `${type}:async:${dataTable.getRowCount()}`;
      }),
      getDataTableAs: jest.fn((type, dataTable) => `${type}:sync:${dataTable.getRowCount()}`),
      getFileExtensionFor: jest.fn(() => '.json'),
      setOptionsForType: jest.fn(),
    };
    const DownloadClass = class FakeDownload {
      constructor(filename) {
        this.filename = filename;
      }

      downloadFile(text) {
        FakeDownload.lastDownload = { filename: this.filename, text };
      }
    };

    const bridge = createGeneratorRuntimeActionsBridge({
      getCurrentSelectedType: () => viewState.getSelectedOutputType(),
      getExporter: () => exporter,
      getDownloadClass: () => DownloadClass,
      getFaker: () => ({}),
      getRandExp: () => function RandExp() {},
      getViewState: () => viewState,
      getSchemaRuntime: () => schemaRuntime,
      getSchemaGeneration: () => schemaGeneration,
      getSchemaState: () => schemaState,
    });

    const applyResult = bridge.applyCurrentTypeOptions({
      outputFormat: 'json',
      options: { prettyPrint: true },
    });
    expect(applyResult?.resolvedType).toBe('json');
    expect(viewState.syncGeneratorControlsFormatStateIfChanged).toHaveBeenCalledWith('json', 'json');
    expect(viewState.renderOutputPreviewForCurrentSelection).toHaveBeenCalled();
    expect(viewState.setGenerationStatus).toHaveBeenCalledWith('JSON options applied.');

    bridge.previewData();
    expect(schemaGeneration.createConfiguredGenerator).toHaveBeenCalled();
    expect(viewState.setPreviewDataTable).toHaveBeenCalled();

    await bridge.generateDataFile();
    expect(viewState.getGenerateRowCount).toHaveBeenCalled();
    expect(viewState.setGenerationButtonsBusy).toHaveBeenCalledWith(true);
    expect(DownloadClass.lastDownload).toEqual({
      filename: 'generated-data.json',
      text: 'json:async:3',
    });

    await bridge.generateAllPairsDataFile();
    expect(schemaGeneration.countEnumColumns).toHaveBeenCalled();
    expect(schemaRuntime.surfacePageError).toHaveBeenCalledWith(
      'Pairwise generation requires at least 2 enum columns.',
      undefined
    );

    const pairwiseVisible = bridge.updateAllPairsButtonVisibility();
    expect(pairwiseVisible).toBe(true);
    expect(schemaState.getCurrentSchemaState).toHaveBeenCalledTimes(1);
    expect(schemaGeneration.getPairwiseVisibility).toHaveBeenCalled();
    expect(viewState.setPairwiseVisible).toHaveBeenCalledWith(true);
  });
});
