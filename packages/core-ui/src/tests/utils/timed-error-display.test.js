import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { TimedErrorDisplay } from '../../../js/gui_components/shared/timed-error-display.js';

describe('TimedErrorDisplay', () => {
  let dom;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = new JSDOM(`<!doctype html><html><body><div id="error"></div></body></html>`);
  });

  afterEach(() => {
    jest.useRealTimers();
    dom.window.close();
  });

  test('destroy clears active timeout and removes visible error state', () => {
    const display = new TimedErrorDisplay({
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
});
