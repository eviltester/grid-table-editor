import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createDragDropAdapter } from '../../../js/gui_components/app/drag-drop-control.js';

describe('createDragDropAdapter', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><label id="zone"></label></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('configureAsDropZone safely handles undefined and null', () => {
    const adapter = createDragDropAdapter({ onFileDrop: jest.fn() });

    expect(() => adapter.configureAsDropZone(undefined)).not.toThrow();
    expect(() => adapter.configureAsDropZone(null)).not.toThrow();
  });

  test('drop with DataTransferItemList reads first file item', () => {
    const onFileDrop = jest.fn();
    const adapter = createDragDropAdapter({ onFileDrop });
    const zone = document.getElementById('zone');
    adapter.configureAsDropZone(zone);

    const file = { name: 'demo.csv' };
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = {
      items: [
        { kind: 'string', getAsFile: () => null },
        { kind: 'file', getAsFile: () => file },
      ],
    };

    zone.dispatchEvent(event);

    expect(onFileDrop).toHaveBeenCalledWith(file);
    expect(zone.classList.contains('is-dragover')).toBe(false);
  });

  test('drop without items uses files[0] fallback', () => {
    const onFileDrop = jest.fn();
    const adapter = createDragDropAdapter({ onFileDrop });
    const zone = document.getElementById('zone');
    adapter.configureAsDropZone(zone);

    const fallbackFile = { name: 'fallback.csv' };
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = { files: [fallbackFile] };

    zone.dispatchEvent(event);

    expect(onFileDrop).toHaveBeenCalledWith(fallbackFile);
  });

  test('dragenter/leave toggles dragover CSS class', () => {
    const adapter = createDragDropAdapter({ onFileDrop: jest.fn() });
    const zone = document.getElementById('zone');
    adapter.configureAsDropZone(zone);

    zone.dispatchEvent(new window.Event('dragenter', { bubbles: true, cancelable: true }));
    expect(zone.classList.contains('is-dragover')).toBe(true);

    zone.dispatchEvent(new window.Event('dragleave', { bubbles: true, cancelable: true }));
    expect(zone.classList.contains('is-dragover')).toBe(false);
  });

  test('re-binding destroys listeners and dragover state on the previous zone', () => {
    const adapter = createDragDropAdapter({ onFileDrop: jest.fn() });
    const firstZone = document.getElementById('zone');
    const secondZone = document.createElement('label');
    document.body.appendChild(secondZone);

    adapter.configureAsDropZone(firstZone);
    firstZone.dispatchEvent(new window.Event('dragenter', { bubbles: true, cancelable: true }));
    expect(firstZone.classList.contains('is-dragover')).toBe(true);

    adapter.configureAsDropZone(secondZone);
    expect(firstZone.classList.contains('dragdropzone')).toBe(false);
    expect(firstZone.classList.contains('is-dragover')).toBe(false);
    expect(secondZone.classList.contains('dragdropzone')).toBe(true);
  });

  test('destroy removes listeners and drag/drop classes from the active zone', () => {
    const onFileDrop = jest.fn();
    const adapter = createDragDropAdapter({ onFileDrop });
    const zone = document.getElementById('zone');
    adapter.configureAsDropZone(zone);
    adapter.destroy();

    expect(zone.classList.contains('dragdropzone')).toBe(false);
    expect(zone.classList.contains('is-dragover')).toBe(false);

    const file = { name: 'ignored.csv' };
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = { files: [file] };
    zone.dispatchEvent(event);

    expect(onFileDrop).not.toHaveBeenCalled();
  });
});
