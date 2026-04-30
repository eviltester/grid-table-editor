import { JSDOM } from 'jsdom';
import { JavascriptOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-javascript-panel.js';
import { JavascriptConvertorOptions } from '@anywaydata/core/data_formats/javascript-convertor.js';

describe('JavascriptOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new JavascriptOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders using the javascript panel class and returns javascript options', () => {
    expect(parent.querySelector('.javascript-options')).toBeTruthy();

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(JavascriptConvertorOptions);
  });

  test('setFromOptions delegates to the JSON panel form controls', () => {
    const options = new JavascriptConvertorOptions();
    options.options.makeNumbersNumeric = true;
    options.options.prettyPrint = false;
    options.options.prettyPrintDelimiter = ' ';
    options.options.asObject = true;
    options.options.asPropertyNamed = 'rows';

    panel.setFromOptions(options);

    expect(parent.querySelector("input[name='numbersnumeric']").checked).toBe(true);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('space');
    expect(parent.querySelector("input[name='asobject']").checked).toBe(true);
    expect(parent.querySelector("input[name='propertynamed']").value).toBe('rows');
  });

  test('setApplyCallback invokes callback with current javascript options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='asobject']").checked = true;

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(JavascriptConvertorOptions);
    expect(callback.mock.calls[0][0].options.asObject).toBe(true);
  });
});
