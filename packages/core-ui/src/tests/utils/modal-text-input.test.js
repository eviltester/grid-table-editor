import { JSDOM } from 'jsdom';
import { showTextInputModal } from '../../../js/gui_components/modal-text-input.js';

describe('showTextInputModal', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('returns input text when clicking OK', async () => {
    const promise = showTextInputModal({
      documentObj: document,
      title: 'Column Name',
      initialValue: 'Old',
    });

    const input = document.getElementById('text-input-modal-field');
    input.value = 'New Name';
    document.getElementById('text-input-modal-ok').click();

    await expect(promise).resolves.toBe('New Name');
  });

  test('returns null when cancel is clicked', async () => {
    const promise = showTextInputModal({
      documentObj: document,
      title: 'Column Name',
      initialValue: 'Old',
    });
    document.getElementById('text-input-modal-cancel').click();
    await expect(promise).resolves.toBeNull();
  });

  test('returns null when clicking outside the modal', async () => {
    const promise = showTextInputModal({
      documentObj: document,
      title: 'Column Name',
      initialValue: 'Old',
    });
    document.getElementById('text-input-modal-backdrop').click();
    await expect(promise).resolves.toBeNull();
  });
});
