import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageService } from '../../../js/gui_components/generator/runtime/generator-page-service.js';

describe('createGeneratorPageService', () => {
  function createRuntime(overrides = {}) {
    const createBaseState = jest.fn(() => ({
      parentElement: { id: 'root' },
      documentObj: { id: 'document' },
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TestDataGeneratorClass: class FakeGenerator {},
      DownloadClass: class FakeDownload {},
      generatorViewState: {
        getSelectedOutputType: jest.fn(() => 'json'),
        syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
        getPreviewRowCount: jest.fn(() => ({ value: 3, valid: true, errors: [] })),
        getGenerateRowCount: jest.fn(() => ({ value: 9, valid: true, errors: [] })),
      },
      generatorRuntimeActions: {
        applyCurrentTypeOptions: jest.fn(() => ({ applied: true })),
        previewData: jest.fn(() => 'previewed'),
        generateDataFile: jest.fn(async () => 'generated'),
        generateAllPairsDataFile: jest.fn(async () => 'pairwise'),
        updateAllPairsButtonVisibility: jest.fn(() => false),
      },
      generatorSchemaState: {
        renderSchemaRows: jest.fn(),
      },
    }));
    const createSchemaServices = jest.fn(() => ({
      generatorSchemaDefinitionSupport: {
        mapRuleToRow: jest.fn((rule, index) => ({ rule, index })),
      },
      generatorSchemaRuntime: {
        showSchemaErrorStatus: jest.fn(),
        clearSchemaErrorStatus: jest.fn(),
      },
    }));
    const createViewState = jest.fn(() => ({
      getSelectedOutputType: jest.fn(() => 'json'),
      syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
      getPreviewRowCount: jest.fn(() => ({ value: 3, valid: true, errors: [] })),
      getGenerateRowCount: jest.fn(() => ({ value: 9, valid: true, errors: [] })),
    }));
    const createRuntimeActions = jest.fn(() => ({
      applyCurrentTypeOptions: jest.fn(() => ({ applied: true })),
      previewData: jest.fn(() => 'previewed'),
      generateDataFile: jest.fn(async () => 'generated'),
      generateAllPairsDataFile: jest.fn(async () => 'pairwise'),
      updateAllPairsButtonVisibility: jest.fn(() => false),
    }));
    const createPageRuntimeMount = jest.fn(() => ({
      generatorPage: {
        destroy: jest.fn(),
      },
      generatorControls: { id: 'controls' },
    }));
    const assertPageMountable = jest.fn();
    const defineSchemaState = jest.fn((runtime, { getPageService }) => {
      Object.defineProperties(runtime, {
        schemaRows: {
          configurable: true,
          get() {
            return getPageService().generatorSchemaState.rows;
          },
          set(value) {
            getPageService().generatorSchemaState.rows = value;
          },
        },
        schemaTextTokens: {
          configurable: true,
          get() {
            return getPageService().generatorSchemaState.tokens;
          },
          set(value) {
            getPageService().generatorSchemaState.tokens = value;
          },
        },
        isTextMode: {
          configurable: true,
          get() {
            return getPageService().generatorSchemaState.textMode;
          },
          set(value) {
            getPageService().generatorSchemaState.textMode = value;
          },
        },
      });
    });

    const runtime = createGeneratorPageService({
      options: { parentElement: { id: 'root' } },
      schemaTextToDataRules: jest.fn(),
      schemaRowsToSpec: jest.fn(),
      schemaRowsToSpecWithTokens: jest.fn(),
      validateSchemaRows: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      sampleSchemaText: 'Name\nliteral(x)',
      createBaseState,
      createSchemaServices,
      createViewState,
      createRuntimeActions,
      createPageRuntimeMount,
      assertPageMountable,
      defineSchemaState,
      ...overrides,
    });

    return {
      runtime,
      createBaseState,
      createSchemaServices,
      createViewState,
      createRuntimeActions,
      createPageRuntimeMount,
      assertPageMountable,
      defineSchemaState,
    };
  }

  test('builds the runtime from base state, dependencies, and schema state wiring', () => {
    const schemaTextToDataRules = jest.fn();
    const schemaRowsToSpec = jest.fn();
    const schemaRowsToSpecWithTokens = jest.fn();
    const validateSchemaRows = jest.fn();
    const dataRulesToSchemaText = jest.fn();
    const createUnavailableRowCountResult = jest.fn(() => ({ value: 0, valid: false, errors: ['missing'] }));
    const createSchemaServices = jest.fn(() => ({
      generatorSchemaDefinitionSupport: {
        mapRuleToRow: jest.fn((rule, index) => ({ id: `${rule}-${index}` })),
      },
      generatorSchemaState: {
        rows: [],
        tokens: [],
        textMode: false,
        renderSchemaRows: jest.fn(),
      },
    }));
    const createViewState = jest.fn(() => ({
      getSelectedOutputType: jest.fn(() => 'json'),
      syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
      getPreviewRowCount: jest.fn(() => ({ value: 3, valid: true, errors: [] })),
      getGenerateRowCount: jest.fn(() => ({ value: 9, valid: true, errors: [] })),
    }));
    const createRuntimeActions = jest.fn(() => ({
      applyCurrentTypeOptions: jest.fn(() => ({ applied: true })),
      previewData: jest.fn(() => 'previewed'),
      generateDataFile: jest.fn(async () => 'generated'),
      generateAllPairsDataFile: jest.fn(async () => 'pairwise'),
      updateAllPairsButtonVisibility: jest.fn(() => false),
    }));
    const defineSchemaState = jest.fn((runtime, { getPageService }) => {
      Object.defineProperty(runtime, 'schemaRows', {
        configurable: true,
        get() {
          return getPageService().generatorSchemaState.rows;
        },
        set(value) {
          getPageService().generatorSchemaState.rows = value;
        },
      });
    });

    const runtime = createGeneratorPageService({
      options: { parentElement: { id: 'root' } },
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText: 'Name\nliteral(x)',
      createBaseState: () => ({
        parentElement: { id: 'root' },
        faker: { word: { noun: () => 'x' } },
        RandExp: function RandExp() {},
        TestDataGeneratorClass: class FakeGenerator {},
        DownloadClass: class FakeDownload {},
      }),
      createSchemaServices,
      createViewState,
      createRuntimeActions,
      defineSchemaState,
      createUnavailableRowCountResult,
    });

    expect(createSchemaServices).toHaveBeenCalledWith(
      expect.objectContaining({
        runtime,
        schemaTextToDataRules,
        schemaRowsToSpec,
        schemaRowsToSpecWithTokens,
        validateSchemaRows,
        dataRulesToSchemaText,
        sampleSchemaText: 'Name\nliteral(x)',
      })
    );

    expect(createViewState).toHaveBeenCalledWith({
      runtime,
      createUnavailableRowCountResult,
    });
    expect(createRuntimeActions).toHaveBeenCalledWith({
      runtime,
      DownloadClass: runtime.DownloadClass,
      faker: runtime.faker,
      RandExp: runtime.RandExp,
    });

    const dependencyArgs = createSchemaServices.mock.calls[0][0];
    expect(dependencyArgs.mapRuleToRow('rule', 2)).toEqual({ id: 'rule-2' });
    expect(defineSchemaState).toHaveBeenCalledWith(runtime, {
      getPageService: expect.any(Function),
    });

    runtime.schemaRows = [{ id: 'row-1' }];
    expect(runtime.schemaRows).toEqual([{ id: 'row-1' }]);
  });

  test('exposes the page-facing runtime api over view state, actions, and mounted lifecycle', async () => {
    const { runtime, createPageRuntimeMount, assertPageMountable } = createRuntime();

    expect(runtime.getSelectedOutputType()).toBe('json');
    expect(runtime.syncGeneratorControlsFormatStateIfChanged('csv', 'json')).toBe(true);
    expect(runtime.applyCurrentTypeOptions({ outputFormat: 'csv' })).toEqual({ applied: true });
    expect(runtime.getPreviewRowCount()).toEqual({ value: 3, valid: true, errors: [] });
    expect(runtime.getGenerateRowCount()).toEqual({ value: 9, valid: true, errors: [] });
    expect(runtime.previewData()).toBe('previewed');
    expect(runtime.updateAllPairsButtonVisibility()).toBe(false);

    runtime.renderSchemaRows();
    await runtime.generateDataFile();
    await runtime.generateAllPairsDataFile();
    runtime.init();
    runtime.destroy();

    expect(runtime.generatorSchemaState.renderSchemaRows).toHaveBeenCalledTimes(1);
    expect(runtime.generatorRuntimeActions.generateDataFile).toHaveBeenCalledTimes(1);
    expect(runtime.generatorRuntimeActions.generateAllPairsDataFile).toHaveBeenCalledTimes(1);
    expect(assertPageMountable).toHaveBeenCalledWith(runtime);
    expect(createPageRuntimeMount).toHaveBeenCalledWith({
      runtime,
    });
    expect(runtime.generatorPage.destroy).toHaveBeenCalledTimes(1);
  });
});
