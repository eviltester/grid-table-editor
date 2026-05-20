import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTestDataGridControl } from '../../../js/gui_components/app/test-data-grid/test-data-grid-control.js';

describe('test data grid control', () => {
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
  });

  test('creates isolated controller state and wires shared helpers', () => {
    const renderTestDataGenerationPanelFn = jest.fn(({ parentElem }) => {
      parentElem.innerHTML =
        '<textarea id="testdatadefntext"></textarea><input id="generateCount" /><button id="generatedata"></button><button id="generateallpairs"></button><button id="refreshtestdatapreview"></button>';
    });
    const bindPrimaryActionsFn = jest.fn();
    const bindGenerateCountInputFn = jest.fn();
    const bindModeRadiosFn = jest.fn();
    const bindSchemaTextareaSyncFn = jest.fn();
    const initializeSchemaErrorDisplayFn = jest.fn();
    const bindSchemaSampleShortcutFn = jest.fn(() => 'next-handler');
    const identifyFakerCommandsFn = jest.fn();
    const updateHelpHints = jest.fn();
    const createTestDataGrid = jest.fn();
    const createTestDataGenerationServiceFn = jest.fn(() => ({
      schemaErrorsToText: jest.fn(),
      updatePairwiseButtonVisibility: jest.fn(),
      generatePairwiseTestData: jest.fn(),
      generateTestData: jest.fn(),
      refreshTestDataPreview: jest.fn(),
    }));
    const createSchemaGridControllerFn = jest.fn(() => ({
      createTestDataGrid,
      populateGridFromTextSchema: jest.fn(),
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
    }));

    const control = createTestDataGridControl({
      documentObj: document,
      windowObj: { updateHelpHints },
      renderTestDataGenerationPanelFn,
      bindPrimaryActionsFn,
      bindGenerateCountInputFn,
      bindModeRadiosFn,
      bindSchemaTextareaSyncFn,
      initializeSchemaErrorDisplayFn,
      bindSchemaSampleShortcutFn,
      createTestDataGenerationServiceFn,
      createSchemaGridControllerFn,
      identifyFakerCommandsFn,
    });

    const importer = { setGridFromGenericDataTable: jest.fn() };
    const textPreviewRenderer = { renderTextFromGrid: jest.fn() };
    const mainGridExtras = { getRowCount: jest.fn(() => 2) };

    const state = control.enableTestDataGenerationInterface('host', importer, textPreviewRenderer, mainGridExtras);

    expect(identifyFakerCommandsFn).toHaveBeenCalledTimes(1);
    expect(renderTestDataGenerationPanelFn).toHaveBeenCalledTimes(1);
    expect(createTestDataGenerationServiceFn).toHaveBeenCalledTimes(1);
    expect(createSchemaGridControllerFn).toHaveBeenCalledTimes(1);
    expect(bindPrimaryActionsFn).toHaveBeenCalledTimes(1);
    expect(bindGenerateCountInputFn).toHaveBeenCalledTimes(1);
    expect(bindModeRadiosFn).toHaveBeenCalledTimes(1);
    expect(bindSchemaTextareaSyncFn).toHaveBeenCalledTimes(1);
    expect(initializeSchemaErrorDisplayFn).toHaveBeenCalledTimes(1);
    expect(bindSchemaSampleShortcutFn).toHaveBeenCalledTimes(1);
    expect(createTestDataGrid).toHaveBeenCalledTimes(1);
    expect(updateHelpHints).toHaveBeenCalledTimes(1);

    expect(state.importer).toBe(importer);
    expect(state.textPreviewRenderer).toBe(textPreviewRenderer);
    expect(state.mainGridExtras).toBe(mainGridExtras);
    expect(state.schemaSampleButtonClickHandler).toBe('next-handler');
    expect(control.getState()).toBe(state);
  });

  test('sample schema callback uses previous handler from same controller instance on re-enable', () => {
    const renderTestDataGenerationPanelFn = jest.fn(({ parentElem }) => {
      parentElem.innerHTML =
        '<textarea id="testdatadefntext"></textarea><input id="generateCount" /><button id="generatedata"></button><button id="generateallpairs"></button><button id="refreshtestdatapreview"></button>';
    });
    const bindSchemaSampleShortcutFn = jest
      .fn()
      .mockReturnValueOnce('first-handler')
      .mockReturnValueOnce('second-handler');
    const createTestDataGenerationServiceFn = jest.fn(() => ({
      schemaErrorsToText: jest.fn(),
      updatePairwiseButtonVisibility: jest.fn(),
      generatePairwiseTestData: jest.fn(),
      generateTestData: jest.fn(),
      refreshTestDataPreview: jest.fn(),
    }));
    const createSchemaGridControllerFn = jest.fn(() => ({
      createTestDataGrid: jest.fn(),
      populateGridFromTextSchema: jest.fn(),
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
    }));

    const control = createTestDataGridControl({
      documentObj: document,
      renderTestDataGenerationPanelFn,
      bindSchemaSampleShortcutFn,
      createTestDataGenerationServiceFn,
      createSchemaGridControllerFn,
      bindPrimaryActionsFn: jest.fn(),
      bindGenerateCountInputFn: jest.fn(),
      bindModeRadiosFn: jest.fn(),
      bindSchemaTextareaSyncFn: jest.fn(),
      initializeSchemaErrorDisplayFn: jest.fn(),
      identifyFakerCommandsFn: jest.fn(),
    });

    control.enableTestDataGenerationInterface('host', {}, {}, {});
    control.enableTestDataGenerationInterface('host', {}, {}, {});

    expect(bindSchemaSampleShortcutFn).toHaveBeenNthCalledWith(1, expect.objectContaining({ currentHandler: null }));
    expect(bindSchemaSampleShortcutFn).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ currentHandler: 'first-handler' })
    );
    expect(control.getState().schemaSampleButtonClickHandler).toBe('second-handler');
  });
});
