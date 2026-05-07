import { JSDOM } from 'jsdom';
import { KotlinOptionsPanel } from '../../../js/gui_components/options_panels/options-kotlin-panel.js';
import { KotlinConvertorOptions } from '@anywaydata/core/data_formats/kotlin-convertor.js';

describe('KotlinOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new KotlinOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders and returns KotlinConvertorOptions', () => {
    expect(parent.querySelector('.kotlin-options')).toBeTruthy();
    expect(panel.getOptionsFromGui()).toBeInstanceOf(KotlinConvertorOptions);
  });

  test('setFromOptions updates controls', () => {
    const options = new KotlinConvertorOptions();
    options.options.collectionType = 'array';
    options.options.assignToVariable = false;
    options.options.mutableAssignment = true;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.useAnonymousObjects = false;
    options.options.useMutableCollections = true;
    options.options.objectClassName = 'Person';
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = '\t';
    options.options.trailingComma = false;

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('array');
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='mutableassignment']").checked).toBe(true);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("input[name='useanonymousobjects']").checked).toBe(false);
    expect(parent.querySelector("input[name='usemutablecollections']").checked).toBe(true);
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
    expect(parent.querySelector("input[name='trailingcomma']").checked).toBe(false);
  });
});
