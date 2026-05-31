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

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
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
            ? '<button type="button" class="shared-schema-sample-button">Insert Example Schema</button>'
            : '<button type="button" class="shared-schema-sample-button">Insert Example Schema</button>',
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

    expect(document.getElementById('schemaRows')).toBeTruthy();
    expect(document.querySelectorAll('.generator-schema-row').length).toBe(1);

    const toggleButton = document.getElementById('schemaModeToggleButton');
    fireEvent.click(toggleButton);

    expect(toggleButton.textContent).toBe('Edit as Schema');
    expect(document.getElementById('schemaTextContainer').style.display).toBe('block');
    expect(document.getElementById('schemaRows').style.display).toBe('none');
  });

  test('surfaces schema parse errors through the mounted component callbacks', () => {
    const component = createComponent();
    const textArea = document.getElementById('schemaText');

    fireEvent.click(document.getElementById('schemaModeToggleButton'));
    textArea.value = 'OnlyName';
    component.syncFromText({ showErrors: true });

    expect(document.getElementById('schemaErrorText').textContent.length).toBeGreaterThan(0);
  });
});
