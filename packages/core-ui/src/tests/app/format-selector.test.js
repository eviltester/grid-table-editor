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

    const tabsList = documentObj.querySelector('[data-role="format-tabs-list"]');
    expect(tabsList).not.toBeNull();

    documentObj.querySelector('[data-role="format-main-tab-action"][data-tab-id="code"]')?.click();
    documentObj.querySelector('[data-role="format-subtask-action"][data-type="python"]')?.click();

    expect(onFormatChange).toHaveBeenLastCalledWith('python');
    expect(component.getSelectedFormat()).toBe('python');
    expect(documentObj.querySelector('[data-role="format-subtasks-list"]')).not.toBeNull();
    expect(
      documentObj
        .querySelector('[data-role="format-subtask-item"][data-active-format="true"]')
        ?.getAttribute('data-type')
    ).toBe('python');
  });
});
