import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  createTimedStatusPresenter,
  TimedStatusDisplay,
} from '../../../js/gui_components/shared/timed-error-display.js';

describe('TimedStatusDisplay', () => {
  let dom;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = new JSDOM(`<!doctype html><html><body><div id="error"></div></body></html>`);
  });

  afterEach(() => {
    jest.useRealTimers();
    dom.window.close();
  });

  test('show auto clears after timeout using the shared inline message behavior', () => {
    const display = new TimedStatusDisplay({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });
    const element = dom.window.document.getElementById('error');

    display.show('Something failed', { severity: 'error' });
    expect(element.textContent).toBe('Something failed');
    expect(element.getAttribute('data-severity')).toBe('error');

    jest.advanceTimersByTime(5000);
    expect(element.textContent).toBe('');
    expect(element.hasAttribute('data-severity')).toBe(false);
  });

  test('destroy clears active timeout and removes visible error state', () => {
    const display = new TimedStatusDisplay({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });
    const element = dom.window.document.getElementById('error');

    display.show('Something failed', { severity: 'error' });
    expect(element.textContent).toBe('Something failed');
    expect(element.getAttribute('data-severity')).toBe('error');

    display.destroy();
    expect(element.textContent).toBe('');
    expect(element.hasAttribute('data-severity')).toBe(false);

    jest.advanceTimersByTime(5000);
    expect(element.textContent).toBe('');
    expect(element.hasAttribute('data-severity')).toBe(false);
  });

  test('rebinds to a replacement element with the same id', () => {
    const display = new TimedStatusDisplay({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });
    const original = dom.window.document.getElementById('error');
    const replacement = dom.window.document.createElement('div');
    replacement.id = 'error';

    display.show('Original error', { severity: 'error', timeoutMs: 5000 });
    expect(original.textContent).toBe('Original error');

    original.replaceWith(replacement);
    display.show('Replacement error', { severity: 'warning', timeoutMs: 5000 });

    expect(replacement.textContent).toBe('Replacement error');
    expect(replacement.getAttribute('data-severity')).toBe('warning');
  });

  test('createTimedStatusPresenter returns the same timed behavior through the service-style API', () => {
    const presenter = createTimedStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });
    const element = dom.window.document.getElementById('error');

    presenter.show('Schema invalid', { severity: 'warning' });
    expect(element.textContent).toBe('Schema invalid');
    expect(element.getAttribute('data-severity')).toBe('warning');

    presenter.clear();
    expect(element.textContent).toBe('');
    expect(element.hasAttribute('data-severity')).toBe(false);
  });

  test('createTimedStatusPresenter supports normal severity without setting data-severity', () => {
    const presenter = createTimedStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });
    const element = dom.window.document.getElementById('error');

    presenter.show('Text preview refreshed.', { severity: 'normal' });
    expect(element.textContent).toBe('Text preview refreshed.');
    expect(element.hasAttribute('data-severity')).toBe(false);
  });

  test('TimedStatusDisplay wraps the service-style presenter API', () => {
    const display = new TimedStatusDisplay({
      documentObj: dom.window.document,
      elementId: 'error',
      timeoutMs: 5000,
    });

    expect(display).toBeInstanceOf(TimedStatusDisplay);
  });
});
