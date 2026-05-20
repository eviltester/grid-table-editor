import { jest } from '@jest/globals';
import { setupTestDataGenerationPanel } from '../../../js/gui_components/app/test-data-grid/test-data-grid-panel-coordinator.js';

describe('test data grid panel coordinator', () => {
  test('renders panel and wires all panel-side bindings in the expected order', () => {
    const callOrder = [];
    const parentElem = { innerHTML: '' };
    const schemaTextSyncState = { errorText: '' };
    const debouncer = {};
    const renderTestDataGenerationPanelFn = jest.fn(() => callOrder.push('render'));
    const bindPrimaryActionsFn = jest.fn(() => callOrder.push('primary-actions'));
    const bindGenerateCountInputFn = jest.fn(() => callOrder.push('count-input'));
    const bindModeRadiosFn = jest.fn(() => callOrder.push('mode-radios'));
    const createTestDataGrid = jest.fn(() => callOrder.push('create-grid'));
    const initializeSchemaErrorDisplayFn = jest.fn(() => callOrder.push('init-errors'));
    const bindSchemaTextareaSyncFn = jest.fn(() => callOrder.push('bind-text-sync'));
    const bindSchemaSampleShortcutFn = jest.fn(() => {
      callOrder.push('bind-sample');
      return 'new-handler';
    });
    const updateHelpHints = jest.fn(() => callOrder.push('help-hints'));

    const result = setupTestDataGenerationPanel({
      parentElem,
      TEST_DATA_MODES: { NEW_TABLE: 'new-table' },
      renderTestDataGenerationPanelFn,
      bindPrimaryActionsFn,
      bindGenerateCountInputFn,
      bindModeRadiosFn,
      initializeSchemaErrorDisplayFn,
      bindSchemaTextareaSyncFn,
      bindSchemaSampleShortcutFn,
      schemaTextSyncState,
      debouncer,
      onGenerate: jest.fn(),
      onGeneratePairwise: jest.fn(),
      onRefreshPreview: jest.fn(),
      applyModeDefaultRowCount: jest.fn(),
      onPopulateRequested: jest.fn(),
      onSampleRequested: jest.fn(),
      createTestDataGrid,
      previousSampleHandler: 'old-handler',
      updateHelpHints,
    });

    expect(renderTestDataGenerationPanelFn).toHaveBeenCalledWith({
      parentElem,
      TEST_DATA_MODES: { NEW_TABLE: 'new-table' },
    });
    expect(bindPrimaryActionsFn).toHaveBeenCalledTimes(1);
    expect(bindGenerateCountInputFn).toHaveBeenCalledTimes(1);
    expect(bindModeRadiosFn).toHaveBeenCalledTimes(1);
    expect(initializeSchemaErrorDisplayFn).toHaveBeenCalledWith(schemaTextSyncState);
    expect(bindSchemaTextareaSyncFn).toHaveBeenCalledWith({
      debouncer,
      onPopulateRequested: expect.any(Function),
    });
    expect(bindSchemaSampleShortcutFn).toHaveBeenCalledWith({
      currentHandler: 'old-handler',
      onSampleRequested: expect.any(Function),
    });
    expect(updateHelpHints).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ sampleHandler: 'new-handler' });
    expect(callOrder).toEqual([
      'render',
      'primary-actions',
      'count-input',
      'mode-radios',
      'create-grid',
      'init-errors',
      'bind-text-sync',
      'bind-sample',
      'help-hints',
    ]);
  });
});
