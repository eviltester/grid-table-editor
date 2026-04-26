import { JSDOM } from 'jsdom';
import { DragDropControl } from '../../js/gui_components/drag-drop-control.js';

describe('DragDropControl', () => {
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
    const control = new DragDropControl(jest.fn());

    expect(() => control.configureAsDropZone(undefined)).not.toThrow();
    expect(() => control.configureAsDropZone(null)).not.toThrow();
  });

  test('drop with DataTransferItemList reads first file item', () => {
    const readFileFunction = jest.fn();
    const control = new DragDropControl(readFileFunction);
    const zone = document.getElementById('zone');
    control.configureAsDropZone(zone);

    const file = { name: 'demo.csv' };
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = {
      items: [
        { kind: 'string', getAsFile: () => null },
        { kind: 'file', getAsFile: () => file },
      ],
    };

    zone.dispatchEvent(event);

    expect(readFileFunction).toHaveBeenCalledWith(file);
    expect(zone.classList.contains('is-dragover')).toBe(false);
  });

  test('drop without items uses files[0] fallback', () => {
    const readFileFunction = jest.fn();
    const control = new DragDropControl(readFileFunction);
    const zone = document.getElementById('zone');
    control.configureAsDropZone(zone);

    const fallbackFile = { name: 'fallback.csv' };
    const event = new window.Event('drop', { bubbles: true, cancelable: true });
    event.dataTransfer = { files: [fallbackFile] };

    zone.dispatchEvent(event);

    expect(readFileFunction).toHaveBeenCalledWith(fallbackFile);
  });

  test('dragenter/leave toggles dragover CSS class', () => {
    const control = new DragDropControl(jest.fn());
    const zone = document.getElementById('zone');
    control.configureAsDropZone(zone);

    zone.dispatchEvent(new window.Event('dragenter', { bubbles: true, cancelable: true }));
    expect(zone.classList.contains('is-dragover')).toBe(true);

    zone.dispatchEvent(new window.Event('dragleave', { bubbles: true, cancelable: true }));
    expect(zone.classList.contains('is-dragover')).toBe(false);
  });
});
