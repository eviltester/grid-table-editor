import { JSDOM } from 'jsdom';
import { HtmlOptionsPanel } from '../../js/gui_components/options_panels/options-html-panel.js';
import { HtmlConvertorOptions } from '@anywaydata/core/data_formats/html-convertor.js';

describe('HtmlOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new HtmlOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    expect(parent.querySelector('.html-options')).toBeTruthy();
    expect(parent.querySelector("input[name='compacthtml']")).toBeTruthy();
    expect(parent.querySelector("input[name='prettyprint']")).toBeTruthy();
    expect(parent.querySelector("select[name='prettydelimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='custom-pretty-delimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='addthead']")).toBeTruthy();
    expect(parent.querySelector("input[name='addtbody']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui reads default values from the DOM', () => {
    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(HtmlConvertorOptions);
    expect(options.options.compact).toBe(false);
    expect(options.options.prettyPrint).toBe(false);
    expect(options.options.prettyPrintDelimiter).toBe('\t');
    expect(options.options.addTheadToTable).toBe(false);
    expect(options.options.addTbodyToTable).toBe(false);
  });

  test('getOptionsFromGui reads edited values including custom delimiter', () => {
    parent.querySelector("input[name='compacthtml']").checked = true;
    parent.querySelector("input[name='prettyprint']").checked = true;
    parent.querySelector("select[name='prettydelimiter']").value = 'custom';
    parent.querySelector("input[name='custom-pretty-delimiter']").value = '  ';
    parent.querySelector("input[name='addthead']").checked = true;
    parent.querySelector("input[name='addtbody']").checked = true;

    const options = panel.getOptionsFromGui();

    expect(options.options.compact).toBe(true);
    expect(options.options.prettyPrint).toBe(true);
    expect(options.options.prettyPrintDelimiter).toBe('  ');
    expect(options.options.addTheadToTable).toBe(true);
    expect(options.options.addTbodyToTable).toBe(true);
  });

  test('setFromOptions populates the form from mapped delimiter options', () => {
    const options = new HtmlConvertorOptions();
    options.options.compact = true;
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = ' ';
    options.options.addTheadToTable = true;
    options.options.addTbodyToTable = true;

    panel.setFromOptions(options);

    expect(parent.querySelector("input[name='compacthtml']").checked).toBe(true);
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(true);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('space');
    expect(parent.querySelector("input[name='addthead']").checked).toBe(true);
    expect(parent.querySelector("input[name='addtbody']").checked).toBe(true);
  });

  test('setFromOptions falls back to custom delimiter when mapping is unknown', () => {
    const options = new HtmlConvertorOptions();
    options.options.prettyPrintDelimiter = '--';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('--');
  });

  test('setFromOptions falls back to defaults when options are missing', () => {
    panel.setFromOptions({ options: {}, delimiterMappings: { tab: '\t', space: ' ' } });

    expect(parent.querySelector("input[name='compacthtml']").checked).toBe(false);
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
    expect(parent.querySelector("input[name='addthead']").checked).toBe(false);
    expect(parent.querySelector("input[name='addtbody']").checked).toBe(false);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('undefined');
  });

  test('setFromOptions handles missing options object by using defaults', () => {
    panel.setFromOptions({ delimiterMappings: { tab: '\t', space: ' ' } });

    expect(parent.querySelector("input[name='compacthtml']").checked).toBe(false);
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
    expect(parent.querySelector("input[name='addthead']").checked).toBe(false);
    expect(parent.querySelector("input[name='addtbody']").checked).toBe(false);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('undefined');
  });

  test('setApplyCallback invokes callback with current GUI options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='compacthtml']").checked = true;

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.compact).toBe(true);
  });
});
