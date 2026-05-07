import { JSDOM } from 'jsdom';
import { PerlOptionsPanel } from '../../../js/gui_components/options_panels/options-perl-panel.js';
import { PerlConvertorOptions } from '@anywaydata/core/data_formats/perl-convertor.js';

describe('PerlOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new PerlOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders and returns PerlConvertorOptions', () => {
    expect(parent.querySelector('.perl-options')).toBeTruthy();
    expect(panel.getOptionsFromGui()).toBeInstanceOf(PerlConvertorOptions);
  });

  test('setFromOptions updates controls', () => {
    const options = new PerlConvertorOptions();
    options.options.collectionType = 'list';
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.hashKeyStyle = 'bareword';
    options.options.useAnonymousObjects = false;
    options.options.objectClassName = 'Person';
    options.options.objectInstantiationStyle = 'constructor';
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = '\t';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('list');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("select[name='hashkeystyle']").value).toBe('bareword');
    expect(parent.querySelector("input[name='useanonymousobjects']").checked).toBe(false);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
    expect(parent.querySelector("select[name='objectinstantiationstyle']").value).toBe('constructor');
  });
});
