import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as schemaControllerExports from '../../../js/gui_components/shared/test-data/schema/schema-controller.js';
import * as schemaEditorCoreExports from '../../../js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { createSharedSchemaEditorController } from '../../../js/gui_components/shared/test-data/schema/shared-schema-editor-controller.js';

function createRoot(documentObj) {
  const root = documentObj.createElement('section');
  root.innerHTML = `
    <div data-role="schema-rows-region"></div>
    <div data-role="schema-text-region"><textarea data-role="schema-textbox"></textarea></div>
    <button data-role="schema-add-field" type="button"></button>
    <button data-role="schema-mode-toggle" type="button"></button>
    <span data-role="schema-mode-help"></span>
  `;
  documentObj.body.appendChild(root);
  return root;
}

describe('createSharedSchemaEditorController', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
    jest.restoreAllMocks();
  });

  test('shared schema helpers now resolve through the focused controller/core modules directly', () => {
    expect(typeof schemaControllerExports.parseSchemaTextToRows).toBe('function');
    expect(typeof schemaEditorCoreExports.validateSchemaRows).toBe('function');
    expect(typeof schemaEditorCoreExports.schemaRowsToSpec).toBe('function');
    expect(typeof schemaEditorCoreExports.schemaRowsToSpecWithTokens).toBe('function');
    expect(schemaControllerExports.validateSchemaRows).toBeUndefined();
    expect(schemaEditorCoreExports.parseSchemaTextToRows).toBeUndefined();
    expect(schemaEditorCoreExports.createSharedSchemaEditorController).toBeUndefined();
  });

  test('uses the injected timer api for semantic-validation debounce scheduling and cleanup', () => {
    const root = createRoot(dom.window.document);
    const timerApi = {
      setTimeout: jest.fn(() => 'timer-1'),
      clearTimeout: jest.fn(),
    };

    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      timerApi,
      createBlankRow: () => ({
        id: 'row-1',
        name: '',
        sourceType: 'literal',
        command: 'literal',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: '',
        sourceType: 'literal',
        command: 'literal',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();

    const nameInput = dom.window.document.createElement('input');
    nameInput.setAttribute('data-field', 'name');
    nameInput.value = 'First Name';
    nameInput.closest = jest.fn(() => ({
      getAttribute: (attribute) => (attribute === 'data-row-id' ? 'row-1' : null),
    }));
    controller.handleInput({ target: nameInput });

    expect(timerApi.setTimeout).toHaveBeenCalledTimes(1);
    expect(timerApi.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    controller.destroy();

    expect(timerApi.clearTimeout).toHaveBeenCalledWith('timer-1');
  });
});
