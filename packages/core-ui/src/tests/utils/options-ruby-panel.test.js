import { JSDOM } from 'jsdom';
import { RubyOptionsPanel } from '../../../js/gui_components/options_panels/options-ruby-panel.js';
import { RubyConvertorOptions } from '@anywaydata/core/data_formats/ruby-convertor.js';

describe('RubyOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new RubyOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders and returns RubyConvertorOptions', () => {
    expect(parent.querySelector('.ruby-options')).toBeTruthy();
    expect(panel.getOptionsFromGui()).toBeInstanceOf(RubyConvertorOptions);
  });

  test('setFromOptions updates controls', () => {
    const options = new RubyConvertorOptions();
    options.options.collectionType = 'list';
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.outputWrapper = 'rspec-let';
    options.options.quoteNumbers = true;
    options.options.hashKeyStyle = 'symbol';
    options.options.useAnonymousObjects = false;
    options.options.objectClassName = 'Person';
    options.options.objectRepresentation = 'struct';
    options.options.fieldNameStyle = 'snake_case';
    options.options.prettyPrint = true;
    options.options.hashPrettyStyle = 'aligned';
    options.options.prettyPrintDelimiter = '\t';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('list');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("select[name='outputwrapper']").value).toBe('rspec-let');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("select[name='hashkeystyle']").value).toBe('symbol');
    expect(parent.querySelector("input[name='useanonymousobjects']").checked).toBe(false);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
    expect(parent.querySelector("select[name='objectrepresentation']").value).toBe('struct');
    expect(parent.querySelector("select[name='fieldnamestyle']").value).toBe('snake_case');
    expect(parent.querySelector("select[name='hashprettystyle']").value).toBe('aligned');
  });
});
