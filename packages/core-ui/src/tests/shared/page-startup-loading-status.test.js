import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createPageStartupLoadingStatus } from '../../../js/gui_components/shared/page-startup-loading-status.js';

describe('createPageStartupLoadingStatus', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="startup-status"></div></body></html>');
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('fail renders an explicit error severity state', () => {
    const status = createPageStartupLoadingStatus({
      documentObj: dom.window.document,
      resolveElement: () => dom.window.document.getElementById('startup-status'),
    });
    const element = dom.window.document.getElementById('startup-status');

    status.fail();

    expect(element?.textContent).toContain('Failed to load libraries. Check console for details.');
    expect(element?.getAttribute('data-severity')).toBe('error');
    expect(element?.classList.contains('is-loading')).toBe(false);
  });

  test('clear removes the startup element when a document is available', () => {
    const status = createPageStartupLoadingStatus({
      documentObj: dom.window.document,
      resolveElement: () => dom.window.document.getElementById('startup-status'),
    });

    status.show();
    status.clear();

    expect(dom.window.document.getElementById('startup-status')).toBeNull();
  });

  test('show, fail, and clear do not throw when documentObj is null', () => {
    const status = createPageStartupLoadingStatus({
      documentObj: null,
      resolveElement: () => null,
    });

    expect(() => status.show()).not.toThrow();
    expect(() => status.fail()).not.toThrow();
    expect(() => status.clear()).not.toThrow();
  });

  test('resolves the owner document from a provided root element when no global document exists', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const rootElement = dom.window.document.body;
      const status = createPageStartupLoadingStatus({
        rootElement,
        resolveElement: () => dom.window.document.getElementById('startup-status'),
      });

      status.show('Loading from root...');
      expect(dom.window.document.getElementById('startup-status')?.textContent).toContain('Loading from root...');

      status.clear();
      expect(dom.window.document.getElementById('startup-status')).toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });
});
