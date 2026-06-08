import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as appTestDataControllerExports from '../../../../js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js';
import { createTestDataGenerationPanelManager } from '../../../../js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js';

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

  test('controller module keeps both runtime mount and non-runtime manager helpers available', () => {
    expect(typeof appTestDataControllerExports.mountTestDataGenerationPanel).toBe('function');
    expect(typeof appTestDataControllerExports.createTestDataGenerationPanelManager).toBe('function');
  });

  test('mounts the data population panel and wires generation actions through the shared adapter', () => {
    const updatePairwiseButtonVisibility = jest.fn();
    const generateTestData = jest.fn();
    const generateCombinationsTestData = jest.fn();
    const combinationsDialog = {
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const initializeSchemaErrorDisplayFn = jest.fn();
    const identifyFakerCommandsFn = jest.fn();
    const uiStatusService = {
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus: jest.fn(),
      clearPendingTestDataStatusReset: jest.fn(),
      scheduleTestDataStatusReset: jest.fn(),
      destroy: jest.fn(),
    };
    const createTestDataUiStatusServiceFn = jest.fn(() => uiStatusService);
    const generationServiceOptions = [];
    const createTestDataGenerationServiceFn = jest.fn(() => ({
      updatePairwiseButtonVisibility,
      generateTestData,
      generateCombinationsTestData,
      countEnumColumns: jest.fn(() => 2),
      getEnumValueCounts: jest.fn(() => [3, 2]),
    }));
    const panel = {
      destroy: jest.fn(),
      getMode: jest.fn(() => 'amend-selected'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue: jest.fn(),
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };
    createTestDataGenerationServiceFn.mockImplementation((options) => {
      generationServiceOptions.push(options);
      return {
        updatePairwiseButtonVisibility,
        generateTestData,
        generateCombinationsTestData,
        countEnumColumns: jest.fn(() => 2),
        getEnumValueCounts: jest.fn(() => [3, 2]),
      };
    });
    const createDataPopulationPanelComponentFn = jest.fn(({ callbacks }) => {
      panel.callbacks = callbacks;
      return panel;
    });

    const control = createTestDataGenerationPanelManager({
      documentObj: document,
      initializeSchemaErrorDisplayFn,
      identifyFakerCommandsFn,
      createTestDataGenerationServiceFn,
      createDataPopulationPanelComponentFn,
      createTestDataUiStatusServiceFn,
      createCombinationsDialogComponentFn: jest.fn(() => combinationsDialog),
    });

    const importer = { setGridFromGenericDataTable: jest.fn() };
    const textPreviewRenderer = { renderTextFromGrid: jest.fn() };
    const mainGridExtras = { getRowCount: jest.fn(() => 2) };

    const state = control.mountTestDataGenerationPanel('host', importer, textPreviewRenderer, mainGridExtras);

    expect(identifyFakerCommandsFn).toHaveBeenCalledTimes(1);
    expect(initializeSchemaErrorDisplayFn).toHaveBeenCalledTimes(1);
    expect(initializeSchemaErrorDisplayFn).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaTextTokens: [],
      }),
      expect.objectContaining({
        documentObj: document,
        getSchemaErrorElement: expect.any(Function),
      })
    );
    expect(createTestDataUiStatusServiceFn).toHaveBeenCalledWith(
      expect.objectContaining({
        documentObj: document,
        windowObj: window,
        getStatusElement: expect.any(Function),
      })
    );
    expect(createTestDataGenerationServiceFn).toHaveBeenCalledTimes(1);
    expect(createDataPopulationPanelComponentFn).toHaveBeenCalledTimes(1);
    expect(createDataPopulationPanelComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        root: document.getElementById('host'),
        props: expect.objectContaining({
          selectedMode: 'new-table',
          pairwiseVisible: false,
          rowCountProps: expect.objectContaining({
            value: 1,
          }),
        }),
      })
    );

    panel.callbacks.onGenerate();
    panel.callbacks.onGeneratePairwise();

    expect(generateTestData).toHaveBeenCalledTimes(1);
    expect(combinationsDialog.open).toHaveBeenCalledWith({ enumColumnCount: 2, enumValueCounts: [3, 2] });

    expect(state.importer).toBe(importer);
    expect(state.textPreviewRenderer).toBe(textPreviewRenderer);
    expect(state.mainGridExtras).toBe(mainGridExtras);
    expect(state.dataPopulationPanel).toBe(panel);
    expect(control.getState()).toBe(state);
    expect(generationServiceOptions[0].getGenerationMode()).toBe('amend-selected');
    generationServiceOptions[0].setTestDataStatus('done');
    generationServiceOptions[0].setTestDataLoadingStatus('loading');
    expect(uiStatusService.setTestDataStatus).toHaveBeenCalledWith('done');
    expect(uiStatusService.setTestDataLoadingStatus).toHaveBeenCalledWith('loading');
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

    const control = createTestDataGenerationPanelManager({
      documentObj: document,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn: jest.fn(() => ({
        updatePairwiseButtonVisibility: jest.fn(),
        generateTestData: jest.fn(),
        generatePairwiseTestData: jest.fn(),
      })),
      createDataPopulationPanelComponentFn,
    });

    control.mountTestDataGenerationPanel(
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

  test('exposes the component-oriented mount API on the returned control', () => {
    const control = createTestDataGenerationPanelManager({
      documentObj: document,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn: jest.fn(() => ({
        updatePairwiseButtonVisibility: jest.fn(),
        generateTestData: jest.fn(),
        generatePairwiseTestData: jest.fn(),
      })),
      createDataPopulationPanelComponentFn: jest.fn(() => ({
        destroy: jest.fn(),
        getMode: jest.fn(() => 'new-table'),
        setPairwiseVisible: jest.fn(),
        setRowCountValue: jest.fn(),
      })),
    });

    expect(typeof control.mountTestDataGenerationPanel).toBe('function');
  });

  test('prefers an injected RandExpClass over the ambient global for generation and schema props', () => {
    const injectedRandExpClass = function InjectedRandExp() {};
    const ambientRandExpClass = function AmbientRandExp() {};
    global.RandExp = ambientRandExpClass;

    const createTestDataGenerationServiceFn = jest.fn(() => ({
      updatePairwiseButtonVisibility: jest.fn(),
      generateTestData: jest.fn(),
      generatePairwiseTestData: jest.fn(),
    }));
    const createDataPopulationPanelComponentFn = jest.fn(() => ({
      destroy: jest.fn(),
      getMode: jest.fn(() => 'new-table'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue: jest.fn(),
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    }));

    const control = createTestDataGenerationPanelManager({
      documentObj: document,
      RandExpClass: injectedRandExpClass,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn,
      createDataPopulationPanelComponentFn,
    });

    control.mountTestDataGenerationPanel('host', {}, {}, { getRowCount: jest.fn(() => 1) });

    expect(createTestDataGenerationServiceFn).toHaveBeenCalledWith(
      expect.objectContaining({
        RandExp: injectedRandExpClass,
      })
    );
    expect(createDataPopulationPanelComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          schemaDefinitionProps: expect.objectContaining({
            RandExp: injectedRandExpClass,
          }),
        }),
      })
    );
  });

  test('keeps generation status, requested row count, and pairwise visibility isolated across documents', () => {
    const domA = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
    const domB = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');

    const statusA = jest.fn();
    const loadingA = jest.fn();
    const statusB = jest.fn();
    const loadingB = jest.fn();
    const panelA = {
      destroy: jest.fn(),
      getMode: jest.fn(() => 'new-table'),
      getRowCountInputValue: jest.fn(() => '2'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue: jest.fn(),
      setGenerateBusy: jest.fn(),
      setGeneratePairwiseBusy: jest.fn(),
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };
    const panelB = {
      destroy: jest.fn(),
      getMode: jest.fn(() => 'new-table'),
      getRowCountInputValue: jest.fn(() => '9'),
      setPairwiseVisible: jest.fn(),
      setRowCountValue: jest.fn(),
      setGenerateBusy: jest.fn(),
      setGeneratePairwiseBusy: jest.fn(),
      validateSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncSchemaTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };
    const generationServiceOptions = [];
    const createTestDataGenerationServiceFn = jest.fn((options) => {
      generationServiceOptions.push(options);
      return {
        updatePairwiseButtonVisibility: jest.fn(),
        generateTestData: jest.fn(),
        generatePairwiseTestData: jest.fn(),
      };
    });

    const controlA = createTestDataGenerationPanelManager({
      documentObj: domA.window.document,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn,
      setTestDataStatusFn: statusA,
      setTestDataLoadingStatusFn: loadingA,
      createDataPopulationPanelComponentFn: jest.fn(() => panelA),
    });
    const controlB = createTestDataGenerationPanelManager({
      documentObj: domB.window.document,
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
      createTestDataGenerationServiceFn,
      setTestDataStatusFn: statusB,
      setTestDataLoadingStatusFn: loadingB,
      createDataPopulationPanelComponentFn: jest.fn(() => panelB),
    });

    controlA.mountTestDataGenerationPanel('host', {}, {}, { getRowCount: jest.fn(() => 2) });
    controlB.mountTestDataGenerationPanel('host', {}, {}, { getRowCount: jest.fn(() => 9) });

    expect(generationServiceOptions).toHaveLength(2);

    generationServiceOptions[0].setTestDataStatus('done A');
    generationServiceOptions[1].setTestDataLoadingStatus('loading B');
    generationServiceOptions[0].setPairwiseVisible(true);
    generationServiceOptions[1].setPairwiseVisible(false);

    expect(statusA).toHaveBeenCalledWith('done A');
    expect(statusB).not.toHaveBeenCalled();
    expect(loadingB).toHaveBeenCalledWith('loading B');
    expect(loadingA).not.toHaveBeenCalled();
    expect(generationServiceOptions[0].getRequestedRowCount()).toBe('2');
    expect(generationServiceOptions[1].getRequestedRowCount()).toBe('9');
    expect(panelA.setPairwiseVisible).toHaveBeenCalledWith(true);
    expect(panelB.setPairwiseVisible).toHaveBeenCalledWith(false);

    domA.window.close();
    domB.window.close();
  });

  test('mount is a safe no-op when no document is available', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const generationServiceOptions = [];
      const createDataPopulationPanelComponentFn = jest.fn();
      const control = createTestDataGenerationPanelManager({
        initializeSchemaErrorDisplayFn: jest.fn(),
        identifyFakerCommandsFn: jest.fn(),
        createTestDataGenerationServiceFn: jest.fn((options) => {
          generationServiceOptions.push(options);
          return {
            updatePairwiseButtonVisibility: jest.fn(),
            generateTestData: jest.fn(),
            generatePairwiseTestData: jest.fn(),
          };
        }),
        createDataPopulationPanelComponentFn,
      });

      const state = control.mountTestDataGenerationPanel('host', {}, {}, {});

      expect(createDataPopulationPanelComponentFn).not.toHaveBeenCalled();
      expect(state.dataPopulationPanel).toBeNull();
      expect(generationServiceOptions[0].getGenerationMode()).toBe('new-table');
    } finally {
      global.document = originalDocument;
    }
  });
});
