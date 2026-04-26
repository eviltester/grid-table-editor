import { JSDOM } from 'jsdom';
import { MarkdownOptionsPanel } from '../../js/gui_components/options_panels/options-markdown-panel.js';
import { MarkdownOptions } from '../../js/data_formats/markdown-convertor.js';

describe('MarkdownOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new MarkdownOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    expect(parent.querySelector('.markdown-options')).toBeTruthy();
    expect(parent.querySelector("select[name='spacepadding']")).toBeTruthy();
    expect(parent.querySelector("select[name='tabpadding']")).toBeTruthy();
    expect(parent.querySelector("input[name='borderbars']")).toBeTruthy();
    expect(parent.querySelector("input[name='emboldenheaders']")).toBeTruthy();
    expect(parent.querySelector("input[name='emphasisheaders']")).toBeTruthy();
    expect(parent.querySelector("input[name='emboldencolumns']")).toBeTruthy();
    expect(parent.querySelector("input[name='emphasiscolumns']")).toBeTruthy();
    expect(parent.querySelector("input[name='prettyprint']")).toBeTruthy();
    expect(parent.querySelector("select[name='globalcolumnalign']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui reads default values from the DOM', () => {
    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(MarkdownOptions);
    expect(options.options.spacePadding).toBe('none');
    expect(options.options.tabPadding).toBe('none');
    expect(options.options.borderBars).toBe(false);
    expect(options.options.emboldenHeaders).toBe(false);
    expect(options.options.emphasisHeaders).toBe(false);
    expect(options.options.emboldenColumns).toEqual([]);
    expect(options.options.emphasisColumns).toEqual([]);
    expect(options.options.prettyPrint).toBe(false);
    expect(options.options.globalColumnAlign).toBe('default');
  });

  test('getOptionsFromGui reads edited values and parses column lists', () => {
    parent.querySelector("select[name='spacepadding']").value = 'both';
    parent.querySelector("select[name='tabpadding']").value = 'left';
    parent.querySelector("input[name='borderbars']").checked = true;
    parent.querySelector("input[name='emboldenheaders']").checked = true;
    parent.querySelector("input[name='emphasisheaders']").checked = true;
    parent.querySelector("input[name='emboldencolumns']").value = '1, 3 5';
    parent.querySelector("input[name='emphasiscolumns']").value = '2;4';
    parent.querySelector("input[name='prettyprint']").checked = true;
    parent.querySelector("select[name='globalcolumnalign']").value = 'center';

    const options = panel.getOptionsFromGui();

    expect(options.options.spacePadding).toBe('both');
    expect(options.options.tabPadding).toBe('left');
    expect(options.options.borderBars).toBe(true);
    expect(options.options.emboldenHeaders).toBe(true);
    expect(options.options.emphasisHeaders).toBe(true);
    expect(options.options.emboldenColumns).toEqual([1, 3, 5]);
    expect(options.options.emphasisColumns).toEqual([2, 4]);
    expect(options.options.prettyPrint).toBe(true);
    expect(options.options.globalColumnAlign).toBe('center');
  });

  test('setFromOptions populates the form from options', () => {
    const options = new MarkdownOptions();
    options.options.spacePadding = 'right';
    options.options.tabPadding = 'both';
    options.options.borderBars = false;
    options.options.emboldenHeaders = true;
    options.options.emphasisHeaders = true;
    options.options.emboldenColumns = [1, 3];
    options.options.emphasisColumns = [2, 4];
    options.options.prettyPrint = true;
    options.options.globalColumnAlign = 'left';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='spacepadding']").value).toBe('right');
    expect(parent.querySelector("select[name='tabpadding']").value).toBe('both');
    expect(parent.querySelector("input[name='borderbars']").checked).toBe(false);
    expect(parent.querySelector("input[name='emboldenheaders']").checked).toBe(true);
    expect(parent.querySelector("input[name='emphasisheaders']").checked).toBe(true);
    expect(parent.querySelector("input[name='emboldencolumns']").value).toBe('1 3');
    expect(parent.querySelector("input[name='emphasiscolumns']").value).toBe('2 4');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(true);
    expect(parent.querySelector("select[name='globalcolumnalign']").value).toBe('left');
  });

  test('setFromOptions falls back to defaults when options are missing', () => {
    panel.setFromOptions(undefined);

    expect(parent.querySelector("input[name='borderbars']").checked).toBe(true);
    expect(parent.querySelector("input[name='emboldenheaders']").checked).toBe(false);
    expect(parent.querySelector("input[name='emphasisheaders']").checked).toBe(false);
    expect(parent.querySelector("select[name='spacepadding']").value).toBe('none');
    expect(parent.querySelector("select[name='tabpadding']").value).toBe('none');
    expect(parent.querySelector("select[name='globalcolumnalign']").value).toBe('default');
    expect(parent.querySelector("input[name='emboldencolumns']").value).toBe('');
    expect(parent.querySelector("input[name='emphasiscolumns']").value).toBe('');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
  });

  test('setApplyCallback invokes callback with current gui options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='borderbars']").checked = true;

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.borderBars).toBe(true);
  });
});
