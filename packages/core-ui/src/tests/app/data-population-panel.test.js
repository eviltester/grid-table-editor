import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createDataPopulationPanelComponent } from '../../../js/gui_components/app/data-population-panel/index.js';

describe('DataPopulationPanel', () => {
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

  test('composes actions, row count, mode selector, and schema definition', () => {
    const onGenerate = jest.fn();
    const onModeChange = jest.fn();

    const schemaDefinition = {
      update: jest.fn(),
      destroy: jest.fn(),
      getState: jest.fn(() => ({ isTextMode: false })),
      validateRows: jest.fn(() => ({ rows: [], errors: [] })),
      syncTextFromRows: jest.fn(),
      insertSampleSchema: jest.fn(),
    };

    const component = createDataPopulationPanelComponent({
      root: document.getElementById('root'),
      props: {
        selectedMode: 'new-table',
        pairwiseVisible: false,
        modeOptions: [
          { value: 'new-table', label: 'New Table' },
          { value: 'amend-selected', label: 'Amend Selected' },
        ],
        rowCountProps: {
          inputId: 'generateCount',
          label: 'How Many?',
          min: 1,
          step: 1,
          value: 1,
          normalizeOnInput: true,
        },
        schemaDefinitionProps: {
          schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
          dataRulesToSchemaText: () => '',
          createBlankRow: () => ({
            id: 'row-1',
            name: '',
            sourceType: 'regex',
            command: '',
            params: '',
            value: '',
            comments: '',
            leadingTextLines: [],
          }),
          mapRuleToRow: (value) => value,
          getMethodPickerOptions: () => [],
          getVisibleDomainCommands: () => [],
          fakerCommands: [],
          sampleSchemaText: '',
          buildModeHelpHtml: () => '',
          validateSchemaRows: (rows) => ({ rows, errors: [] }),
          updatePairwiseButtonVisibility: () => {},
        },
      },
      services: {
        createSharedSchemaDefinitionComponent: () => schemaDefinition,
      },
      callbacks: { onGenerate, onModeChange },
    });

    component.setPairwiseVisible(true);
    expect(document.getElementById('generateallpairs').style.display).toBe('');

    component.setRowCountValue(4);
    expect(document.getElementById('generateCount').value).toBe('4');

    document.getElementById('generatedata').click();
    expect(onGenerate).toHaveBeenCalled();

    const amendSelected = document.querySelector('input[name="testDataGenerationMode"][value="amend-selected"]');
    amendSelected.checked = true;
    amendSelected.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onModeChange).toHaveBeenCalledWith('amend-selected');
    expect(component.getMode()).toBe('amend-selected');

    expect(component.validateSchemaRows()).toEqual({ rows: [], errors: [] });
    component.syncSchemaTextFromRows();
    component.insertSampleSchema();
    expect(schemaDefinition.syncTextFromRows).toHaveBeenCalled();
    expect(schemaDefinition.insertSampleSchema).toHaveBeenCalled();

    component.destroy();
    expect(schemaDefinition.destroy).toHaveBeenCalled();
  });
});
