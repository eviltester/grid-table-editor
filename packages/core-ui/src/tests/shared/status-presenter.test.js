import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createStatusPresenter } from '../../../js/gui_components/shared/test-data/ui/status-presenter.js';

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

  test('setStatus and scheduleClear update the rendered status element', () => {
    const presenter = createStatusPresenter({
      documentObj: dom.window.document,
      elementId: 'status',
      hideWhenEmpty: true,
    });
    const element = dom.window.document.getElementById('status');

    presenter.setStatus('Preparing export...', true);
    expect(element.textContent).toBe('Preparing export...');
    expect(element.classList.contains('is-loading')).toBe(true);
    expect(element.style.display).toBe('inline-block');
    expect(element.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');

    presenter.scheduleClear(1800);
    jest.advanceTimersByTime(1800);
    expect(element.textContent).toBe('');
    expect(element.style.display).toBe('none');
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
});
