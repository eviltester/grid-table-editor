import { JSDOM } from 'jsdom';
import { TestFrameworkOptionsPanel } from '../../../js/gui_components/options_panels/options-test-framework-panel.js';
import { getTipsForFormat } from '@anywaydata/core';
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
    expect(parent.querySelector("select[name='framework-id']")).toBeTruthy();
    expect(parent.querySelector("input[name='suite-name']")).toBeTruthy();
    expect(parent.querySelector("input[name='test-name-prefix']")).toBeTruthy();
    expect(parent.querySelector("select[name='data-source-strategy']")).toBeTruthy();
  });

  test('getOptionsFromGui reads values', () => {
    const panel = new TestFrameworkOptionsPanel(parent, 'junit5');
    panel.addToGui();
    parent.querySelector("select[name='framework-id']").value = 'junit4';
    parent.querySelector("input[name='suite-name']").value = 'MySuite';
    parent.querySelector("input[name='test-name-prefix']").value = 'case';
    parent.querySelector("select[name='data-source-strategy']").value = 'inline';
    parent.querySelector("input[name='include-setup']").checked = false;

    const options = panel.getOptionsFromGui();
    expect(options).toBeInstanceOf(TestFrameworkConvertorOptions);
    expect(options.outputFormat).toBe('junit4');
    expect(options.options.suiteName).toBe('MySuite');
    expect(options.options.testNamePrefix).toBe('case');
    expect(options.options.dataSourceStrategy).toBe('inline');
    expect(options.options.includeSetup).toBe(false);
  });

  test('junit5/junit6 data source strategies are provider+inline only', () => {
    const junit5Panel = new TestFrameworkOptionsPanel(parent, 'junit5');
    junit5Panel.addToGui();
    const junit5Options = Array.from(parent.querySelectorAll("select[name='data-source-strategy'] option")).map(
      (option) => option.value
    );
    expect(junit5Options).toEqual(['provider', 'inline']);

    const pytestPanel = new TestFrameworkOptionsPanel(parent, 'pytest');
    pytestPanel.addToGui();
    const pytestOptions = Array.from(parent.querySelectorAll("select[name='data-source-strategy'] option")).map(
      (option) => option.value
    );
    expect(pytestOptions).not.toContain('csv');
  });

  test('framework selector only shows frameworks for the selected language group', () => {
    const javaPanel = new TestFrameworkOptionsPanel(parent, 'junit5');
    javaPanel.addToGui();
    const javaFrameworks = Array.from(parent.querySelectorAll("select[name='framework-id'] option")).map(
      (option) => option.value
    );
    expect(javaFrameworks).toEqual(['junit4', 'junit5', 'junit6', 'testng']);

    const pythonPanel = new TestFrameworkOptionsPanel(parent, 'pytest');
    pythonPanel.addToGui();
    const pythonFrameworks = Array.from(parent.querySelectorAll("select[name='framework-id'] option")).map(
      (option) => option.value
    );
    expect(pythonFrameworks).toEqual(['pytest', 'unittest', 'nose2']);
  });

  test('help text tips are sourced from shared catalog and refresh on framework change', () => {
    const panel = new TestFrameworkOptionsPanel(parent, 'junit5');
    panel.addToGui();

    const includeSetupHelp = parent.querySelector("[data-help='test-framework-option-include-setup']");
    expect(includeSetupHelp.getAttribute('data-help-text')).toBe(getTipsForFormat('junit5').includeSetup);

    const frameworkSelect = parent.querySelector("select[name='framework-id']");
    frameworkSelect.value = 'testng';
    frameworkSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(includeSetupHelp.getAttribute('data-help-text')).toBe(getTipsForFormat('testng').includeSetup);
  });
});
