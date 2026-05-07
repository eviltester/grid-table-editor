import { JSDOM } from 'jsdom';
import { PythonOptionsPanel } from '../../../js/gui_components/options_panels/options-python-panel.js';
import { PythonConvertorOptions } from '@anywaydata/core/data_formats/python-convertor.js';

describe('PythonOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new PythonOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders python options panel and returns PythonConvertorOptions', () => {
    expect(parent.querySelector('.python-options')).toBeTruthy();

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(PythonConvertorOptions);
  });

  test('setFromOptions applies values to controls', () => {
    const options = new PythonConvertorOptions();
    options.options.collectionType = 'tuple';
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.useDecimalType = true;
    options.options.decimalColumnsCsv = 'Money, Column 2';
    options.options.decimalTreatIntegersAsDecimal = true;
    options.options.blankValueBehavior = 'none';
    options.options.quoteStyle = 'single';
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = '  ';
    options.options.includeImports = true;
    options.options.importStatements = 'from dataclasses import dataclass';
    options.options.useAnonymousDicts = false;
    options.options.objectClassName = 'Person';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('tuple');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("input[name='usedecimaltype']").checked).toBe(true);
    expect(parent.querySelector("input[name='decimalcolumnscsv']").value).toBe('Money, Column 2');
    expect(parent.querySelector("input[name='decimaltreatintegers']").checked).toBe(true);
    expect(parent.querySelector("select[name='blankvaluebehavior']").value).toBe('none');
    expect(parent.querySelector("select[name='quotestyle']").value).toBe('single');
    expect(parent.querySelector("input[name='prettyprint']").checked).toBe(true);
    expect(parent.querySelector("select[name='prettydelimiter']").value).toBe('custom');
    expect(parent.querySelector("input[name='custom-pretty-delimiter']").value).toBe('  ');
    expect(parent.querySelector("input[name='includeimports']").checked).toBe(true);
    expect(parent.querySelector("textarea[name='importstatements']").value).toBe('from dataclasses import dataclass');
    expect(parent.querySelector("input[name='useanonymousdicts']").checked).toBe(false);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
  });

  test('setApplyCallback invokes callback with current options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);

    parent.querySelector("input[name='usedecimaltype']").checked = true;
    parent.querySelector("input[name='decimalcolumnscsv']").value = 'Money, Column 2';
    parent.querySelector("input[name='decimaltreatintegers']").checked = true;
    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(PythonConvertorOptions);
    expect(callback.mock.calls[0][0].options.useDecimalType).toBe(true);
    expect(callback.mock.calls[0][0].options.decimalColumnsCsv).toBe('Money, Column 2');
    expect(callback.mock.calls[0][0].options.decimalTreatIntegersAsDecimal).toBe(true);
  });
});
