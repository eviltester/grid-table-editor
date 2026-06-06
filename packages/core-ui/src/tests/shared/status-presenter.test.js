import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  createLoadingStatusPresenter,
  createStatusPresenter,
} from '../../../js/gui_components/shared/test-data/ui/status-presenter.js';

describe('createStatusPresenter', () => {
  let dom;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = new JSDOM('<!doctype html><html><body><div id="status"></div></body></html>');
  });

  afterEach(() => {
    jest.useRealTimers();
    dom.window.close();
  });

  test('setStatus and scheduleClear update the rendered status element without loading state', () => {
    const element = dom.window.document.getElementById('status');
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => element,
      hideWhenEmpty: true,
    });

    presenter.setStatus('Export ready.');
    expect(element.textContent).toBe('Export ready.');
    expect(element.classList.contains('is-loading')).toBe(false);
    expect(element.style.display).toBe('inline-block');
    expect(element.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('none');

    presenter.scheduleClear(1800);
    jest.advanceTimersByTime(1800);
    expect(element.textContent).toBe('');
    expect(element.style.display).toBe('none');
  });

  test('status presenter supports severity and dismissable status messages', () => {
    const element = dom.window.document.getElementById('status');
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => element,
      hideWhenEmpty: true,
    });

    presenter.setStatus('Schema validation failed.', {
      severity: 'error',
      dismissable: true,
    });

    const dismissButton = element.querySelector('[data-role="dismiss-button"]');
    expect(element.getAttribute('data-severity')).toBe('error');
    expect(dismissButton?.style.display).toBe('inline-block');

    dismissButton?.click();
    expect(element.textContent).toBe('');
    expect(element.style.display).toBe('none');
  });

  test('loading presenter always renders loading state for loading messages', () => {
    const element = dom.window.document.getElementById('status');
    const presenter = createLoadingStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => element,
      hideWhenEmpty: true,
    });

    presenter.setStatus('Preparing export...');
    expect(element.textContent).toBe('Preparing export...');
    expect(element.classList.contains('is-loading')).toBe(true);
    expect(element.style.display).toBe('inline-block');
    expect(element.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  });

  test('statusClassName controls the loading-state class for loading presenter consumers', () => {
    const element = dom.window.document.getElementById('status');
    const presenter = createLoadingStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => element,
      statusClassName: 'status-loading',
    });

    presenter.setStatus('Loading data...');
    expect(element.classList.contains('status-loading')).toBe(true);
    expect(element.classList.contains('is-loading')).toBe(false);
  });

  test('rebinds to a replacement element with the same id', () => {
    let currentElement = dom.window.document.getElementById('status');
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => currentElement,
    });
    const original = currentElement;
    const replacement = dom.window.document.createElement('div');
    replacement.id = 'status';

    presenter.setStatus('First message');
    expect(original.textContent).toBe('First message');

    original.replaceWith(replacement);
    currentElement = replacement;
    presenter.setStatus('Second message');
    expect(replacement.textContent).toBe('Second message');
  });

  test('can be created without a global document when no documentObj or resolved element is available', () => {
    const originalDocument = global.document;

    delete global.document;

    try {
      const presenter = createStatusPresenter();
      const loadingPresenter = createLoadingStatusPresenter();

      expect(() => presenter.setStatus('Export ready.')).not.toThrow();
      expect(() => presenter.clear()).not.toThrow();
      expect(() => presenter.scheduleClear(10)).not.toThrow();
      expect(() => presenter.destroy()).not.toThrow();
      expect(() => loadingPresenter.setStatus('Loading data...')).not.toThrow();
      expect(() => loadingPresenter.clear()).not.toThrow();
      expect(() => loadingPresenter.destroy()).not.toThrow();
    } finally {
      global.document = originalDocument;
    }
  });

  test('destroy cancels pending clear work and leaves the element unchanged afterwards', () => {
    const element = dom.window.document.getElementById('status');
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => element,
      hideWhenEmpty: true,
    });

    presenter.setStatus('Will clear soon.');
    presenter.scheduleClear(1200);
    presenter.destroy();
    jest.advanceTimersByTime(1200);

    expect(element.textContent).toBe('');
    expect(element.style.display).toBe('none');
  });

  test('status presenter can resolve the target element through an injected callback', () => {
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => dom.window.document.querySelector('[data-role="status-root"]'),
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');
    element.setAttribute('data-role', 'status-root');

    presenter.setStatus('Scoped status');
    expect(element.textContent).toBe('Scoped status');
    expect(element.classList.contains('is-loading')).toBe(false);
  });

  test('loading presenter can resolve the target element through an injected callback', () => {
    const presenter = createLoadingStatusPresenter({
      documentObj: dom.window.document,
      resolveElement: () => dom.window.document.querySelector('[data-role="loading-status-root"]'),
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');
    element.setAttribute('data-role', 'loading-status-root');

    presenter.setStatus('Scoped loading');
    expect(element.textContent).toBe('Scoped loading');
    expect(element.classList.contains('is-loading')).toBe(true);
    expect(element.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  });
});
