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

  test('initHelpTooltips scopes help-icon scanning to the provided root element', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="json-options"></span>`;
    dom.window.document.body.appendChild(root);

    const outsideHelpIcon = dom.window.document.createElement('span');
    outsideHelpIcon.className = 'helpicon';
    outsideHelpIcon.setAttribute('data-help-role', 'help-icon');
    outsideHelpIcon.setAttribute('data-help', 'csv-options');
    dom.window.document.body.appendChild(outsideHelpIcon);

    const tippy = jest.fn();
    initHelpTooltips({
      documentObj: dom.window.document,
      windowObj: { tippy },
      rootElement: root,
    });

    const [helpIcons] = tippy.mock.calls[0];
    expect(Array.from(helpIcons)).toEqual([root.querySelector('[data-help-role="help-icon"]')]);
  });

  test('handles missing tippy without creating a window-global update hook', () => {
    const service = initHelpTooltips({ documentObj: dom.window.document });
    expect(() => service.update()).not.toThrow();
    service.destroy();
    expect(dom.window.updateHelpHints).toBeUndefined();
  });

  test('createUpdateHelpHints seeds shared inline help entries for scoped component usage', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const container = root.querySelector('[data-role="inline-help-items"]');
    expect(container).not.toBeNull();
    expect(container.querySelector("div[data-name='csv-options']")).not.toBeNull();
    expect(dom.window.document.getElementById('inline-help-items')).toBeNull();
    expect(tippy).toHaveBeenCalledTimes(1);
    const helpIcon = root.querySelector('[data-help-role="help-icon"]');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
    expect(helpIcon.getAttribute('aria-expanded')).toBe('false');
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
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const [, tippyOptions] = tippy.mock.calls[0];
    const helpIcon = root.querySelector('[data-help-role="help-icon"]');
    const getElementByIdSpy = jest.spyOn(dom.window.document, 'getElementById').mockImplementation(() => {
      throw new Error('unexpected global help container lookup');
    });

    expect(tippyOptions.content(helpIcon)).toContain('CSV');
    expect(getElementByIdSpy).not.toHaveBeenCalled();
  });

  test('tooltip content preserves the authored help html without runtime rewriting', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML =
      '<span class="helpicon" data-help-role="help-icon" data-help-text=\'<p><a href="https://anywaydata.com/docs/intro">Docs</a> <a href="https://anywaydata.com/blog">Blog</a></p>\'></span>';
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();
    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: dom.window,
      tippyFn: tippy,
    });

    updateHelpHints();

    const [, tippyOptions] = tippy.mock.calls[0];
    const helpIcon = root.querySelector('[data-help-role="help-icon"]');
    const content = tippyOptions.content(helpIcon);

    expect(content).toContain('https://anywaydata.com/docs/intro');
    expect(content).toContain('https://anywaydata.com/blog');
  });

  test('scoped updateHelpHints uses root-scoped help containers instead of creating the global registry', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="json-options"></span>`;
    dom.window.document.body.appendChild(root);

    const getElementByIdSpy = jest.spyOn(dom.window.document, 'getElementById');
    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy: jest.fn() },
    });

    updateHelpHints();

    expect(root.querySelector('[data-role="inline-help-items"]')).not.toBeNull();
    expect(getElementByIdSpy).not.toHaveBeenCalledWith('inline-help-items');
    expect(dom.window.document.querySelector('#inline-help-items')).toBeNull();
  });

  test('option help icons get an option-specific accessible label', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon option-help-icon" data-role="option-help-icon" data-help-role="option-help-icon" data-help="csv-option-header"></span>`;
    dom.window.document.body.appendChild(root);

    const tippy = jest.fn();

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root, {
      windowObj: { tippy },
    });
    updateHelpHints();

    const helpIcon = root.querySelector('[data-help-role="option-help-icon"]');
    expect(helpIcon.getAttribute('tabindex')).toBe('0');
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help for this option');
    expect(helpIcon.getAttribute('aria-expanded')).toBe('false');
    expect(helpIcon.querySelector('svg.helpicon-svg')).not.toBeNull();
  });

  test('renders help icons even when tippy is unavailable', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const updateHelpHints = createUpdateHelpHints(dom.window.document, root);
    updateHelpHints();

    const helpIcon = root.querySelector('[data-help-role="help-icon"]');
    expect(helpIcon.querySelector('svg.helpicon-svg')).not.toBeNull();
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
    expect(helpIcon.getAttribute('aria-expanded')).toBe('false');
  });

  test('createUpdateHelpHints defaults document roots to body instead of appending containers directly to the document', () => {
    const helpIcon = dom.window.document.createElement('span');
    helpIcon.className = 'helpicon';
    helpIcon.setAttribute('data-help-role', 'help-icon');
    helpIcon.setAttribute('data-help', 'csv-options');
    dom.window.document.body.appendChild(helpIcon);

    const updateHelpHints = createUpdateHelpHints(dom.window.document, undefined, {
      windowObj: { tippy: jest.fn() },
    });

    expect(() => updateHelpHints()).not.toThrow();
    expect(dom.window.document.body.querySelector('[data-role="inline-help-items"]')).not.toBeNull();
  });

  test('createHelpTooltipService exposes destroy lifecycle for scoped tooltip instances', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const destroyMock = jest.fn();
    root.querySelector('[data-help-role="help-icon"]')._tippy = { destroy: destroyMock };

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      windowObj: dom.window,
      rootElement: root,
      resolveHelpElements: () => root.querySelectorAll('[data-help-role][data-help]'),
    });

    service.update();

    service.destroy();

    expect(destroyMock).toHaveBeenCalled();
    expect(dom.window.updateHelpHints).toBeUndefined();
  });

  test('createHelpTooltipService destroy only tears down scoped tooltip instances', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `
      <span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>
      <span class="helpicon" data-help-role="help-icon" data-help="json-options"></span>
    `;
    dom.window.document.body.appendChild(root);

    const outsideHelpIcon = dom.window.document.createElement('span');
    outsideHelpIcon.className = 'helpicon';
    outsideHelpIcon.setAttribute('data-help-role', 'help-icon');
    outsideHelpIcon.setAttribute('data-help', 'xml-options');
    const outsideDestroyMock = jest.fn();
    outsideHelpIcon._tippy = { destroy: outsideDestroyMock };
    dom.window.document.body.appendChild(outsideHelpIcon);

    const scopedDestroyMocks = [jest.fn(), jest.fn()];
    const scopedHelpIcons = Array.from(root.querySelectorAll('[data-help-role="help-icon"]'));
    scopedHelpIcons[0]._tippy = { destroy: scopedDestroyMocks[0] };
    scopedHelpIcons[1]._tippy = { destroy: scopedDestroyMocks[1] };

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      rootElement: root,
      resolveHelpElements: () => root.querySelectorAll('[data-help-role][data-help]'),
    });

    service.destroy();

    expect(scopedDestroyMocks[0]).toHaveBeenCalled();
    expect(scopedDestroyMocks[1]).toHaveBeenCalled();
    expect(outsideDestroyMock).not.toHaveBeenCalled();
  });

  test('prefers injected tippy/browser dependencies instead of ambient global tippy', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const injectedTippy = jest.fn();
    global.tippy = jest.fn();

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      windowObj: { tippy: injectedTippy },
      rootElement: root,
      resolveHelpElements: () => root.querySelectorAll('[data-help-role][data-help]'),
    });

    service.update();

    expect(injectedTippy).toHaveBeenCalledTimes(1);
    expect(global.tippy).not.toHaveBeenCalled();
  });

  test('createHelpTooltipService uses the injected help-element resolver instead of scanning the root itself', () => {
    const root = dom.window.document.createElement('section');
    root.innerHTML = `<span class="helpicon" data-help-role="help-icon" data-help="csv-options"></span>`;
    dom.window.document.body.appendChild(root);

    const helpIcon = root.querySelector('[data-help-role="help-icon"]');
    const rootQuerySpy = jest.spyOn(root, 'querySelectorAll').mockImplementation(() => {
      throw new Error('unexpected root scan');
    });
    const tippy = jest.fn();

    const service = createHelpTooltipService({
      documentObj: dom.window.document,
      rootElement: root,
      tippyFn: tippy,
      resolveHelpElements: () => [helpIcon],
    });

    expect(() => service.update()).not.toThrow();
    service.destroy();

    expect(rootQuerySpy).not.toHaveBeenCalled();
    expect(tippy).toHaveBeenCalledTimes(1);
  });
});
