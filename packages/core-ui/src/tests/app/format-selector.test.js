import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';
import { createFormatSelectorComponent } from '../../../js/gui_components/app/format-selector/index.js';

describe('FormatSelector', () => {
  let dom;
  let documentObj;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div><div id="subtasks"></div></body></html>');
    documentObj = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('selecting a grouped code format emits the selected subtask type', () => {
    const onFormatChange = jest.fn();
    const component = createFormatSelectorComponent({
      root: documentObj.getElementById('root'),
      subtasksRoot: documentObj.getElementById('subtasks'),
      documentObj,
      callbacks: {
        onFormatChange,
      },
    });

    documentObj.querySelector('.type-select-action[data-tab-id="code"]')?.click();
    documentObj.querySelector('.subtask-select-action[data-type="python"]')?.click();

    expect(onFormatChange).toHaveBeenLastCalledWith('python');
    expect(component.getSelectedFormat()).toBe('python');
    expect(documentObj.querySelector('.subtask-select.active-type')?.getAttribute('data-type')).toBe('python');
  });
});
