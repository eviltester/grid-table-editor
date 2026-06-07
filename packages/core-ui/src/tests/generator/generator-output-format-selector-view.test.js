import { describe, expect, jest, test } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorOutputFormatSelectorComponent } from '../../../js/gui_components/generator/output-format-selector/index.js';

function createFormatGroups() {
  return {
    core: [
      { type: 'csv', label: 'CSV' },
      { type: 'json', label: 'JSON' },
    ],
    code: [{ type: 'python', label: 'Python' }],
    unitTest: [{ type: 'jest', label: 'Jest' }],
  };
}

describe('GeneratorOutputFormatSelectorView', () => {
  test('renders supported format groups and emits changes', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const onFormatChange = jest.fn();
    const component = createGeneratorOutputFormatSelectorComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      props: {
        selectedFormat: 'csv',
      },
      services: {
        getOutputFormatGroups: createFormatGroups,
        canExportFormat: (type) => type !== 'python',
      },
      callbacks: {
        onFormatChange,
      },
    });

    const select = dom.window.document.querySelector('[data-role="generator-output-format-select"]');
    expect(select).not.toBeNull();
    expect(Array.from(select.querySelectorAll('option')).map((option) => option.value)).toEqual([
      'csv',
      'json',
      'jest',
    ]);
    expect(component.getSelectedFormat()).toBe('csv');

    select.value = 'json';
    select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(component.getState()).toEqual({
      selectedFormat: 'json',
    });
    expect(component.getSelectedFormat()).toBe('json');
    expect(onFormatChange).toHaveBeenCalledWith('json');

    component.update({ selectedFormat: 'jest' });
    expect(select.value).toBe('jest');

    component.destroy();
    dom.window.close();
  });
});
