import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createHelpTooltipService, createUpdateHelpHints, initHelpTooltips } from '../../../js/help/help-tooltips.js';

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
    const tippy = jest.fn();
    const service = initHelpTooltips({ documentObj: dom.window.document, windowObj: { tippy } });

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container).not.toBeNull();
    expect(container.querySelector("div[data-name='json-options']")).not.toBeNull();
    expect(container.querySelector("div[data-name='test-data-summary-title']")).toBeNull();
    expect(tippy).toHaveBeenCalledTimes(1);
    expect(typeof service?.update).toBe('function');
    expect(typeof service?.destroy).toBe('function');
  });

  test('includes app-only entries when requested', () => {
    initHelpTooltips({
      documentObj: dom.window.document,
      windowObj: { tippy: jest.fn() },
      includeAppOnlyEntries: true,
    });

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container.querySelector("div[data-name='test-data-summary-title']")).not.toBeNull();
  });

  test('registers window.updateHelpHints and handles missing tippy', () => {
    const service = initHelpTooltips({ documentObj: dom.window.document });
    expect(typeof dom.window.updateHelpHints).toBe('function');
    expect(() => dom.window.updateHelpHints()).not.toThrow();
    service.destroy();
    expect(dom.window.updateHelpHints).toBeUndefined();
  });

  test('createUpdateHelpHints seeds shared inline help entries for scoped component usage', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const container = dom.window.document.getElementById('inline-help-items');
    expect(container).not.toBeNull();
    expect(container.querySelector("div[data-name='csv-options']")).not.toBeNull();
    expect(tippy).toHaveBeenCalledTimes(1);
    const helpIcon = root.querySelector('.helpicon');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
    expect(helpIcon.querySelector('svg.helpicon-svg')).not.toBeNull();
    expect(helpIcon.querySelector('svg.helpicon-svg').getAttribute('aria-hidden')).toBe('true');
    expect(tippy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        interactive: true,
        interactiveBorder: 16,
        delay: [250, 300],
        hideOnClick: false,
      })
    );
  });

  test('tooltip content keeps using the owned inline-help container instead of re-querying it globally', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const [, tippyOptions] = tippy.mock.calls[0];
    const helpIcon = root.querySelector('.helpicon');
    const getElementByIdSpy = jest.spyOn(dom.window.document, 'getElementById').mockImplementation(() => {
      throw new Error('unexpected global help container lookup');
    });

    expect(tippyOptions.content(helpIcon)).toContain('CSV');
    expect(getElementByIdSpy).not.toHaveBeenCalled();
  });

  test('option help icons get an option-specific accessible label', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon option-help-icon" data-help="csv-option-header"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const helpIcon = root.querySelector('.helpicon');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(helpIcon.querySelector('svg.helpicon-svg')).not.toBeNull();
  });

  test('renders help icons even when tippy is unavailable', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root);
    updateHelpHints();

    const helpIcon = root.querySelector('.helpicon');
    expect(helpIcon.querySelector('svg.helpicon-svg')).not.toBeNull();
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
  });

  test('createHelpTooltipService exposes destroy lifecycle and clears the window hook it registered', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const destroyMock = jest.fn();
    root.querySelector('.helpicon')._tippy = { destroy: destroyMock };

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      windowObj: dom.window,
      rootElement: root,
      registerWindowHook: true,
    });

    service.update();
    expect(dom.window.updateHelpHints).toBe(service.update);

    service.destroy();

    expect(destroyMock).toHaveBeenCalled();
    expect(dom.window.updateHelpHints).toBeUndefined();
  });

  test('createHelpTooltipService destroy only tears down scoped tooltip instances', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `
      <span class="helpicon" data-help="csv-options"></span>
      <span class="helpicon" data-help="json-options"></span>
    `;
    dom.window.document.body.appendChild(root);

    const outsideHelpIcon = dom.window.document.createElement('span');
    outsideHelpIcon.className = 'helpicon';
    outsideHelpIcon.setAttribute('data-help', 'xml-options');
    const outsideDestroyMock = jest.fn();
    outsideHelpIcon._tippy = { destroy: outsideDestroyMock };
    dom.window.document.body.appendChild(outsideHelpIcon);

    const scopedDestroyMocks = [jest.fn(), jest.fn()];
    const scopedHelpIcons = Array.from(root.querySelectorAll('.helpicon'));
    scopedHelpIcons[0]._tippy = { destroy: scopedDestroyMocks[0] };
    scopedHelpIcons[1]._tippy = { destroy: scopedDestroyMocks[1] };

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      rootElement: root,
    });

    service.destroy();

    expect(scopedDestroyMocks[0]).toHaveBeenCalled();
    expect(scopedDestroyMocks[1]).toHaveBeenCalled();
    expect(outsideDestroyMock).not.toHaveBeenCalled();
  });

  test('prefers injected tippy/browser dependencies instead of ambient global tippy', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const injectedTippy = jest.fn();
    global.tippy = jest.fn();

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      windowObj: { tippy: injectedTippy },
      rootElement: root,
    });

    service.update();

    expect(injectedTippy).toHaveBeenCalledTimes(1);
    expect(global.tippy).not.toHaveBeenCalled();
  });
});
