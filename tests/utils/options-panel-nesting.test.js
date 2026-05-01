import { JSDOM } from 'jsdom';
import { JsonOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-json-panel.js';
import { PythonOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-python-panel.js';

describe('Options panel nested visual hierarchy', () => {
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

  test('JSON panel marks dependent controls as visual children', () => {
    const panel = new JsonOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.prettydelimiter.option-child')).toBeTruthy();
    expect(parent.querySelector('.custom-pretty-delimiter.option-child')).toBeTruthy();
    expect(parent.querySelector('.propertynamed.option-child')).toBeTruthy();
  });

  test('Python panel marks dependent controls as visual children', () => {
    const panel = new PythonOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.variablename.option-child')).toBeTruthy();
    expect(parent.querySelector('.decimalcolumnscsv.option-child')).toBeTruthy();
    expect(parent.querySelector('.decimaltreatintegers.option-child')).toBeTruthy();
    expect(parent.querySelector('.importstatements.option-child')).toBeTruthy();
    expect(parent.querySelector('.objectclassname.option-child')).toBeTruthy();
    expect(parent.querySelector('.custom-pretty-delimiter.option-child')).toBeTruthy();
  });
});
