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
    expect(component.getRowCountInputValue()).toBe('4');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    component.setRefreshPreviewBusy(true);
    expect(document.getElementById('generatedata').disabled).toBe(true);
    expect(document.getElementById('generateallpairs').disabled).toBe(true);
    expect(document.getElementById('refreshtestdatapreview').disabled).toBe(true);

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);
    component.setRefreshPreviewBusy(false);

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

  test('supports two panel instances with isolated action ids and row counts', () => {
    const firstSchemaDefinition = {
      update: jest.fn(),
      destroy: jest.fn(),
      getState: jest.fn(() => ({ isTextMode: false })),
      validateRows: jest.fn(() => ({ rows: [], errors: [] })),
    };
    const secondSchemaDefinition = {
      update: jest.fn(),
      destroy: jest.fn(),
      getState: jest.fn(() => ({ isTextMode: false })),
      validateRows: jest.fn(() => ({ rows: [], errors: [] })),
    };

    const rootA = document.getElementById('root');
    const rootB = document.createElement('div');
    rootB.id = 'root-b';
    document.body.appendChild(rootB);

    const sharedProps = {
      selectedMode: 'new-table',
      pairwiseVisible: true,
      modeOptions: [{ value: 'new-table', label: 'New Table' }],
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
    };

    const componentA = createDataPopulationPanelComponent({
      root: rootA,
      props: {
        ...sharedProps,
        ids: { schemaDefinitionRoot: 'testDataSchemaDefinitionA' },
        actionIds: {
          generateButton: 'generatedata-a',
          generatePairwiseButton: 'generateallpairs-a',
          refreshPreviewButton: 'refreshtestdatapreview-a',
          status: 'testdata-status-a',
        },
        rowCountProps: {
          inputId: 'generateCountA',
          label: 'How Many?',
          min: 1,
          step: 1,
          value: 2,
        },
      },
      services: {
        createSharedSchemaDefinitionComponent: () => firstSchemaDefinition,
      },
    });

    const componentB = createDataPopulationPanelComponent({
      root: rootB,
      props: {
        ...sharedProps,
        ids: { schemaDefinitionRoot: 'testDataSchemaDefinitionB' },
        actionIds: {
          generateButton: 'generatedata-b',
          generatePairwiseButton: 'generateallpairs-b',
          refreshPreviewButton: 'refreshtestdatapreview-b',
          status: 'testdata-status-b',
        },
        rowCountProps: {
          inputId: 'generateCountB',
          label: 'How Many?',
          min: 1,
          step: 1,
          value: 7,
        },
      },
      services: {
        createSharedSchemaDefinitionComponent: () => secondSchemaDefinition,
      },
    });

    expect(document.getElementById('generateCountA').value).toBe('2');
    expect(document.getElementById('generateCountB').value).toBe('7');
    expect(document.getElementById('generateallpairs-a').style.display).toBe('');
    expect(document.getElementById('generateallpairs-b').style.display).toBe('');

    componentA.setRowCountValue(5);
    expect(document.getElementById('generateCountA').value).toBe('5');
    expect(document.getElementById('generateCountB').value).toBe('7');

    componentA.destroy();
    componentB.destroy();
  });
});
