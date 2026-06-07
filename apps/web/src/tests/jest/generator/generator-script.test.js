import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { bootstrapGeneratorPage } from '../../../../../../packages/core-ui/js/generator-script.js';

describe('generator bootstrap', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body><div class="header" data-role="theme-toggle-host"><div class="pageheading">AnyWayData</div></div><div id="generator-page-root"></div><p id="generator-initial-load">Please Wait, Loading Libraries...</p></body></html>`,
      { url: 'https://example.test/generator.html' }
    );
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('loads tabulator library before initializing page', async () => {
    const calls = [];
    const initHelpTooltipsFn = jest.fn();
    const ensureGridLibraryLoadedFn = jest.fn(() => {
      calls.push('load');
      const loadingMessage = dom.window.document.getElementById('generator-initial-load');
      expect(loadingMessage).not.toBeNull();
      expect(loadingMessage.textContent).toContain('Please Wait, Loading Libraries...');
      expect(loadingMessage.classList.contains('is-loading')).toBe(true);
      expect(loadingMessage.querySelector('[data-role="loading-indicator"]')).not.toBeNull();
      return Promise.resolve();
    });
    const page = { destroy: jest.fn() };
    const createDataGeneratorPageFn = jest.fn(() => {
      calls.push('init');
      return page;
    });

    await bootstrapGeneratorPage({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      createDataGeneratorPageFn,
      fakerInstance: {},
      initHelpTooltipsFn,
    });

    expect(calls).toEqual(['load', 'init']);
    expect(ensureGridLibraryLoadedFn).toHaveBeenCalledWith({
      engine: 'tabulator',
      document: dom.window.document,
    });
    expect(createDataGeneratorPageFn).toHaveBeenCalledWith({
      parentElement: dom.window.document.getElementById('generator-app'),
      documentObj: dom.window.document,
      faker: {},
      RandExp: undefined,
    });
    expect(initHelpTooltipsFn).toHaveBeenCalledWith({
      documentObj: dom.window.document,
      rootElement: dom.window.document.getElementById('generator-page-root'),
    });
    expect(dom.window.document.getElementById('generator-initial-load')).toBeNull();
  });

  test('returns early when tabulator library fails to load', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const ensureGridLibraryLoadedFn = jest.fn(() => Promise.reject(new Error('failed')));
    const createDataGeneratorPageFn = jest.fn();

    await bootstrapGeneratorPage({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      createDataGeneratorPageFn,
      fakerInstance: {},
    });

    expect(createDataGeneratorPageFn).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    const loadingMessage = dom.window.document.getElementById('generator-initial-load');
    expect(loadingMessage).not.toBeNull();
    expect(loadingMessage.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(loadingMessage.classList.contains('is-loading')).toBe(false);
  });

  test('fails startup status and rethrows when page init throws after libraries load', async () => {
    const initError = new Error('init failed');
    const initHelpTooltipsFn = jest.fn();
    const createDataGeneratorPageFn = jest.fn(() => {
      throw initError;
    });

    await expect(
      bootstrapGeneratorPage({
        documentObj: dom.window.document,
        ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
        createDataGeneratorPageFn,
        fakerInstance: {},
        initHelpTooltipsFn,
      })
    ).rejects.toThrow(initError);

    expect(initHelpTooltipsFn).not.toHaveBeenCalled();
    const loadingMessage = dom.window.document.getElementById('generator-initial-load');
    expect(loadingMessage).not.toBeNull();
    expect(loadingMessage.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(loadingMessage.classList.contains('is-loading')).toBe(false);
  });

  test('fails startup status and rethrows when tooltip init throws after page init', async () => {
    const tooltipError = new Error('tooltip init failed');
    const createDataGeneratorPageFn = jest.fn(() => ({
      destroy() {},
    }));

    await expect(
      bootstrapGeneratorPage({
        documentObj: dom.window.document,
        ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
        createDataGeneratorPageFn,
        fakerInstance: {},
        initHelpTooltipsFn: () => {
          throw tooltipError;
        },
      })
    ).rejects.toThrow(tooltipError);

    expect(createDataGeneratorPageFn).toHaveBeenCalledTimes(1);
    const loadingMessage = dom.window.document.getElementById('generator-initial-load');
    expect(loadingMessage).not.toBeNull();
    expect(loadingMessage.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(loadingMessage.classList.contains('is-loading')).toBe(false);
  });

  test('does not require a global document when an injected document is provided', async () => {
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const page = { destroy: jest.fn() };
      const createDataGeneratorPageFn = jest.fn(() => page);

      await expect(
        bootstrapGeneratorPage({
          documentObj: dom.window.document,
          ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
          createDataGeneratorPageFn,
          fakerInstance: {},
          initHelpTooltipsFn: jest.fn(),
        })
      ).resolves.toEqual(
        expect.objectContaining({
          page,
        })
      );
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
    }
  });

  test('throws when no generator page factory is provided', async () => {
    await expect(
      bootstrapGeneratorPage({
        documentObj: dom.window.document,
        ensureGridLibraryLoadedFn: jest.fn(() => Promise.resolve()),
        createDataGeneratorPageFn: null,
        fakerInstance: {},
        initHelpTooltipsFn: jest.fn(),
      })
    ).rejects.toThrow('bootstrapGeneratorPage requires createDataGeneratorPageFn');
  });
});
