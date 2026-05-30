import { JSDOM } from 'jsdom';
import {
  createConfirmDialogService,
  createTextInputDialogService,
} from '../../../js/gui_components/shared/dialog-services/index.js';

describe('dialog services', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.KeyboardEvent = dom.window.KeyboardEvent;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('confirm dialog service binds the provided document and resolves true on OK', async () => {
    const service = createConfirmDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });

    dom.window.document.getElementById('confirm-modal-ok').click();
    await expect(resultPromise).resolves.toBe(true);
  });

  test('text input dialog service binds the provided document and resolves the typed value', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });

    const input = dom.window.document.getElementById('text-input-modal-field');
    input.value = 'Updated';
    dom.window.document.getElementById('text-input-modal-ok').click();

    await expect(resultPromise).resolves.toBe('Updated');
  });
});
