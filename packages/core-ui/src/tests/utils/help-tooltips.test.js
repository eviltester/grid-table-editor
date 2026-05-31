import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createUpdateHelpHints, initHelpTooltips } from '../../../js/help/help-tooltips.js';

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

  test('createUpdateHelpHints seeds shared inline help entries for scoped component usage', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    global.tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root);
    updateHelpHints();

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container).not.toBeNull();
    expect(container.querySelector("div[data-name='csv-options']")).not.toBeNull();
    expect(global.tippy).toHaveBeenCalledTimes(1);
    const helpIcon = root.querySelector('.helpicon');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
    expect(global.tippy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        interactive: true,
        interactiveBorder: 16,
        delay: [100, 300],
        hideOnClick: false,
      })
    );
  });

  test('option help icons get an option-specific accessible label', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon option-help-icon" data-help="csv-option-header"></span>`;
    dom.window.document.body.appendChild(root);

    global.tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root);
    updateHelpHints();

    const helpIcon = root.querySelector('.helpicon');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
  });
});
