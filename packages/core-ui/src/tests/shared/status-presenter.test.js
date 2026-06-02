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
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');

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
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');

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
    const presenter = createLoadingStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');

    presenter.setStatus('Preparing export...');
    expect(element.textContent).toBe('Preparing export...');
    expect(element.classList.contains('is-loading')).toBe(true);
    expect(element.style.display).toBe('inline-block');
    expect(element.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  });

  test('statusClassName controls the loading-state class for loading presenter consumers', () => {
    const presenter = createLoadingStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      statusClassName: 'status-loading',
    });
    const element = dom.window.document.getElementById('status');

    presenter.setStatus('Loading data...');
    expect(element.classList.contains('status-loading')).toBe(true);
    expect(element.classList.contains('is-loading')).toBe(false);
  });

  test('rebinds to a replacement element with the same id', () => {
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
    });
    const original = dom.window.document.getElementById('status');
    const replacement = dom.window.document.createElement('div');
    replacement.id = 'status';

    presenter.setStatus('First message');
    expect(original.textContent).toBe('First message');

    original.replaceWith(replacement);
    presenter.setStatus('Second message');
    expect(replacement.textContent).toBe('Second message');
  });

  test('can be created without a global document when no documentObj is injected', () => {
    const originalDocument = global.document;

    delete global.document;

    try {
      const presenter = createStatusPresenter({ elementId: 'status' });
      const loadingPresenter = createLoadingStatusPresenter({ elementId: 'status' });

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
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');

    presenter.setStatus('Will clear soon.');
    presenter.scheduleClear(1200);
    presenter.destroy();
    jest.advanceTimersByTime(1200);

    expect(element.textContent).toBe('');
    expect(element.style.display).toBe('none');
  });
});
