import { JSDOM } from 'jsdom';
import { showConfirmModal } from '../../../js/gui_components/modal-confirm.js';

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
    document.getElementById('confirm-modal-ok').click();
    await expect(promise).resolves.toBe(true);
  });

  test('returns false when clicking Cancel', async () => {
    const promise = showConfirmModal({
      documentObj: document,
      title: 'Delete Column',
      message: 'Are you sure?',
    });
    document.getElementById('confirm-modal-cancel').click();
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
});
