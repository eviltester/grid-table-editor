import { JSDOM } from 'jsdom';
import { PhpOptionsPanel } from '../../../js/gui_components/options_panels/options-php-panel.js';
import { PhpConvertorOptions } from '@anywaydata/core/data_formats/php-convertor.js';

describe('PhpOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new PhpOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders and returns PhpConvertorOptions', () => {
    expect(parent.querySelector('.php-options')).toBeTruthy();
    expect(panel.getOptionsFromGui()).toBeInstanceOf(PhpConvertorOptions);
  });

  test('setFromOptions updates controls', () => {
    const options = new PhpConvertorOptions();
    options.options.collectionType = 'list';
    options.options.includePhpTag = true;
    options.options.preferShortArraySyntax = true;
    options.options.assignToVariable = false;
    options.options.variableName = 'rows';
    options.options.quoteNumbers = true;
    options.options.objectRepresentation = 'class';
    options.options.objectClassName = 'Person';
    options.options.arrayKeyQuoteStyle = 'unquoted';
    options.options.blankValueBehavior = 'null';
    options.options.coerceBooleanLiterals = true;
    options.options.coerceNullLiteral = true;
    options.options.phpCompatibility = '7+';
    options.options.classPropertyTyping = 'typed';
    options.options.useConstructorPromotion = true;
    options.options.constructorArgStyle = 'named';
    options.options.prettyPrint = true;
    options.options.prettyPrintDelimiter = '\t';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='collectiontype']").value).toBe('list');
    expect(parent.querySelector("input[name='includephptag']").checked).toBe(true);
    expect(parent.querySelector("input[name='shortarraysyntax']").checked).toBe(true);
    expect(parent.querySelector("input[name='assigntovariable']").checked).toBe(false);
    expect(parent.querySelector("input[name='variablename']").value).toBe('rows');
    expect(parent.querySelector("input[name='quotenumbers']").checked).toBe(true);
    expect(parent.querySelector("select[name='objectrepresentation']").value).toBe('class');
    expect(parent.querySelector("input[name='objectclassname']").value).toBe('Person');
    expect(parent.querySelector("select[name='arraykeyquotestyle']").value).toBe('unquoted');
    expect(parent.querySelector("select[name='blankvaluebehavior']").value).toBe('null');
    expect(parent.querySelector("input[name='coercebooleanliterals']").checked).toBe(true);
    expect(parent.querySelector("input[name='coercenullliteral']").checked).toBe(true);
    expect(parent.querySelector("select[name='phpcompatibility']").value).toBe('7+');
    expect(parent.querySelector("select[name='classpropertytyping']").value).toBe('typed');
    expect(parent.querySelector("input[name='useconstructorpromotion']").checked).toBe(true);
    expect(parent.querySelector("select[name='constructorargstyle']").value).toBe('named');
  });
});
