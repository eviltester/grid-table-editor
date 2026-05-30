import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { bootstrapGeneratorPage } from '../../../../../../packages/core-ui/js/generator-script.js';

describe('generator bootstrap', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body><p id="generator-initial-load">Please Wait, Loading Libraries...</p><div id="generator-app"></div></body></html>`
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
    const ensureGridLibraryLoadedFn = jest.fn(() => {
      calls.push('load');
      const loadingMessage = dom.window.document.getElementById('generator-initial-load');
      expect(loadingMessage).not.toBeNull();
      expect(loadingMessage.textContent).toContain('Please Wait, Loading Libraries...');
      expect(loadingMessage.classList.contains('is-loading')).toBe(true);
      expect(loadingMessage.querySelector('[data-role="loading-indicator"]')).not.toBeNull();
      return Promise.resolve();
    });
    class DataGeneratorPageClass {
      constructor() {}
      init() {
        calls.push('init');
      }
    }

    await bootstrapGeneratorPage({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      DataGeneratorPageClass,
      fakerInstance: {},
    });

    expect(calls).toEqual(['load', 'init']);
    expect(ensureGridLibraryLoadedFn).toHaveBeenCalledWith({
      engine: 'tabulator',
      document: dom.window.document,
    });
    expect(dom.window.document.getElementById('generator-initial-load')).toBeNull();
  });

  test('returns early when tabulator library fails to load', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const ensureGridLibraryLoadedFn = jest.fn(() => Promise.reject(new Error('failed')));
    const initSpy = jest.fn();

    class DataGeneratorPageClass {
      init() {
        initSpy();
      }
    }

    await bootstrapGeneratorPage({
      documentObj: dom.window.document,
      ensureGridLibraryLoadedFn,
      DataGeneratorPageClass,
      fakerInstance: {},
    });

    expect(initSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    const loadingMessage = dom.window.document.getElementById('generator-initial-load');
    expect(loadingMessage).not.toBeNull();
    expect(loadingMessage.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(loadingMessage.classList.contains('is-loading')).toBe(false);
  });
});
