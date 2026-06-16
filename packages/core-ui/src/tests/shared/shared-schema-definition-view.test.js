import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent, within } from '@testing-library/dom';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import * as sharedSchemaDefinitionExports from '../../../js/gui_components/shared/schema-definition/index.js';
import { createSharedSchemaDefinitionComponent } from '../../../js/gui_components/shared/schema-definition/index.js';
import { validateSchemaRows as validateSharedSchemaRows } from '../../../js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { mapDataRuleToSchemaRow } from '../../../js/gui_components/shared/test-data/schema/schema-row-mapper.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../js/gui_components/shared/test-data/schema/schema-examples.js';

function createBlankRowFactory(prefix = 'test-schema-row') {
  let counter = 0;
  return () => ({
    id: `${prefix}-${counter++}`,
    name: '',
    sourceType: 'regex',
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
  });
}

function validateSchemaRows(schemaRows) {
  return validateSharedSchemaRows({
    schemaRows,
    schemaRowsToDataRules,
  });
}

describe('shared-schema-definition view', () => {
  let dom;
  let tippyInstances;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.Event = dom.window.Event;
    tippyInstances = [];
    global.tippy = jest.fn((elements, options) => {
      const normalized =
        elements instanceof dom.window.NodeList || Array.isArray(elements) ? Array.from(elements) : [elements];
      normalized.forEach((element) => {
        const instance = {
          destroy: jest.fn(),
          hide: jest.fn(),
          setContent: jest.fn(),
        };
        element._tippy = instance;
        tippyInstances.push({ element, instance, options });
      });
      return tippyInstances.map(({ instance }) => instance);
    });
    dom.window.tippy = global.tippy;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.navigator;
    delete global.Event;
    delete global.tippy;
    delete dom.window.tippy;
  });

  test('public barrel is component-factory-only', () => {
    expect(sharedSchemaDefinitionExports.createSharedSchemaDefinitionComponent).toBe(
      createSharedSchemaDefinitionComponent
    );
    expect(sharedSchemaDefinitionExports.SharedSchemaDefinitionController).toBeUndefined();
    expect(sharedSchemaDefinitionExports.SharedSchemaDefinitionView).toBeUndefined();
  });

  test('shared schema barrel keeps sample schema examples off the broad runtime surface', async () => {
    const sharedSchemaModule = await import('../../../js/gui_components/shared/test-data/schema/schema-editor-core.js');

    expect(sharedSchemaModule.TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT).toBeUndefined();
  });

  function createComponent({ services = {} } = {}) {
    const root = document.getElementById('root');
    const createBlankRow = createBlankRowFactory();
    return createSharedSchemaDefinitionComponent({
      root,
      documentObj: document,
      props: {
        headingText: 'Schema',
        schemaTextToDataRules,
        dataRulesToSchemaText,
        faker: {},
        RandExp: function StoryRandExp() {},
        createBlankRow,
        mapRuleToRow: (rule, leadingTextLines = []) => {
          const row = mapDataRuleToSchemaRow(rule, {
            createBlankSchemaRow: createBlankRow,
          });
          row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
          return row;
        },
        getVisibleDomainCommands: () => ['string.counterString'],
        fakerCommands: ['helpers.arrayElement'],
        sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
        buildModeHelpHtml: ({ inTextMode }) =>
          inTextMode
            ? '<p>Edit as Schema</p><button type="button" class="shared-schema-sample-button">Insert Example Schema</button>'
            : '<p>Edit as Text</p><button type="button" class="shared-schema-sample-button">Insert Example Schema</button>',
        validateSchemaRows,
        getMethodPickerOptions: (currentValue = '') => {
          if (currentValue === 'datatype.enum') {
            return [
              {
                sourceType: 'domain',
                command: 'datatype.enum',
                helpModel: {
                  heading: 'datatype.enum',
                  summary: 'Enum helper',
                  params: [{ name: 'values', type: 'comma-separated list', optional: false }],
                },
              },
            ];
          }
          return [];
        },
      },
      callbacks: {
        onSchemaError: (message) => {
          const errorElement = document.querySelector('[data-role="schema-error"]');
          errorElement.textContent = message;
        },
        onSchemaClear: () => {
          const errorElement = document.querySelector('[data-role="schema-error"]');
          errorElement.textContent = '';
        },
      },
      services: {
        schemaFileTransferService: {
          readSchemaTextFile: jest.fn(async (file) => String((await file.text?.()) || '')),
          downloadSchemaText: jest.fn(() => true),
        },
        ...services,
      },
    });
  }

  function createComponentWithIds(ids) {
    const root = document.getElementById('root');
    const createBlankRow = createBlankRowFactory('generator-compat-row');
    return createSharedSchemaDefinitionComponent({
      root,
      documentObj: document,
      props: {
        headingText: 'Schema',
        ids,
        schemaTextToDataRules,
        dataRulesToSchemaText,
        faker: {},
        RandExp: function StoryRandExp() {},
        createBlankRow,
        mapRuleToRow: (rule, leadingTextLines = []) => {
          const row = mapDataRuleToSchemaRow(rule, {
            createBlankSchemaRow: createBlankRow,
          });
          row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
          return row;
        },
        getVisibleDomainCommands: () => ['string.counterString'],
        fakerCommands: ['helpers.arrayElement'],
        sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
        buildModeHelpHtml: ({ inTextMode }) =>
          inTextMode
            ? '<p>Edit as Schema</p><button type="button" class="shared-schema-sample-button">Insert Example Schema</button>'
            : '<p>Edit as Text</p><button type="button" class="shared-schema-sample-button">Insert Example Schema</button>',
        validateSchemaRows,
      },
      callbacks: {
        onSchemaError: (message) => {
          const errorElement = document.getElementById(ids.error);
          errorElement.textContent = message;
        },
        onSchemaClear: () => {
          const errorElement = document.getElementById(ids.error);
          errorElement.textContent = '';
        },
      },
    });
  }

  test('mounts the shared schema-definition shell and toggles into text mode', () => {
    createComponent();

    expect(document.querySelector('[data-role="shared-schema-definition"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-rows-region"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-text-region"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-textbox"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-mode-toggle"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-add-field"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-load-file-button"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-save-file-button"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-file-input"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-mode-help"]').getAttribute('data-help')).toBe(
      'shared-schema-mode-help'
    );
    expect(document.querySelector('[data-role="schema-mode-toggle-group"]').className).toBe(
      'shared-schema-button-with-help'
    );
    expect(document.querySelector('.shared-schema-definition-shell')).toBeTruthy();
    expect(document.querySelector('.shared-schema-heading')).toBeTruthy();
    expect(document.querySelector('.shared-schema-rows')).toBeTruthy();
    expect(document.querySelector('.shared-schema-text')).toBeTruthy();
    expect(document.querySelector('.shared-schema-constraints')).toBeTruthy();
    expect(document.querySelector('.shared-schema-footer')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-rows-region"]').className).toBe('shared-schema-rows');
    expect(document.querySelector('[data-role="schema-text-region"]').className).toBe('shared-schema-text');
    expect(document.querySelector('[data-role="schema-footer"]').className).toBe('shared-schema-footer');
    expect(document.querySelectorAll('.shared-schema-row').length).toBe(1);
    expect(document.querySelectorAll('.shared-schema-row').length).toBe(1);
    expect(document.querySelector('[data-role="schema-rows-region"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-text-region"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-textbox"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-add-field"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-mode-toggle"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-mode-help"]').id).toBe('');
    expect(document.querySelector('[data-role="schema-error"]').id).toBe('');

    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    fireEvent.click(toggleButton);

    expect(toggleButton.textContent).toBe('Edit as Schema');
    expect(document.querySelector('[data-role="schema-text-region"]').style.display).toBe('block');
    expect(document.querySelector('[data-role="schema-rows-region"]').style.display).toBe('none');
  });

  test('surfaces schema parse errors through the mounted component callbacks', () => {
    const component = createComponent();
    const textArea = document.querySelector('[data-role="schema-textbox"]');

    fireEvent.click(document.querySelector('[data-role="schema-mode-toggle"]'));
    textArea.value = 'OnlyName';
    component.syncFromText({ showErrors: true });

    expect(document.querySelector('[data-role="schema-error"]').textContent.length).toBeGreaterThan(0);
  });

  test('shows constrained schemas in the schema constraints details editor after switching back to row mode', () => {
    const component = createComponent();
    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    const textArea = document.querySelector('[data-role="schema-textbox"]');

    fireEvent.click(toggleButton);
    textArea.value = `Priority
enum(high,low)
Status
enum(open,closed)
IF [Priority] = "high" THEN [Status] = "open" ENDIF`;
    component.syncFromText({ showErrors: true, force: true });

    fireEvent.click(toggleButton);
    expect(document.querySelector('[data-role="schema-text-region"]').style.display).toBe('none');
    expect(document.querySelector('[data-role="schema-rows-region"]').style.display).toBe('flex');
    expect(document.querySelector('[data-role="schema-constraints-summary"]').textContent).toBe(
      'Schema Constraints (1)'
    );
    expect(document.querySelector('[data-role="schema-constraints-region"]').open).toBe(true);
    expect(document.querySelector('[data-role="schema-constraints-textbox"]').value).toContain(
      'IF [Priority] = "high" THEN [Status] = "open" ENDIF'
    );
  });

  test('updates the constraints details editor and preserves edited constraints when toggling modes', () => {
    const component = createComponent();
    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    const textArea = document.querySelector('[data-role="schema-textbox"]');

    fireEvent.click(toggleButton);
    textArea.value = `Priority
enum(high,low)
Status
enum(open,closed)
IF [Priority] = "high" THEN [Status] = "open" ENDIF`;
    component.syncFromText({ showErrors: true, force: true });
    fireEvent.click(toggleButton);

    const constraintsTextArea = document.querySelector('[data-role="schema-constraints-textbox"]');
    constraintsTextArea.value = 'IF [Priority] = "low" THEN [Status] = "closed" ENDIF';
    fireEvent.input(constraintsTextArea);
    fireEvent.focusOut(constraintsTextArea);

    expect(document.querySelector('[data-role="schema-error"]').textContent).toBe('');
    expect(document.querySelector('[data-role="schema-constraints-summary"]').textContent).toBe(
      'Schema Constraints (1)'
    );

    fireEvent.click(toggleButton);

    expect(document.querySelector('[data-role="schema-textbox"]').value).toContain(
      'IF [Priority] = "low" THEN [Status] = "closed" ENDIF'
    );
  });

  test('preserves comment lines in the schema constraints section when toggling modes', () => {
    const component = createComponent();
    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    const textArea = document.querySelector('[data-role="schema-textbox"]');
    const originalText = `Priority
enum(high,low)
Status
enum(open,closed)

# open items must stay open
IF [Priority] = "high" THEN [Status] = "open" ENDIF

# low priority items can close
IF [Priority] = "low" THEN [Status] = "closed";`;

    fireEvent.click(toggleButton);
    textArea.value = originalText;
    component.syncFromText({ showErrors: true, force: true });
    fireEvent.click(toggleButton);

    const constraintsTextArea = document.querySelector('[data-role="schema-constraints-textbox"]');
    expect(constraintsTextArea.value).toBe(
      `# open items must stay open
IF [Priority] = "high" THEN [Status] = "open" ENDIF

# low priority items can close
IF [Priority] = "low" THEN [Status] = "closed";`
    );

    fireEvent.click(toggleButton);
    expect(document.querySelector('[data-role="schema-textbox"]').value).toBe(originalText);
  });

  test('toggling between schema and text mode does not add extra blank lines before constraints', () => {
    const component = createComponent();
    const toggleButton = document.querySelector('[data-role="schema-mode-toggle"]');
    const textArea = document.querySelector('[data-role="schema-textbox"]');
    const originalText = `Priority
enum(high,low)

Status
enum(open,closed)

IF [Priority] = "high" THEN [Status] = "open" ENDIF`;

    fireEvent.click(toggleButton);
    textArea.value = originalText;
    component.syncFromText({ showErrors: true, force: true });

    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(document.querySelector('[data-role="schema-textbox"]').value).toBe(originalText);
  });

  test('works with generator page ids while shared internals keep using neutral schema keys', () => {
    createComponentWithIds({
      rows: 'generatorSchemaRows',
      textContainer: 'generatorSchemaTextContainer',
      text: 'generatorSchemaText',
      addButton: 'addSchemaRowButton',
      toggleButton: 'schemaModeToggleButton',
      helpIcon: 'schemaModeHelpIcon',
      error: 'generatorSchemaErrorText',
    });

    expect(document.getElementById('generatorSchemaRows')).toBeTruthy();
    expect(document.querySelectorAll('.shared-schema-row')).toHaveLength(1);
    expect(document.querySelector('[data-role="schema-mode-toggle-group"]').className).toBe(
      'shared-schema-button-with-help'
    );

    fireEvent.click(document.getElementById('schemaModeToggleButton'));

    expect(document.getElementById('generatorSchemaTextContainer').style.display).toBe('block');
    expect(document.getElementById('generatorSchemaRows').style.display).toBe('none');
  });

  test('binds the mode help icon with tippy content and updates it when the mode changes', () => {
    createComponent();

    const helpIcon = document.querySelector('[data-role="schema-mode-help"]');
    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon._tippy).toBeTruthy();

    const initialBinding = tippyInstances.find(({ element }) => element === helpIcon);
    expect(initialBinding).toBeTruthy();
    expect(initialBinding.options.content(helpIcon)).toContain('Edit as Text');
    expect(initialBinding.options.content(helpIcon)).toContain('Insert Example Schema');

    fireEvent.click(document.querySelector('[data-role="schema-mode-toggle"]'));

    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit as Schema');
    const reboundBinding = [...tippyInstances].reverse().find(({ element }) => element === helpIcon);
    expect(reboundBinding).toBeTruthy();
    expect(reboundBinding.options.content(helpIcon)).toContain('Edit as Schema');
  });

  test('replaceRows rerenders and refreshes text mode output', () => {
    const component = createComponent();

    fireEvent.click(document.querySelector('[data-role="schema-mode-toggle"]'));

    const result = component.replaceRows([
      {
        id: 'replacement-row',
        name: 'Status',
        sourceType: 'enum',
        command: '',
        params: '',
        value: 'active,inactive',
        comments: '',
        leadingTextLines: [],
      },
    ]);

    expect(result.errors).toEqual([]);
    expect(component.getState().rows).toHaveLength(1);
    expect(document.querySelector('[data-role="schema-textbox"]').value).toContain('Status\nenum(active,inactive)');
    expect(document.querySelectorAll('.shared-schema-row')).toHaveLength(1);
  });

  test('save schema file action downloads the current shared schema text', () => {
    const downloadSchemaText = jest.fn(() => true);
    const component = createComponent({
      services: {
        schemaFileTransferService: {
          readSchemaTextFile: jest.fn(async () => ''),
          downloadSchemaText,
        },
      },
    });

    component.replaceRows([
      {
        id: 'download-row',
        name: 'Status',
        sourceType: 'enum',
        command: '',
        params: '',
        value: 'active,inactive',
        comments: '',
        leadingTextLines: [],
      },
    ]);

    fireEvent.click(document.querySelector('[data-role="schema-save-file-button"]'));

    expect(downloadSchemaText).toHaveBeenCalledWith('Status\nenum(active,inactive)', {
      filename: 'schema.txt',
    });
  });

  test('load schema file action replaces the current schema from a plain text file', async () => {
    createComponent({
      services: {
        schemaFileTransferService: {
          readSchemaTextFile: jest.fn(async () => 'Loaded Name\nliteral(Ada)\nLoaded Status\nenum(active,inactive)'),
          downloadSchemaText: jest.fn(() => true),
        },
      },
    });

    const fileInput = document.querySelector('[data-role="schema-file-input"]');
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [{ name: 'schema.txt' }],
    });

    fireEvent.change(fileInput);
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelector('[data-role="schema-text-region"]').style.display).toBe('none');
    expect(document.querySelectorAll('.shared-schema-row')).toHaveLength(2);
    expect(within(document.body).getByDisplayValue('Loaded Name')).toBeTruthy();
    expect(within(document.body).getByDisplayValue('Loaded Status')).toBeTruthy();
  });

  test('load schema file action surfaces schema parse errors and keeps the loaded text visible', async () => {
    createComponent({
      services: {
        schemaFileTransferService: {
          readSchemaTextFile: jest.fn(async () => 'OnlyName'),
          downloadSchemaText: jest.fn(() => true),
        },
      },
    });

    const fileInput = document.querySelector('[data-role="schema-file-input"]');
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [{ name: 'broken-schema.txt' }],
    });

    fireEvent.change(fileInput);
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelector('[data-role="schema-error"]').textContent.length).toBeGreaterThan(0);
    expect(document.querySelector('[data-role="schema-text-region"]').style.display).toBe('block');
    expect(document.querySelector('[data-role="schema-textbox"]').value).toBe('OnlyName');
  });

  test('guided params dialog applies generated params back into the shared row editor', async () => {
    const component = createComponent();

    component.replaceRows([
      {
        id: 'enum-row',
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        params: '',
        value: '',
        comments: '',
        leadingTextLines: [],
      },
    ]);

    fireEvent.click(document.querySelector('[data-action="edit-params"]'));

    const dialog = within(document.body).getByRole('dialog', { name: /edit params for datatype\.enum/i });
    const valuesInput = within(dialog).getByRole('textbox', { name: /values value/i });
    valuesInput.value = 'active,inactive,pending';
    fireEvent.input(valuesInput);
    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelector('[data-field="params"]').value).toBe('(values=active,inactive,pending)');
    expect(component.getSchemaText()).toContain('enum(values=active,inactive,pending)');
  });
});
