import { JSDOM } from 'jsdom';
import { TypeScriptOptionsPanel } from '../../js/gui_components/options_panels/options-typescript-panel.js';
import { TypeScriptConvertorOptions } from '../../js/data_formats/typescript-convertor.js';

describe('TypeScriptOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new TypeScriptOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders typescript options panel and returns TypeScriptConvertorOptions', () => {
    expect(parent.querySelector('.typescript-options')).toBeTruthy();

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(TypeScriptConvertorOptions);
  });

  test('setFromOptions applies values to controls', () => {
    const options = new TypeScriptConvertorOptions();
    options.options.collectionType = 'array';
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.useAnonymousObjects = false;
    options.options.objectClassName = 'Employee';
    options.options.blankValueBehavior = 'empty-string';
    options.options.prettyPrint = false;
    options.options.prettyPrintDelimiter = '  ';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('array');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("input[name='useanonymousobjects']").checked).toBe(false);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Employee');
    expect(parent.querySelector("select[name='blankvaluebehavior']").value).toBe('empty-string');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(false);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('  ');
  });

  test('setApplyCallback invokes callback with current options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);

    parent.querySelector("input[name='quotenumbers']").checked = true;
    parent.querySelector("input[name='useanonymousobjects']").checked = false;
    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(TypeScriptConvertorOptions);
    expect(callback.mock.calls[0][0].options.quoteNumbers).toBe(true);
    expect(callback.mock.calls[0][0].options.useAnonymousObjects).toBe(false);
  });

  test('getOptionsFromGui round-trip with defaults', () => {
    const options = panel.getOptionsFromGui();

    expect(options.options.collectionType).toBe('list');
    expect(options.options.assignToVariable).toBe(true);
    expect(options.options.variableName).toBe('data');
    expect(options.options.quoteNumbers).toBe(false);
    expect(options.options.useAnonymousObjects).toBe(true);
    expect(options.options.objectClassName).toBe('Row');
    expect(options.options.blankValueBehavior).toBe('null');
    expect(options.options.prettyPrint).toBe(true);
  });
});
