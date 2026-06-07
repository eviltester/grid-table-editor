import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { createTextPreviewToolbarComponent } from '../../../js/gui_components/app/text-preview-toolbar/index.js';

function getRenderedButtonText(button) {
  return button?.innerText ?? button?.textContent?.trim() ?? '';
}

function getPreviewRowCountInput(rootElement) {
  return rootElement.querySelector('[data-role="preview-row-count-root"] input');
}

describe('TextPreviewToolbar', () => {
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

  test('renders help text, row count control, and toolbar actions for preview and edit states', () => {
    const onToggleMode = jest.fn();
    const onAutoPreviewChange = jest.fn();
    const onPreviewRowLimitChange = jest.fn();
    const onCopyText = jest.fn();
    const component = createTextPreviewToolbarComponent({
      root,
      documentObj,
      props: {
        mode: 'preview',
        previewRowLimit: 10,
        autoPreviewEnabled: true,
      },
      callbacks: {
        onToggleMode,
        onAutoPreviewChange,
        onPreviewRowLimitChange,
        onCopyText,
      },
    });

    const helpIcon = root.querySelector('[data-role="preview-edit-mode-help"]');
    const previewRowCount = getPreviewRowCountInput(root);
    const previewButton = root.querySelector('[data-role="preview-edit-mode-button"]');
    const autoPreviewCheckbox = root.querySelector('[data-role="auto-preview-checkbox"]');
    const copyButton = root.querySelector('[data-role="copy-text-button"]');
    const selectorRoot = root.querySelector('[data-role="format-selector-root"]');
    const subtasksRoot = root.querySelector('[data-role="format-subtasks-root"]');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(previewRowCount.value).toBe('10');
    expect(previewRowCount.getAttribute('aria-label')).toBe('Preview row count');
    expect(getRenderedButtonText(previewButton)).toBe('Preview');
    expect(helpIcon.getAttribute('data-help-text')).toContain('first 10 rows');
    expect(selectorRoot).not.toBeNull();
    expect(subtasksRoot).not.toBeNull();

    fireEvent.click(previewButton);
    fireEvent.click(copyButton);

    previewRowCount.value = '7';
    fireEvent.input(previewRowCount, { target: { value: '7' } });
    fireEvent.click(autoPreviewCheckbox);

    expect(onToggleMode).toHaveBeenCalledTimes(1);
    expect(onCopyText).toHaveBeenCalledWith({
      button: copyButton,
    });
    expect(onPreviewRowLimitChange).toHaveBeenLastCalledWith(7);
    expect(onAutoPreviewChange).toHaveBeenCalledWith(false);
    expect(helpIcon.getAttribute('data-help-text')).toContain('first 7 rows');

    component.update({
      mode: 'edit',
      previewRowLimit: 7,
      autoPreviewEnabled: false,
    });

    expect(getRenderedButtonText(previewButton)).toBe('Edit');
    expect(previewRowCount.disabled).toBe(true);
    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit mode');

    component.setCopyButtonText('Copied');
    expect(copyButton.textContent).toBe('Copied');
  });
});
