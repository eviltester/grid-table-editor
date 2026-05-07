import { JSDOM } from 'jsdom';
import { initHelpTooltips } from '../../../js/help/help-tooltips.js';

describe('help tooltips module', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    delete global.tippy;
    jest.restoreAllMocks();
  });

  test('creates inline-help-items and loads shared entries', () => {
    global.tippy = jest.fn();
    initHelpTooltips({ documentObj: dom.window.document });

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container).not.toBeNull();
    expect(container.querySelector("div[data-name='json-options']")).not.toBeNull();
    expect(container.querySelector("div[data-name='test-data-summary-title']")).toBeNull();
    expect(global.tippy).toHaveBeenCalledTimes(1);
  });

  test('includes app-only entries when requested', () => {
    global.tippy = jest.fn();
    initHelpTooltips({ documentObj: dom.window.document, includeAppOnlyEntries: true });

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container.querySelector("div[data-name='test-data-summary-title']")).not.toBeNull();
  });

  test('registers window.updateHelpHints and handles missing tippy', () => {
    initHelpTooltips({ documentObj: dom.window.document });
    expect(typeof dom.window.updateHelpHints).toBe('function');
    expect(() => dom.window.updateHelpHints()).not.toThrow();
  });
});
