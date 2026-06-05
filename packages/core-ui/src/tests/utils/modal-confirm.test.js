import { JSDOM } from 'jsdom';
import { createConfirmDialogComponent, showConfirmModal } from '../../../js/gui_components/shared/modal-confirm.js';

describe('showConfirmModal', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.KeyboardEvent = dom.window.KeyboardEvent;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('returns true when clicking OK', async () => {
    const promise = showConfirmModal({
      documentObj: document,
      title: 'Delete Column',
      message: 'Are you sure?',
    });
    document.querySelector('[data-role="confirm-dialog-ok"]').click();
    await expect(promise).resolves.toBe(true);
  });

  test('returns false when clicking Cancel', async () => {
    const promise = showConfirmModal({
      documentObj: document,
      title: 'Delete Column',
      message: 'Are you sure?',
    });
    document.querySelector('[data-role="confirm-dialog-cancel"]').click();
    await expect(promise).resolves.toBe(false);
  });

  test('returns false when clicking backdrop', async () => {
    const promise = showConfirmModal({
      documentObj: document,
      title: 'Delete Column',
      message: 'Are you sure?',
    });
    document.getElementById('confirm-modal-backdrop').click();
    await expect(promise).resolves.toBe(false);
  });

  test('returns false on Escape key', async () => {
    const promise = showConfirmModal({
      documentObj: document,
      title: 'Delete Column',
      message: 'Are you sure?',
    });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await expect(promise).resolves.toBe(false);
  });

  test('uses the injected window object for focus scheduling', async () => {
    const scheduledCallbacks = [];
    const windowObj = {
      setTimeout(callback) {
        scheduledCallbacks.push(callback);
        return 1;
      },
    };
    const component = createConfirmDialogComponent({
      documentObj: document,
      windowObj,
    });

    const promise = component.requestConfirm({
      title: 'Delete Column',
      message: 'Are you sure?',
    });

    expect(scheduledCallbacks).toHaveLength(1);
    scheduledCallbacks[0]();
    expect(document.activeElement).toBe(document.querySelector('[data-role="confirm-dialog-ok"]'));

    document.querySelector('[data-role="confirm-dialog-cancel"]').click();
    await expect(promise).resolves.toBe(false);
  });
});
