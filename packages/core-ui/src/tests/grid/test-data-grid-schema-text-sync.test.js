import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  createSchemaTextSyncState,
  showSchemaError,
  populateGridFromSchemaText,
  bindSchemaTextareaSync,
} from '../../../js/gui_components/app/test-data-grid/test-data-grid-schema-text-sync.js';

describe('test-data-grid schema text sync', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('createSchemaTextSyncState provides expected defaults', () => {
    const state = createSchemaTextSyncState();
    expect(state.schemaTextTokens).toEqual([]);
    expect(state.schemaErrorDisplay).toBeNull();
  });

  test('showSchemaError forwards trimmed text to display', () => {
    const state = createSchemaTextSyncState();
    state.schemaErrorDisplay = { show: jest.fn() };
    showSchemaError(state, '  bad schema  ');
    expect(state.schemaErrorDisplay.show).toHaveBeenCalledWith('bad schema');
  });

  test('populateGridFromSchemaText maps rules and updates tokens', () => {
    document.body.innerHTML = '<textarea id="testdatadefntext">x</textarea>';
    const state = createSchemaTextSyncState();
    const defnGridBridge = {
      clearRows: jest.fn(),
      addRows: jest.fn(),
    };

    populateGridFromSchemaText({
      state,
      defnGridBridge,
      schemaTextToDataRules: () => ({
        errors: [],
        dataRules: [{ name: 'c1', type: 'regex', ruleSpec: '[A-Z]+' }],
        schemaTokens: ['# t'],
      }),
      schemaErrorsToText: jest.fn(),
      setTestDataStatus: jest.fn(),
      updatePairwiseButtonVisibility: jest.fn(),
      mapRuleToRow: () => ({ columnName: 'c1', type: 'regex', value: '[A-Z]+' }),
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(defnGridBridge.clearRows).toHaveBeenCalled();
    expect(defnGridBridge.addRows).toHaveBeenCalledWith([{ columnName: 'c1', type: 'regex', value: '[A-Z]+' }]);
    expect(state.schemaTextTokens).toEqual(['# t']);
  });

  test('bindSchemaTextareaSync debounces populate on input', () => {
    document.body.innerHTML = '<textarea id="testdatadefntext"></textarea>';
    const debouncer = { debounce: jest.fn() };
    const onPopulateRequested = jest.fn();

    bindSchemaTextareaSync({ debouncer, onPopulateRequested });
    document.getElementById('testdatadefntext').dispatchEvent(new Event('input', { bubbles: true }));

    expect(debouncer.debounce).toHaveBeenCalledWith('populateTestDataGrid', onPopulateRequested, 1000);
  });
});
