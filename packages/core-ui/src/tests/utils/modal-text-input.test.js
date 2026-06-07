import { JSDOM } from 'jsdom';
import { createTextInputDialogComponent } from '../../../js/gui_components/shared/modal-text-input.js';

describe('createTextInputDialogComponent', () => {
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
    const component = createTextInputDialogComponent({
      documentObj: document,
    });
    const promise = component.requestTextInput({
      title: 'Column Name',
      initialValue: 'Old',
    });

    const input = document.querySelector('[data-role="text-input-dialog-field"]');
    input.value = 'New Name';
    document.querySelector('[data-role="text-input-dialog-ok"]').click();

    await expect(promise).resolves.toBe('New Name');
  });

  test('returns null when cancel is clicked', async () => {
    const component = createTextInputDialogComponent({
      documentObj: document,
    });
    const promise = component.requestTextInput({
      title: 'Column Name',
      initialValue: 'Old',
    });
    document.querySelector('[data-role="text-input-dialog-cancel"]').click();
    await expect(promise).resolves.toBeNull();
  });

  test('returns null when clicking outside the modal', async () => {
    const component = createTextInputDialogComponent({
      documentObj: document,
    });
    const promise = component.requestTextInput({
      title: 'Column Name',
      initialValue: 'Old',
    });
    document.getElementById('text-input-modal-backdrop').click();
    await expect(promise).resolves.toBeNull();
  });

  test('uses the injected window object for requestAnimationFrame-based focus scheduling', async () => {
    const scheduledCallbacks = [];
    const windowObj = {
      requestAnimationFrame(callback) {
        scheduledCallbacks.push(callback);
        return 1;
      },
      setTimeout(callback) {
        scheduledCallbacks.push(callback);
        return 2;
      },
    };
    const component = createTextInputDialogComponent({
      documentObj: document,
      windowObj,
    });

    const promise = component.requestTextInput({
      title: 'Column Name',
      initialValue: 'Old',
    });

    expect(scheduledCallbacks).toHaveLength(1);
    scheduledCallbacks[0]();
    expect(document.activeElement).toBe(document.querySelector('[data-role="text-input-dialog-field"]'));

    document.querySelector('[data-role="text-input-dialog-cancel"]').click();
    await expect(promise).resolves.toBeNull();
  });

  test('uses the rooted dialog hook instead of the styling class for modal wiring', async () => {
    const component = createTextInputDialogComponent({
      documentObj: document,
    });
    const dialogRoot = document.querySelector('[data-role="text-input-dialog"]');
    dialogRoot.className = 'renamed-dialog-shell';

    const promise = component.requestTextInput({
      title: 'Column Name',
      initialValue: 'Old',
    });

    expect(dialogRoot.getAttribute('aria-describedby')).toBe('text-input-modal-field');
    document.querySelector('[data-role="text-input-dialog-cancel"]').click();
    await expect(promise).resolves.toBeNull();
  });
});
