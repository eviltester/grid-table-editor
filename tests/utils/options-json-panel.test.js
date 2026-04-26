import { JSDOM } from 'jsdom';
import { JsonOptionsPanel } from '../../js/gui_components/options_panels/options-json-panel.js';
import { JsonConvertorOptions } from '../../js/data_formats/json-convertor.js';
import { JavascriptConvertorOptions } from '../../js/data_formats/javascript-convertor.js';

describe('JsonOptionsPanel', () => {
  let dom;
  let parent;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls for the default JSON panel', () => {
    const panel = new JsonOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.json-options')).toBeTruthy();
    expect(parent.querySelector("input[name='numbersnumeric']")).toBeTruthy();
    expect(parent.querySelector("input[name='prettyprint']")).toBeTruthy();
    expect(parent.querySelector("select[name='prettydelimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='custom-pretty-delimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='asobject']")).toBeTruthy();
    expect(parent.querySelector("input[name='propertynamed']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui returns JSON options with DOM values applied', () => {
    const panel = new JsonOptionsPanel(parent);
    panel.addToGui();
    parent.querySelector("input[name='numbersnumeric']").checked = true;
    parent.querySelector("input[name='prettyprint']").checked = false;
    parent.querySelector("select[name='prettydelimiter']").value = 'custom';
    parent.querySelector("input[name='custom-pretty-delimiter']").value = '  ';
    parent.querySelector("input[name='asobject']").checked = true;
    parent.querySelector("input[name='propertynamed']").value = 'records';

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(JsonConvertorOptions);
    expect(options.options.makeNumbersNumeric).toBe(true);
    expect(options.options.prettyPrint).toBe(false);
    expect(options.options.prettyPrintDelimiter).toBe('  ');
    expect(options.options.asObject).toBe(true);
    expect(options.options.asPropertyNamed).toBe('records');
  });

  test('getOptionsFromGui returns JavaScript options when using a javascript panel class', () => {
    const panel = new JsonOptionsPanel(parent, 'javascript-options');
    panel.addToGui();
    parent.querySelector("input[name='numbersnumeric']").checked = true;

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(JavascriptConvertorOptions);
    expect(options.options.makeNumbersNumeric).toBe(true);
  });

  test('setFromOptions populates the form including mapped delimiters', () => {
    const panel = new JsonOptionsPanel(parent);
    panel.addToGui();
    const options = new JsonConvertorOptions();
    options.options.makeNumbersNumeric = true;
    options.options.prettyPrint = false;
    options.options.prettyPrintDelimiter = ' ';
    options.options.asObject = true;
    options.options.asPropertyNamed = 'payload';

    panel.setFromOptions(options);

    expect(parent.querySelector("input[name='numbersnumeric']").checked).toBe(true);
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('space');
    expect(parent.querySelector("input[name='asobject']").checked).toBe(true);
    expect(parent.querySelector("input[name='propertynamed']").value).toBe('payload');
  });

  test('setFromOptions falls back to custom delimiter when mapping is unknown', () => {
    const panel = new JsonOptionsPanel(parent);
    panel.addToGui();
    const options = new JsonConvertorOptions();
    options.options.prettyPrintDelimiter = '--';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('--');
  });

  test('setApplyCallback invokes callback with current GUI options', () => {
    const panel = new JsonOptionsPanel(parent);
    const callback = jest.fn();
    panel.addToGui();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='asobject']").checked = true;

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.asObject).toBe(true);
  });
});
