import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { within } from '@testing-library/dom';
import * as dataPopulationPanelExports from '../../../js/gui_components/app/data-population-panel/index.js';
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

  test('public barrel is component-factory-only', () => {
    expect(dataPopulationPanelExports.createDataPopulationPanelComponent).toBe(createDataPopulationPanelComponent);
    expect(dataPopulationPanelExports.DataPopulationPanelController).toBeUndefined();
    expect(dataPopulationPanelExports.DataPopulationPanelView).toBeUndefined();
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

    const panelRoot = document.querySelector('[data-role="data-population-panel-root"]');
    const panelQueries = within(panelRoot);
    const generateButton = panelQueries.getByRole('button', { name: /^generate$/i });
    const generatePairwiseButton = panelRoot.querySelector('[data-role="generate-pairwise-button"]');
    const generatePairwiseWrapper = panelRoot.querySelector('[data-role="generate-pairwise-button-wrapper"]');
    const rowCountInput = panelQueries.getByRole('spinbutton', { name: 'How Many?' });

    expect(panelRoot).not.toBeNull();
    expect(panelRoot?.classList.contains('testDataSchemaGui')).toBe(true);
    expect(panelRoot.querySelector('[data-role="population-status"]')?.id).toBe('');
    expect(document.getElementById('testdata-status')).toBeNull();
    expect(panelRoot.querySelector('[data-role="schema-definition-root"]')?.id).toBe('');
    expect(document.getElementById('testDataSchemaDefinition')).toBeNull();
    expect(rowCountInput.id).toBe('');
    expect(document.getElementById('generateCount')).toBeNull();
    expect(document.getElementById('populationActionsRoot')).toBeNull();
    expect(document.getElementById('generateCountControl')).toBeNull();
    expect(document.getElementById('populationModeSelectorRoot')).toBeNull();
    expect(panelRoot.querySelectorAll('[data-help-role="help-icon"]')).toHaveLength(2);

    component.setPairwiseVisible(true);
    expect(generatePairwiseWrapper.style.display).toBe('inline-flex');

    component.setRowCountValue(4);
    expect(rowCountInput.value).toBe('4');
    expect(component.getRowCountInputValue()).toBe('4');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    expect(generateButton.disabled).toBe(true);
    expect(generatePairwiseButton.disabled).toBe(true);

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);

    generateButton.click();
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
          generatePairwiseButtonWrapper: 'generateallpairs-wrapper-a',
          generatePairwiseButton: 'generateallpairs-a',
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
          generatePairwiseButtonWrapper: 'generateallpairs-wrapper-b',
          generatePairwiseButton: 'generateallpairs-b',
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

    const panelRootA = rootA.querySelector('[data-role="data-population-panel-root"]');
    const panelRootB = rootB.querySelector('[data-role="data-population-panel-root"]');
    const rowCountInputA = within(panelRootA).getByRole('spinbutton', { name: 'How Many?' });
    const rowCountInputB = within(panelRootB).getByRole('spinbutton', { name: 'How Many?' });
    const generatePairwiseButtonA = panelRootA.querySelector('[data-role="generate-pairwise-button"]');
    const generatePairwiseButtonB = panelRootB.querySelector('[data-role="generate-pairwise-button"]');

    expect(rowCountInputA.value).toBe('2');
    expect(rowCountInputB.value).toBe('7');
    expect(generatePairwiseButtonA.style.display).toBe('');
    expect(generatePairwiseButtonB.style.display).toBe('');
    expect(panelRootA.querySelector('[data-role="schema-definition-root"]')?.id).toBe('testDataSchemaDefinitionA');
    expect(panelRootB.querySelector('[data-role="schema-definition-root"]')?.id).toBe('testDataSchemaDefinitionB');

    componentA.setRowCountValue(5);
    expect(rowCountInputA.value).toBe('5');
    expect(rowCountInputB.value).toBe('7');

    componentA.destroy();
    componentB.destroy();
  });
});
