import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as populationModeSelectorExports from '../../../js/gui_components/app/population-mode-selector/index.js';
import { createPopulationModeSelectorComponent } from '../../../js/gui_components/app/population-mode-selector/index.js';

describe('PopulationModeSelector', () => {
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
    expect(populationModeSelectorExports.createPopulationModeSelectorComponent).toBe(
      createPopulationModeSelectorComponent
    );
    expect(populationModeSelectorExports.PopulationModeSelectorController).toBeUndefined();
    expect(populationModeSelectorExports.PopulationModeSelectorView).toBeUndefined();
  });

  test('renders radio options and emits mode changes', () => {
    const onChange = jest.fn();
    const component = createPopulationModeSelectorComponent({
      root: document.getElementById('root'),
      props: {
        name: 'testDataGenerationMode',
        selectedMode: 'new-table',
        options: [
          { value: 'new-table', label: 'New Table' },
          { value: 'amend-table', label: 'Amend Table' },
        ],
      },
      callbacks: { onChange },
    });

    const amendRadio = document.querySelector('input[name="testDataGenerationMode"][value="amend-table"]');
    amendRadio.checked = true;
    amendRadio.dispatchEvent(new Event('change', { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith('amend-table');
    expect(component.getMode()).toBe('amend-table');
    component.destroy();
  });
});
