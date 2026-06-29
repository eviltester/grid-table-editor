import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent, within } from '@testing-library/dom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { dataRulesToSchemaText, schemaTextToDataRules } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
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
    global.navigator = dom.window.navigator;
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
    delete global.navigator;
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

  test('opens the params editor dialog and applies validated params back to the row', async () => {
    const root = createRoot(dom.window.document);
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      getMethodPickerOptions: () => [
        {
          sourceType: 'domain',
          command: 'datatype.enum',
          helpModel: {
            heading: 'datatype.enum',
            summary: 'Enum helper',
            params: [{ name: 'values', type: 'comma-separated list', optional: false }],
          },
        },
      ],
      getVisibleDomainCommands: () => ['datatype.enum'],
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    const paramsButton = dom.window.document.querySelector('[data-action="edit-params"]');
    const dialogPromise = controller.handleClick({ target: paramsButton });

    const dialog = within(dom.window.document.body).getByRole('dialog', { name: /edit params for datatype\.enum/i });
    expect(dialog).not.toBeNull();
    const paramsInput = within(dialog).getByRole('textbox', { name: /values value/i });
    paramsInput.value = 'active,inactive,pending';
    fireEvent.input(paramsInput);
    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));

    await dialogPromise;
    expect(dom.window.document.querySelector('[data-field="params"]').value).toBe('(values=active,inactive,pending)');
  });

  test('restores focus to the command picker button after applying a method picker selection', async () => {
    const root = createRoot(dom.window.document);
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: 'Method',
        sourceType: 'domain',
        command: '',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: 'Method',
        sourceType: 'domain',
        command: '',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      getMethodPickerOptions: () => [
        {
          sourceType: 'domain',
          command: 'internet.httpMethod',
          helpModel: {
            heading: 'internet.httpMethod',
            summary: 'HTTP method helper',
            params: [],
          },
        },
      ],
      getVisibleDomainCommands: () => ['internet.httpMethod'],
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    const pickerButton = dom.window.document.querySelector('[data-action="pick-command"]');
    pickerButton.focus();
    const dialogPromise = controller.handleClick({ target: pickerButton });

    const dialog = within(dom.window.document.body).getByRole('dialog', { name: /select schema method/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));

    await dialogPromise;
    const replacementPickerButton = dom.window.document.querySelector('[data-action="pick-command"]');
    expect(replacementPickerButton.textContent).toBe('internet.httpMethod');
    expect(dom.window.document.activeElement).toBe(replacementPickerButton);
  });

  test('applies helpers.arrayElement array params as positional values from the params editor', async () => {
    const root = createRoot(dom.window.document);
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: 'Tier',
        sourceType: 'faker',
        command: 'helpers.arrayElement',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: 'Tier',
        sourceType: 'faker',
        command: 'helpers.arrayElement',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      getMethodPickerOptions: () => [
        {
          sourceType: 'faker',
          command: 'helpers.arrayElement',
          helpModel: {
            heading: 'helpers.arrayElement',
            summary: 'Returns one random element from the supplied array.',
            params: [{ name: 'array', type: 'array', optional: false, positionalOnly: true }],
          },
        },
      ],
      getVisibleDomainCommands: () => ['datatype.enum'],
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    const paramsButton = dom.window.document.querySelector('[data-action="edit-params"]');
    const dialogPromise = controller.handleClick({ target: paramsButton });

    const dialog = within(dom.window.document.body).getByRole('dialog', {
      name: /edit params for helpers\.arrayelement/i,
    });
    const paramsInput = within(dialog).getByRole('textbox', { name: /array value/i });
    paramsInput.value = '["free","pro","enterprise"]';
    fireEvent.input(paramsInput);
    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));

    await dialogPromise;
    expect(dom.window.document.querySelector('[data-field="params"]').value).toBe('(["free","pro","enterprise"])');
  });

  test('logs unexpected params editor failures instead of silently swallowing them', async () => {
    const root = createRoot(dom.window.document);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      getMethodPickerOptions: () => {
        throw new Error('boom from params dialog');
      },
      getVisibleDomainCommands: () => ['datatype.enum'],
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    const paramsButton = dom.window.document.querySelector('[data-action="edit-params"]');

    await controller.handleClick({ target: paramsButton });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed opening params editor dialog.',
      expect.objectContaining({ message: 'boom from params dialog' })
    );
    expect(dom.window.document.querySelector('[data-field="params"]').value).toBe('');
  });

  test('still opens the params dialog safely when getMethodPickerOptions is not a function', async () => {
    const root = createRoot(dom.window.document);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: () => ({
        id: 'row-1',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules: jest.fn(() => ({ dataRules: [], errors: [] })),
      dataRulesToSchemaText: jest.fn(() => ''),
      getMethodPickerOptions: undefined,
      getVisibleDomainCommands: () => ['datatype.enum'],
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    const paramsButton = dom.window.document.querySelector('[data-action="edit-params"]');

    const dialogPromise = controller.handleClick({ target: paramsButton });

    const dialog = within(dom.window.document.body).getByRole('dialog', { name: /edit params for datatype\.enum/i });
    expect(dialog).not.toBeNull();
    expect(dom.window.document.querySelector('[data-field="params"]').value).toBe('');
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(dialogPromise).resolves.toBeUndefined();
  });

  test('emits schema text changes when text mode contains invalid in-progress schema text', () => {
    const root = createRoot(dom.window.document);
    const onSchemaTextChanged = jest.fn();
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [],
      errors: [{ code: 'missing_rule_definition', message: 'Missing generator definition' }],
      schemaTokens: [],
      constraints: [],
    }));

    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
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
      schemaTextToDataRules,
      dataRulesToSchemaText: jest.fn(() => ''),
      onSchemaTextChanged,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);

    const textArea = root.querySelector('[data-role="schema-textbox"]');
    textArea.value = 'OnlyName';

    const result = controller.syncFromText({ showErrors: true });

    expect(schemaTextToDataRules).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaText: 'OnlyName',
      })
    );
    expect(result.errors).toEqual([{ code: 'missing_rule_definition', message: 'Missing generator definition' }]);
    expect(onSchemaTextChanged).toHaveBeenLastCalledWith('OnlyName');
  });

  test('refreshes open text mode to the interpreted regex schema when requested', () => {
    const root = createRoot(dom.window.document);
    const onSchemaTextChanged = jest.fn();
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [{ name: 'Mystery', ruleSpec: 'unknown()', type: 'regex' }],
      errors: [],
      schemaTokens: [{ kind: 'rule' }],
      constraints: [],
    }));

    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      createBlankRow: () => ({
        id: 'row-1',
        name: '',
        sourceType: 'regex',
        command: '',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: (rule) => ({
        id: 'row-1',
        name: rule.name,
        sourceType: rule.type,
        command: '',
        value: rule.ruleSpec,
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules,
      dataRulesToSchemaText,
      onSchemaTextChanged,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);
    const textArea = root.querySelector('[data-role="schema-textbox"]');
    textArea.value = 'Mystery\nunknown()';

    const result = controller.syncFromText({ showErrors: true, force: true, refreshTextFromRows: true });

    expect(result.errors).toEqual([]);
    expect(textArea.value).toBe('Mystery\nregex(unknown())');
    expect(onSchemaTextChanged).toHaveBeenLastCalledWith('Mystery\nregex(unknown())');
  });

  test('confirms before converting invalid text definitions to literal rows when leaving text mode', async () => {
    const root = createRoot(dom.window.document);
    const requestConfirm = jest.fn(() => Promise.resolve(true));
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [
        { name: 'First Name', ruleSpec: 'person.fullName()', type: 'domain' },
        { name: 'Bad Command', ruleSpec: 'person.notACommand()', type: 'domain' },
      ],
      errors: [
        {
          code: 'compiler_validation_error',
          column: 'Bad Command',
          message: 'Bad Command failed domain validation - Unknown keyword: person.notACommand',
        },
      ],
      schemaTokens: [
        { kind: 'rule', name: 'First Name', rule: 'person.fullName()', ruleLine: 2 },
        { kind: 'rule', name: 'Bad Command', rule: 'person.notACommand()', ruleLine: 4 },
      ],
      constraints: [],
    }));
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      requestConfirm,
      createBlankRow: () => ({
        id: 'blank',
        name: '',
        sourceType: 'literal',
        command: 'literal',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: (rule) => ({
        id: rule.name,
        name: rule.name,
        sourceType: rule.type,
        command: rule.type === 'domain' ? rule.ruleSpec.replace(/\([\s\S]*\)$/u, '') : '',
        value: rule.type === 'literal' ? rule.ruleSpec : '',
        params: rule.type === 'domain' && rule.ruleSpec.endsWith('()') ? '()' : '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules,
      dataRulesToSchemaText,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);
    const textArea = root.querySelector('[data-role="schema-textbox"]');
    textArea.value = 'First Name\nperson.fullName()\nBad Command\nperson.notACommand()';

    const result = await controller.toggleMode();

    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Convert invalid definitions?',
      message:
        'Syntax errors are present that can not be edited in Schema UI. Allow editing by converting invalid definitions to literal?',
      okLabel: 'Yes',
      cancelLabel: 'No',
    });
    expect(result).toMatchObject({ errors: [], convertedInvalidRules: true });
    expect(controller.getState().isTextMode).toBe(false);
    expect(controller.getState().rows).toEqual([
      expect.objectContaining({ name: 'First Name', sourceType: 'domain', command: 'person.fullName' }),
      expect.objectContaining({
        name: 'Bad Command',
        sourceType: 'literal',
        command: 'literal',
        value: 'person.notACommand()',
      }),
    ]);
    expect(root.querySelector('[data-role="schema-error"]')?.textContent || '').toBe('');
  });

  test('switches from text to schema rows without literal conversion when a known command has invalid params', async () => {
    const root = createRoot(dom.window.document);
    const requestConfirm = jest.fn(() => Promise.resolve(true));
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      requestConfirm,
      faker,
      RandExp,
      createBlankRow: () => ({
        id: 'blank',
        name: '',
        sourceType: 'domain',
        command: '',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: (rule) => {
        const ruleSpec = String(rule?.ruleSpec ?? '');
        const openParenIndex = ruleSpec.indexOf('(');
        return {
          id: rule.name,
          name: rule.name,
          sourceType: rule.type,
          command: openParenIndex > 0 ? ruleSpec.slice(0, openParenIndex) : ruleSpec,
          value: '',
          params: openParenIndex > 0 ? ruleSpec.slice(openParenIndex) : '',
          semanticValidationIssues: [],
        };
      },
      schemaTextToDataRules,
      dataRulesToSchemaText,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);
    root.querySelector('[data-role="schema-textbox"]').value = 'Num\nnumber.int(min=1, min=2, max=3)';

    const result = await controller.toggleMode();

    expect(requestConfirm).not.toHaveBeenCalled();
    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Num',
        message: expect.stringContaining('duplicate named argument "min"'),
      }),
    ]);
    expect(controller.getState().isTextMode).toBe(false);
    expect(controller.getState().rows).toEqual([
      expect.objectContaining({
        name: 'Num',
        sourceType: 'domain',
        command: 'number.int',
        params: '(min=1, min=2, max=3)',
        semanticValidationIssues: [
          expect.objectContaining({
            field: 'params',
            message: expect.stringContaining('duplicate named argument "min"'),
          }),
        ],
      }),
    ]);
    expect(root.querySelector('[data-role="schema-error"]')?.textContent || '').toBe('');
  });

  test('keeps text mode when compiler validation includes an unmatched error', async () => {
    const root = createRoot(dom.window.document);
    const requestConfirm = jest.fn(() => Promise.resolve(false));
    const onSchemaError = jest.fn();
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [{ name: 'Num', ruleSpec: 'number.int(min=1, min=2)', type: 'domain' }],
      errors: [
        {
          code: 'compiler_validation_error',
          column: 'Num',
          message: 'Num failed domain validation - Invalid keyword arguments: duplicate named argument "min"',
        },
        {
          code: 'compiler_validation_error',
          message: 'Constraint validation failed without a row anchor',
        },
      ],
      schemaTokens: [{ kind: 'rule', name: 'Num', rule: 'number.int(min=1, min=2)', ruleLine: 2 }],
      constraints: [],
    }));
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      requestConfirm,
      createBlankRow: () => ({
        id: 'blank',
        name: '',
        sourceType: 'domain',
        command: '',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: (rule) => ({
        id: rule.name,
        name: rule.name,
        sourceType: rule.type,
        command: 'number.int',
        value: '',
        params: '(min=1, min=2)',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules,
      dataRulesToSchemaText,
      onSchemaError,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);
    root.querySelector('[data-role="schema-textbox"]').value = 'Num\nnumber.int(min=1, min=2)';

    const result = await controller.toggleMode();

    expect(requestConfirm).toHaveBeenCalledTimes(1);
    expect(result.errors).toHaveLength(2);
    expect(controller.getState().isTextMode).toBe(true);
    expect(onSchemaError).toHaveBeenLastCalledWith(expect.stringContaining('Constraint validation failed'));
  });

  test('stays in text mode when invalid text definition literal conversion is declined', async () => {
    const root = createRoot(dom.window.document);
    const requestConfirm = jest.fn(() => Promise.resolve(false));
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [{ name: 'Bad Command', ruleSpec: 'person.notACommand', type: 'domain' }],
      errors: [
        {
          code: 'compiler_validation_error',
          column: 'Bad Command',
          message: 'Bad Command failed domain validation - Unknown keyword: person.notACommand',
        },
      ],
      schemaTokens: [{ kind: 'rule', name: 'Bad Command', rule: 'person.notACommand', ruleLine: 2 }],
      constraints: [],
    }));
    const onSchemaError = jest.fn();
    const controller = createSharedSchemaEditorController({
      documentObj: dom.window.document,
      rootElement: root,
      requestConfirm,
      createBlankRow: () => ({
        id: 'blank',
        name: '',
        sourceType: 'literal',
        command: 'literal',
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      mapRuleToRow: (rule) => ({
        id: rule.name,
        name: rule.name,
        sourceType: rule.type,
        command: rule.ruleSpec,
        value: '',
        params: '',
        semanticValidationIssues: [],
      }),
      schemaTextToDataRules,
      dataRulesToSchemaText,
      onSchemaError,
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      updatePairwiseButtonVisibility: jest.fn(),
      updateHelpHints: jest.fn(),
    });

    controller.init();
    controller.setTextMode(true);
    root.querySelector('[data-role="schema-textbox"]').value = 'Bad Command\nperson.notACommand';

    const result = await controller.toggleMode();

    expect(requestConfirm).toHaveBeenCalledTimes(1);
    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
        message: expect.stringContaining('Unknown keyword: person.notACommand'),
      }),
    ]);
    expect(controller.getState().isTextMode).toBe(true);
    expect(onSchemaError).toHaveBeenLastCalledWith(expect.stringContaining('Unknown keyword: person.notACommand'));
  });
});
