import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  createSchemaTextSyncState,
  showSchemaError,
  populateGridFromSchemaText,
  bindSchemaTextareaSync,
  initializeSchemaErrorDisplay,
} from '../../../../js/gui_components/app/test-data-grid/schema/test-data-grid-schema-text-sync.js';

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
    const state = createSchemaTextSyncState();
    const schemaGridBridge = {
      clearRows: jest.fn(),
      addRows: jest.fn(),
    };

    populateGridFromSchemaText({
      state,
      schemaGridBridge,
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
      getSchemaTextValue: () => 'x',
    });

    expect(schemaGridBridge.clearRows).toHaveBeenCalled();
    expect(schemaGridBridge.addRows).toHaveBeenCalledWith([{ columnName: 'c1', type: 'regex', value: '[A-Z]+' }]);
    expect(state.schemaTextTokens).toEqual(['# t']);
  });

  test('bindSchemaTextareaSync debounces populate on input using an injected element getter', () => {
    const input = document.createElement('textarea');
    const debouncer = { debounce: jest.fn() };
    const onPopulateRequested = jest.fn();

    bindSchemaTextareaSync({
      debouncer,
      onPopulateRequested,
      getSchemaTextElement: () => input,
    });
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(debouncer.debounce).toHaveBeenCalledWith('populateTestDataGrid', onPopulateRequested, 1000);
  });

  test('populateGridFromSchemaText supports an injected schema text element getter', () => {
    const textArea = document.createElement('textarea');
    textArea.value = 'Header\nliteral(Value)';
    const state = createSchemaTextSyncState();
    const schemaGridBridge = {
      clearRows: jest.fn(),
      addRows: jest.fn(),
    };

    populateGridFromSchemaText({
      state,
      schemaGridBridge,
      schemaTextToDataRules: () => ({
        errors: [],
        dataRules: [{ name: 'Header', type: 'literal', ruleSpec: 'Value' }],
        schemaTokens: [],
      }),
      schemaErrorsToText: jest.fn(),
      setTestDataStatus: jest.fn(),
      updatePairwiseButtonVisibility: jest.fn(),
      mapRuleToRow: () => ({ columnName: 'Header', type: 'literal', value: 'Value' }),
      faker: {},
      RandExp: function RandExp() {},
      getSchemaTextElement: () => textArea,
    });

    expect(schemaGridBridge.clearRows).toHaveBeenCalledTimes(1);
    expect(schemaGridBridge.addRows).toHaveBeenCalledWith([{ columnName: 'Header', type: 'literal', value: 'Value' }]);
  });

  test('initializeSchemaErrorDisplay tolerates a missing document object', () => {
    const state = createSchemaTextSyncState();

    expect(() => initializeSchemaErrorDisplay(state, { documentObj: null })).not.toThrow();
    expect(typeof state.schemaErrorDisplay?.show).toBe('function');
  });
});
