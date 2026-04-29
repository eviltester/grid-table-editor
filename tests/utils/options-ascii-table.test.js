import { JSDOM } from 'jsdom';
import { AsciiTableOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-ascii-table.js';
import { AsciiTableOptions } from '@anywaydata/core/data_formats/asciitable-convertor.js';

describe('AsciiTableOptionsPanel', () => {
  let dom;
  let parent;
  let panel;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    panel = new AsciiTableOptionsPanel(parent);
    panel.addToGui();
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders style options and apply button', () => {
    const styleSelect = parent.querySelector("select[name='style']");

    expect(parent.querySelector('.delimited-options')).toBeTruthy();
    expect(styleSelect).toBeTruthy();
    expect(styleSelect.options.length).toBeGreaterThan(1);
    expect(parent.querySelector("select[name='style'] option[value='ramac']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui reads the selected style', () => {
    parent.querySelector("select[name='style']").value = 'github-markdown';

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(AsciiTableOptions);
    expect(options.options.style).toBe('github-markdown');
  });

  test('setFromOptions selects the configured style', () => {
    const options = new AsciiTableOptions();
    options.options.style = 'unicode-double';

    panel.setFromOptions(options);

    expect(parent.querySelector("select[name='style']").value).toBe('unicode-double');
  });

  test('setApplyCallback invokes callback with current gui options', () => {
    const callback = jest.fn();
    panel.setApplyCallback(callback);
    parent.querySelector("select[name='style']").value = 'compact';

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.style).toBe('compact');
  });
});
