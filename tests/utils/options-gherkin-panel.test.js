import { JSDOM } from 'jsdom';
import { GherkinOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-gherkin-panel.js';
import { GherkinOptions } from '@anywaydata/core/data_formats/gherkin-convertor.js';

describe('GherkinOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new GherkinOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    expect(parent.querySelector('.gherkin-options')).toBeTruthy();
    expect(parent.querySelector("select[name='incellpadding']")).toBeTruthy();
    expect(parent.querySelector("input[name='prettyprint']")).toBeTruthy();
    expect(parent.querySelector("input[name='showheadings']")).toBeTruthy();
    expect(parent.querySelector("input[name='leftindent']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui reads default values from the DOM', () => {
    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(GherkinOptions);
    expect(options.options.showHeadings).toBe(false);
    expect(options.options.leftIndent).toBe('');
    expect(options.options.inCellPadding).toBe('none');
    expect(options.options.prettyPrint).toBe(false);
  });

  test('getOptionsFromGui reads edited values', () => {
    parent.querySelector("input[name='showheadings']").checked = true;
    parent.querySelector("input[name='leftindent']").value = '  ';
    parent.querySelector("select[name='incellpadding']").value = 'both';
    parent.querySelector("input[name='prettyprint']").checked = true;

    const options = panel.getOptionsFromGui();

    expect(options.options.showHeadings).toBe(true);
    expect(options.options.leftIndent).toBe('  ');
    expect(options.options.inCellPadding).toBe('both');
    expect(options.options.prettyPrint).toBe(true);
  });

  test('setFromOptions populates the form from options', () => {
    const options = new GherkinOptions();
    options.options.showHeadings = false;
    options.options.leftIndent = '\t';
    options.options.inCellPadding = 'right';
    options.options.prettyPrint = true;

    panel.setFromOptions(options);

    expect(parent.querySelector("input[name='showheadings']").checked).toBe(false);
    expect(parent.querySelector("input[name='leftindent']").value).toBe('\t');
    expect(parent.querySelector("select[name='incellpadding']").value).toBe('right');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(true);
  });

  test('setFromOptions falls back to defaults when options are missing', () => {
    panel.setFromOptions(undefined);

    expect(parent.querySelector("input[name='showheadings']").checked).toBe(true);
    expect(parent.querySelector("input[name='leftindent']").value).toBe('');
    expect(parent.querySelector("select[name='incellpadding']").value).toBe('none');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
  });

  test('setApplyCallback invokes callback with current GUI options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='showheadings']").checked = true;

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.showHeadings).toBe(true);
  });
});
