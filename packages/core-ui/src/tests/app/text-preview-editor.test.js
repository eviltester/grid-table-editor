import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { createTextPreviewEditorComponent } from '../../../js/gui_components/app/text-preview-editor/index.js';

function getRenderedButtonText(button) {
  return button?.innerText ?? button?.textContent?.trim() ?? '';
}

function getPreviewRowCountInput(rootElement) {
  return rootElement.querySelector('[data-role="preview-row-count-root"] input');
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
    dom.window.tippy = global.tippy;
  });

  afterEach(() => {
    dom.window.close();
    delete global.tippy;
    delete dom.window.tippy;
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

    const helpIcon = root.querySelector('[data-role="preview-edit-mode-help"]');
    const previewRowCount = getPreviewRowCountInput(root);
    const previewButton = root.querySelector('[data-role="preview-edit-mode-button"]');
    const autoPreviewCheckbox = root.querySelector('[data-role="auto-preview-checkbox"]');
    const textArea = root.querySelector('[data-role="preview-text-editor"]');
    const copyButton = root.querySelector('[data-role="copy-text-button"]');
    const selectorRoot = root.querySelector('[data-role="format-selector-root"]');
    const subtasksRoot = root.querySelector('[data-role="format-subtasks-root"]');
    const editArea = root.querySelector('[data-role="edit-area"]');
    const optionsPanelRoot = root.querySelector('[data-role="options-panel-root"]');
    const optionsPreviewSplitter = root.querySelector('[data-role="options-preview-splitter"]');
    const textAreaWrapper = root.querySelector('[data-role="preview-text-wrapper"]');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(previewRowCount).not.toBeNull();
    expect(previewRowCount.value).toBe('10');
    expect(previewRowCount.id).toBe('');
    expect(previewRowCount.getAttribute('aria-label')).toBe('Preview row count');
    expect(previewRowCount.min).toBe('1');
    expect(editArea).not.toBeNull();
    expect(optionsPanelRoot).not.toBeNull();
    expect(optionsPreviewSplitter).not.toBeNull();
    expect(root.textContent).not.toContain('Preview Items Count');
    expect(root.querySelector('.shared-row-count-label')).not.toBeNull();
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

    expect(previewButton).not.toBeNull();
    expect(autoPreviewCheckbox).not.toBeNull();
    expect(textArea).not.toBeNull();
    expect(copyButton).not.toBeNull();
    expect(selectorRoot).not.toBeNull();
    expect(subtasksRoot).not.toBeNull();
    expect(textAreaWrapper).not.toBeNull();
    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit mode');
    expect(getRenderedButtonText(previewButton)).toBe('Edit');
    expect(previewRowCount.disabled).toBe(true);
  });
});
