import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { createTextPreviewEditorComponent } from '../../../js/gui_components/app/text-preview-editor/index.js';

function getRenderedButtonText(button) {
  return button?.innerText ?? button?.textContent?.trim() ?? '';
}

describe('TextPreviewEditor', () => {
  let dom;
  let documentObj;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    documentObj = dom.window.document;
    root = documentObj.getElementById('root');
    global.document = documentObj;
    global.window = dom.window;
    global.tippy = jest.fn();
  });

  afterEach(() => {
    dom.window.close();
    delete global.tippy;
    jest.restoreAllMocks();
  });

  test('binds tooltip help on mount, renders preview row control, and updates preview mode help text', () => {
    const component = createTextPreviewEditorComponent({
      root,
      documentObj,
      props: {
        mode: 'preview',
        previewRowLimit: 10,
        autoPreviewEnabled: true,
      },
    });

    const helpIcon = root.querySelector('#previewEditModeHelpIcon');
    const previewRowCount = root.querySelector('#previewRowsCount');
    const previewButton = root.querySelector('#previewEditModeButton');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(previewRowCount).not.toBeNull();
    expect(previewRowCount.value).toBe('10');
    expect(previewRowCount.getAttribute('aria-label')).toBe('Preview row count');
    expect(previewRowCount.min).toBe('1');
    expect(root.textContent).not.toContain('Preview Items Count');
    expect(getRenderedButtonText(previewButton)).toBe('Preview');
    expect(helpIcon.getAttribute('data-help-text')).toContain('first 10 rows');

    previewRowCount.value = '7';
    fireEvent.input(previewRowCount, { target: { value: '7' } });

    expect(helpIcon.getAttribute('data-help-text')).toContain('first 7 rows');

    component.update({
      mode: 'edit',
      previewRowLimit: 7,
      autoPreviewEnabled: false,
    });

    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit mode');
    expect(getRenderedButtonText(previewButton)).toBe('Edit');
    expect(previewRowCount.disabled).toBe(true);
  });
});
