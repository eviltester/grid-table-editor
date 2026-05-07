import { JSDOM } from 'jsdom';
import { CSharpOptionsPanel } from '../../../js/gui_components/options_panels/options-csharp-panel.js';
import { CSharpConvertorOptions } from '@anywaydata/core/data_formats/csharp-convertor.js';

describe('CSharpOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new CSharpOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders and returns CSharpConvertorOptions', () => {
    expect(parent.querySelector('.csharp-options')).toBeTruthy();
    expect(panel.getOptionsFromGui()).toBeInstanceOf(CSharpConvertorOptions);
  });

  test('setFromOptions updates controls', () => {
    const options = new CSharpConvertorOptions();
    options.options.collectionTargetType = 'ireadonlylist';
    options.options.collectionType = 'list';
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.dictionaryValueType = 'string';
    options.options.useAnonymousObjects = false;
    options.options.objectClassName = 'Person';
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = '\t';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('ireadonlylist');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("select[name='dictionaryvaluetype']").value).toBe('string');
    expect(parent.querySelector("input[name='useanonymousobjects']").checked).toBe(false);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
  });
});
