import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { within } from '@testing-library/dom';
import * as toolbarExports from '../../../js/gui_components/app/test-data-population-toolbar/index.js';
import { createTestDataPopulationToolbarComponent } from '../../../js/gui_components/app/test-data-population-toolbar/index.js';

describe('TestDataPopulationToolbar', () => {
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
    expect(toolbarExports.createTestDataPopulationToolbarComponent).toBe(createTestDataPopulationToolbarComponent);
    expect(toolbarExports.TestDataPopulationToolbarController).toBeUndefined();
    expect(toolbarExports.TestDataPopulationToolbarView).toBeUndefined();
  });

  test('composes actions, row count, and mode selector', () => {
    const onGenerate = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onGenerateSchemaFromGrid = jest.fn();
    const onModeChange = jest.fn();

    const component = createTestDataPopulationToolbarComponent({
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
      },
      callbacks: {
        onGenerate,
        onGeneratePairwise,
        onGenerateSchemaFromGrid,
        onModeChange,
      },
    });

    const toolbarRoot = document.querySelector('[data-role="test-data-population-toolbar-root"]');
    const toolbarQueries = within(toolbarRoot);
    const generateButton = toolbarQueries.getByRole('button', { name: /^generate$/i });
    const generateSchemaButton = toolbarQueries.getByRole('button', { name: /^grid to enum schema$/i });
    const rowCountInput = toolbarQueries.getByRole('spinbutton', { name: 'How Many?' });
    const generationSettingsButton = toolbarQueries.getByRole('button', { name: 'Generation settings' });
    const generatePairwiseWrapper = toolbarRoot.querySelector('[data-role="generate-pairwise-button-wrapper"]');

    expect(toolbarRoot).not.toBeNull();
    expect(toolbarRoot.classList.contains('data-population-toolbar')).toBe(true);
    expect(generatePairwiseWrapper.style.display).toBe('none');
    expect(toolbarQueries.getByRole('radio', { name: 'New Table' }).checked).toBe(true);
    expect(generationSettingsButton.getAttribute('aria-expanded')).toBe('false');
    generationSettingsButton.click();
    const unsafeFakerCheckbox = toolbarQueries.getByRole('checkbox', { name: 'allow unsafe faker' });
    expect(unsafeFakerCheckbox.checked).toBe(false);
    expect(component.getUnsafeFakerExpressions()).toBe(false);

    component.setPairwiseVisible(true);
    expect(generatePairwiseWrapper.style.display).toBe('inline-flex');
    const generateCombinationsButton = toolbarQueries.getByRole('button', { name: 'Generate Combinations' });

    component.setRowCountValue(4);
    expect(rowCountInput.value).toBe('4');
    expect(component.getRowCountInputValue()).toBe('4');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    component.setGenerateSchemaBusy(true);
    expect(generateButton.disabled).toBe(true);
    expect(generateCombinationsButton.disabled).toBe(true);
    expect(generateSchemaButton.disabled).toBe(true);
    expect(generateButton.getAttribute('aria-disabled')).toBe('true');

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);
    component.setGenerateSchemaBusy(false);
    generateButton.click();
    generateSchemaButton.click();
    expect(onGenerate).toHaveBeenCalled();
    expect(onGenerateSchemaFromGrid).toHaveBeenCalled();

    unsafeFakerCheckbox.checked = true;
    unsafeFakerCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(component.getUnsafeFakerExpressions()).toBe(true);

    const amendSelected = toolbarQueries.getByRole('radio', { name: 'Amend Selected' });
    amendSelected.checked = true;
    amendSelected.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onModeChange).toHaveBeenCalledWith('amend-selected');
    expect(component.getMode()).toBe('amend-selected');

    component.destroy();
  });
});
