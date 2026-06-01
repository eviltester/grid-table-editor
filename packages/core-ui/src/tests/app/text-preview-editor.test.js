import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTextPreviewEditorComponent } from '../../../js/gui_components/app/text-preview-editor/index.js';

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

  test('binds tooltip help on mount and updates preview mode help text', () => {
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

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(helpIcon.getAttribute('data-help-text')).toContain('first 10 rows');

    component.update({
      mode: 'edit',
      previewRowLimit: 10,
      autoPreviewEnabled: false,
    });

    expect(helpIcon.getAttribute('data-help-text')).toContain('Edit mode');
  });
});
