import { JSDOM } from 'jsdom';
import { DelimitedOptions } from '../../js/gui_components/options_panels/options-delimited-controls.js';
import { DelimiterOptions } from '../../js/data_formats/delimiter-options.js';

describe('DelimitedOptions', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new DelimitedOptions(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    expect(parent.querySelector('.delimited-options')).toBeTruthy();
    expect(parent.querySelector("select[name='delimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='custom-delimiter']")).toBeTruthy();
    expect(parent.querySelector("input[name='quotes']")).toBeTruthy();
    expect(parent.querySelector("input[name='header']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui reads default values from the DOM', () => {
    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(DelimiterOptions);
    expect(options.options.delimiter).toBe('\t');
    expect(options.options.quotes).toBe(false);
    expect(options.options.header).toBe(false);
    expect(options.options.quoteChar).toBe('"');
    expect(options.options.escapeChar).toBe('"');
  });

  test('getOptionsFromGui supports a custom delimiter', () => {
    parent.querySelector("select[name='delimiter']").value = 'custom';
    parent.querySelector("input[name='custom-delimiter']").value = '||';
    parent.querySelector("input[name='quotes']").checked = true;
    parent.querySelector("input[name='header']").checked = true;
    parent.querySelector("input[name='quoteChar']").value = "'";
    parent.querySelector("input[name='escapeChar']").value = '!';

    const options = panel.getOptionsFromGui();

    expect(options.options.delimiter).toBe('||');
    expect(options.options.quotes).toBe(true);
    expect(options.options.header).toBe(true);
    expect(options.options.quoteChar).toBe("'");
    expect(options.options.escapeChar).toBe('!');
  });

  test('setFromOptions populates mapped delimiter and text fields', () => {
    const options = new DelimiterOptions(',');
    options.options.quotes = true;
    options.options.header = true;
    options.options.quoteChar = "'";
    options.options.escapeChar = '!';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='delimiter']").value).toBe('comma');
    expect(parent.querySelector("input[name='quotes']").checked).toBe(true);
    expect(parent.querySelector("input[name='header']").checked).toBe(true);
    expect(parent.querySelector("input[name='quoteChar']").value).toBe("'");
    expect(parent.querySelector("input[name='escapeChar']").value).toBe('!');
  });

  test('setFromOptions falls back to custom delimiter when mapping is unknown', () => {
    const options = new DelimiterOptions('||');

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='delimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-delimiter']").value).toBe('||');
  });

  test('setApplyCallback invokes callback with current GUI options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("select[name='delimiter']").value = 'pipe';

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.delimiter).toBe('|');
  });
});
