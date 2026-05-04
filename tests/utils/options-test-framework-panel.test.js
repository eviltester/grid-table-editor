import { JSDOM } from 'jsdom';
import { TestFrameworkOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-test-framework-panel.js';
import { TestFrameworkConvertorOptions } from '@anywaydata/core/data_formats/test-framework-convertor.js';

describe('TestFrameworkOptionsPanel', () => {
  let dom;
  let parent;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    const panel = new TestFrameworkOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.test-framework-options')).toBeTruthy();
    expect(parent.querySelector("input[name='suite-name']")).toBeTruthy();
    expect(parent.querySelector("input[name='test-name-prefix']")).toBeTruthy();
    expect(parent.querySelector("select[name='assertion-style']")).toBeTruthy();
    expect(parent.querySelector("select[name='data-source-strategy']")).toBeTruthy();
  });

  test('getOptionsFromGui reads values', () => {
    const panel = new TestFrameworkOptionsPanel(parent);
    panel.addToGui();
    parent.querySelector("input[name='suite-name']").value = 'MySuite';
    parent.querySelector("input[name='test-name-prefix']").value = 'case';
    parent.querySelector("select[name='assertion-style']").value = 'basic';
    parent.querySelector("select[name='data-source-strategy']").value = 'inline';
    parent.querySelector("input[name='include-setup']").checked = false;

    const options = panel.getOptionsFromGui();
    expect(options).toBeInstanceOf(TestFrameworkConvertorOptions);
    expect(options.options.suiteName).toBe('MySuite');
    expect(options.options.testNamePrefix).toBe('case');
    expect(options.options.assertionStyle).toBe('basic');
    expect(options.options.dataSourceStrategy).toBe('inline');
    expect(options.options.includeSetup).toBe(false);
  });
});
