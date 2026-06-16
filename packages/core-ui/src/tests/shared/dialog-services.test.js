import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createConfirmDialogService } from '../../../js/gui_components/shared/dialog-services/confirm-dialog-service.js';
import { createTextInputDialogService } from '../../../js/gui_components/shared/dialog-services/text-input-dialog-service.js';
import { createStoredSchemasDialogService } from '../../../js/gui_components/shared/dialog-services/stored-schemas-dialog-service.js';

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

  test('confirm dialog service resolves false on cancel, backdrop dismiss, and Escape', async () => {
    const service = createConfirmDialogService({ documentObj: dom.window.document });

    const cancelPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });
    dom.window.document.getElementById('confirm-modal-cancel').click();
    await expect(cancelPromise).resolves.toBe(false);

    const backdropPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });
    dom.window.document.getElementById('confirm-modal-backdrop').click();
    await expect(backdropPromise).resolves.toBe(false);

    const escapePromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await expect(escapePromise).resolves.toBe(false);
  });

  test('confirm dialog service resolves true on Enter', async () => {
    const service = createConfirmDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });

    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await expect(resultPromise).resolves.toBe(true);
  });

  test('confirm dialog service closes the previous request when a new request is shown', async () => {
    const service = createConfirmDialogService({ documentObj: dom.window.document });

    const firstPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'First request',
    });

    const secondPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Second request',
    });

    await expect(firstPromise).resolves.toBe(false);
    expect(dom.window.document.getElementById('confirm-modal-message').textContent).toBe('Second request');

    dom.window.document.getElementById('confirm-modal-ok').click();
    await expect(secondPromise).resolves.toBe(true);
    expect(dom.window.document.getElementById('confirm-modal-backdrop').style.display).toBe('none');
  });

  test('confirm dialog service destroy closes the active request and removes the owned backdrop', async () => {
    const service = createConfirmDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you sure?',
    });

    service.destroy();

    await expect(resultPromise).resolves.toBe(false);
    expect(dom.window.document.getElementById('confirm-modal-backdrop')).toBeNull();
  });

  test('text input dialog service binds the provided document and resolves the typed value', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestTextInput({
      title: 'Filter Column',
      message: 'Only numeric values are allowed',
      label: 'Maximum size',
      initialValue: '3',
      inputType: 'number',
      min: 1,
      step: 1,
    });

    const input = dom.window.document.getElementById('text-input-modal-field');
    expect(dom.window.document.querySelector('[data-role="text-input-dialog-message"]').textContent).toBe(
      'Only numeric values are allowed'
    );
    expect(dom.window.document.querySelector('[data-role="text-input-dialog-label"]').textContent).toBe('Maximum size');
    expect(input.getAttribute('type')).toBe('number');
    expect(input.getAttribute('min')).toBe('1');
    expect(input.getAttribute('step')).toBe('1');
    input.value = '42';
    dom.window.document.getElementById('text-input-modal-ok').click();

    await expect(resultPromise).resolves.toBe('42');
  });

  test('text input dialog service resolves null on cancel, backdrop dismiss, and Escape', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const cancelPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });
    dom.window.document.getElementById('text-input-modal-cancel').click();
    await expect(cancelPromise).resolves.toBeNull();

    const backdropPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });
    dom.window.document.getElementById('text-input-modal-backdrop').click();
    await expect(backdropPromise).resolves.toBeNull();

    const escapePromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });
    const escapeInput = dom.window.document.getElementById('text-input-modal-field');
    escapeInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await expect(escapePromise).resolves.toBeNull();
  });

  test('text input dialog service resolves Enter submissions including empty and whitespace-only values', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const emptyPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });
    const emptyInput = dom.window.document.getElementById('text-input-modal-field');
    emptyInput.value = '';
    emptyInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await expect(emptyPromise).resolves.toBe('');

    const whitespacePromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });
    const whitespaceInput = dom.window.document.getElementById('text-input-modal-field');
    whitespaceInput.value = '   ';
    whitespaceInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await expect(whitespacePromise).resolves.toBe('   ');
  });

  test('text input dialog service closes the previous request when a new request is shown', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const firstPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });

    const secondPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Fresh',
    });

    await expect(firstPromise).resolves.toBeNull();

    const input = dom.window.document.getElementById('text-input-modal-field');
    expect(input.value).toBe('Fresh');
    input.value = 'Updated';
    dom.window.document.getElementById('text-input-modal-ok').click();

    await expect(secondPromise).resolves.toBe('Updated');
    expect(dom.window.document.getElementById('text-input-modal-backdrop').style.display).toBe('none');
  });

  test('text input dialog service destroy closes the active request and removes the owned backdrop', async () => {
    const service = createTextInputDialogService({ documentObj: dom.window.document });

    const resultPromise = service.requestTextInput({
      title: 'Filter Column',
      initialValue: 'Old',
    });

    service.destroy();

    await expect(resultPromise).resolves.toBeNull();
    expect(dom.window.document.getElementById('text-input-modal-backdrop')).toBeNull();
  });

  test('stored schemas dialog hides while delete confirmation is shown and restores afterwards', async () => {
    const service = createStoredSchemasDialogService({ documentObj: dom.window.document, windowObj: dom.window });
    const storage = {
      loadSavedSchemas: () => ({
        saved: [{ id: 'saved-1', name: 'Saved schema', schemaText: 'Name\nliteral(Ada)' }],
      }),
      deleteSavedSchema: jest.fn(() => ({ ok: true })),
    };

    await service.openStoredSchemasDialog({ storage });

    const storedDialogBackdrop = dom.window.document.getElementById('stored-schemas-dialog-backdrop');
    expect(storedDialogBackdrop.style.display).toBe('flex');

    dom.window.document.querySelector('[data-action="delete"]').click();
    expect(storedDialogBackdrop.style.display).toBe('none');
    expect(dom.window.document.getElementById('confirm-modal-backdrop').style.display).toBe('flex');

    dom.window.document.getElementById('confirm-modal-cancel').click();
    await Promise.resolve();
    expect(storedDialogBackdrop.style.display).toBe('flex');
    expect(storage.deleteSavedSchema).not.toHaveBeenCalled();

    dom.window.document.querySelector('[data-action="delete"]').click();
    expect(storedDialogBackdrop.style.display).toBe('none');

    dom.window.document.getElementById('confirm-modal-ok').click();
    await Promise.resolve();
    expect(storedDialogBackdrop.style.display).toBe('flex');
    expect(storage.deleteSavedSchema).toHaveBeenCalledWith('saved-1');

    service.destroy();
  });

  test('stored schemas dialog escapes saved schema names when rendering rows', async () => {
    const service = createStoredSchemasDialogService({ documentObj: dom.window.document, windowObj: dom.window });
    const maliciousName = '<img src=x onerror="window.__xss=true">Stored';
    const storage = {
      loadSavedSchemas: () => ({
        saved: [{ id: 'saved-1', name: maliciousName, schemaText: 'Name\nliteral(Ada)' }],
      }),
    };

    await service.openStoredSchemasDialog({ storage });

    const row = dom.window.document.querySelector('[data-role="stored-schemas-dialog-row"]');
    expect(row.textContent).toContain(maliciousName);
    expect(row.querySelector('img')).toBeNull();
    expect(dom.window.__xss).toBeUndefined();

    service.destroy();
  });
});
