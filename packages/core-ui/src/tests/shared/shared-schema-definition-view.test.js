import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createSharedSchemaDefinitionComponent } from '../../../js/gui_components/shared/schema-definition/index.js';
import {
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
  mapDataRuleToSchemaRow,
  validateSchemaRows as validateSharedSchemaRows,
} from '../../../js/gui_components/shared/test-data/schema/index.js';

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
    global.Event = dom.window.Event;
    tippyInstances = [];
    global.tippy = jest.fn((elements, options) => {
      const normalized = elements instanceof dom.window.NodeList ? Array.from(elements) : [elements];
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
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
    delete global.tippy;
  });

  function createComponent() {
    const root = document.getElementById('root');
    const createBlankRow = createBlankRowFactory();
    return createSharedSchemaDefinitionComponent({
      root,
      documentObj: document,
      props: {
        headingText: 'Schema',
        ids: {
          rows: 'schemaRows',
          textContainer: 'schemaTextContainer',
          text: 'schemaText',
          addButton: 'addSchemaRowButton',
          toggleButton: 'schemaModeToggleButton',
          helpIcon: 'schemaModeHelpIcon',
          error: 'schemaErrorText',
        },
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
        getMethodPickerOptions: () => [],
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
          const errorElement = document.getElementById('schemaErrorText');
          errorElement.textContent = message;
        },
        onSchemaClear: () => {
          const errorElement = document.getElementById('schemaErrorText');
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
    expect(document.querySelectorAll('.generator-schema-row').length).toBe(1);

    const toggleButton = document.getElementById('schemaModeToggleButton');
    fireEvent.click(toggleButton);

    expect(toggleButton.textContent).toBe('Edit as Schema');
    expect(document.querySelector('[data-role="schema-text-region"]').style.display).toBe('block');
    expect(document.querySelector('[data-role="schema-rows-region"]').style.display).toBe('none');
  });

  test('surfaces schema parse errors through the mounted component callbacks', () => {
    const component = createComponent();
    const textArea = document.getElementById('schemaText');

    fireEvent.click(document.getElementById('schemaModeToggleButton'));
    textArea.value = 'OnlyName';
    component.syncFromText({ showErrors: true });

    expect(document.getElementById('schemaErrorText').textContent.length).toBeGreaterThan(0);
  });

  test('binds the mode help icon with tippy content and updates it when the mode changes', () => {
    createComponent();

    const helpIcon = document.getElementById('schemaModeHelpIcon');
    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon._tippy).toBeTruthy();

    const initialBinding = tippyInstances.find(({ element }) => element === helpIcon);
    expect(initialBinding).toBeTruthy();
    expect(initialBinding.options.content(helpIcon)).toContain('Edit as Text');
    expect(initialBinding.options.content(helpIcon)).toContain('Insert Example Schema');

    fireEvent.click(document.getElementById('schemaModeToggleButton'));

    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit as Schema');
    const reboundBinding = [...tippyInstances].reverse().find(({ element }) => element === helpIcon);
    expect(reboundBinding).toBeTruthy();
    expect(reboundBinding.options.content(helpIcon)).toContain('Edit as Schema');
  });
});
