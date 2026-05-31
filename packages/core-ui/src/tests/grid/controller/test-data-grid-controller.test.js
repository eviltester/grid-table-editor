import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTestDataGridControl } from '../../../../js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js';

describe('test data grid controller', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
    global.RandExp = function RandExp() {};
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
    delete global.RandExp;
  });

  test('mounts the data population panel and wires generation actions through the shared adapter', () => {
    const updatePairwiseButtonVisibility = jest.fn();
    const generateTestData = jest.fn();
    const generatePairwiseTestData = jest.fn();
    const refreshTestDataPreview = jest.fn();
    const initializeSchemaErrorDisplayFn = jest.fn();
    const identifyFakerCommandsFn = jest.fn();
    const createTestDataGenerationServiceFn = jest.fn(() => ({
      updatePairwiseButtonVisibility,
      generateTestData,
      generatePairwiseTestData,
      refreshTestDataPreview,
    }));
    const panel = {
      destroy: jest.fn(),
      getMode: jest.fn(() => 'new-table'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue: jest.fn(),
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };
    const createDataPopulationPanelComponentFn = jest.fn(({ callbacks }) => {
      panel.callbacks = callbacks;
      return panel;
    });

    const control = createTestDataGridControl({
      documentObj: document,
      initializeSchemaErrorDisplayFn,
      identifyFakerCommandsFn,
      createTestDataGenerationServiceFn,
      createDataPopulationPanelComponentFn,
    });

    const importer = { setGridFromGenericDataTable: jest.fn() };
    const textPreviewRenderer = { renderTextFromGrid: jest.fn() };
    const mainGridExtras = { getRowCount: jest.fn(() => 2) };

    const state = control.enableTestDataGenerationInterface('host', importer, textPreviewRenderer, mainGridExtras);

    expect(identifyFakerCommandsFn).toHaveBeenCalledTimes(1);
    expect(initializeSchemaErrorDisplayFn).toHaveBeenCalledTimes(1);
    expect(createTestDataGenerationServiceFn).toHaveBeenCalledTimes(1);
    expect(createDataPopulationPanelComponentFn).toHaveBeenCalledTimes(1);
    expect(createDataPopulationPanelComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        root: document.getElementById('host'),
        props: expect.objectContaining({
          selectedMode: 'new-table',
          pairwiseVisible: false,
          rowCountProps: expect.objectContaining({
            inputId: 'generateCount',
            value: 1,
          }),
        }),
      })
    );

    panel.callbacks.onGenerate();
    panel.callbacks.onGeneratePairwise();
    panel.callbacks.onRefreshPreview();

    expect(generateTestData).toHaveBeenCalledTimes(1);
    expect(generatePairwiseTestData).toHaveBeenCalledTimes(1);
    expect(refreshTestDataPreview).toHaveBeenCalledTimes(1);

    expect(state.importer).toBe(importer);
    expect(state.textPreviewRenderer).toBe(textPreviewRenderer);
    expect(state.mainGridExtras).toBe(mainGridExtras);
    expect(state.dataPopulationPanel).toBe(panel);
    expect(control.getState()).toBe(state);
  });

  test('updates row count defaults when the mounted panel changes mode', () => {
    const setRowCountValue = jest.fn();
    const panel = {
      destroy: jest.fn(),
      getMode: jest.fn(() => 'new-table'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue,
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };
    const createDataPopulationPanelComponentFn = jest.fn(({ callbacks }) => {
      panel.callbacks = callbacks;
      return panel;
    });

    const control = createTestDataGridControl({
      documentObj: document,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn: jest.fn(() => ({
        updatePairwiseButtonVisibility: jest.fn(),
        generateTestData: jest.fn(),
        generatePairwiseTestData: jest.fn(),
        refreshTestDataPreview: jest.fn(),
      })),
      createDataPopulationPanelComponentFn,
    });

    control.enableTestDataGenerationInterface(
      'host',
      {},
      {},
      {
        getRowCount: jest.fn(() => 7),
        getSelectedRowIndexes: jest.fn(() => [3, 5, 8]),
      }
    );

    panel.callbacks.onModeChange('amend-table');
    panel.callbacks.onModeChange('amend-selected');

    expect(setRowCountValue).toHaveBeenNthCalledWith(1, 7);
    expect(setRowCountValue).toHaveBeenNthCalledWith(2, 3);
  });
});
