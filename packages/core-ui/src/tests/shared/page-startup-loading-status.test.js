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
      elementId: 'startup-status',
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
      elementId: 'startup-status',
    });

    status.show();
    status.clear();

    expect(dom.window.document.getElementById('startup-status')).toBeNull();
  });

  test('show, fail, and clear do not throw when documentObj is null', () => {
    const status = createPageStartupLoadingStatus({
      documentObj: null,
      elementId: 'startup-status',
    });

    expect(() => status.show()).not.toThrow();
    expect(() => status.fail()).not.toThrow();
    expect(() => status.clear()).not.toThrow();
  });
});
