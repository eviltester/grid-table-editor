import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { Download } from '../../../js/gui_components/download.js';

describe('Download', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('downloadFile creates a hidden anchor, clicks it, and removes it', () => {
    const fakeBlobUrl = 'blob:http://localhost/fake-uuid';
    global.URL.createObjectURL = jest.fn(() => fakeBlobUrl);
    global.URL.revokeObjectURL = jest.fn();
    global.Blob = jest.fn((content, options) => ({ content, options }));

    const download = new Download('report.txt');
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    download.downloadFile('hello world');

    expect(global.Blob).toHaveBeenCalledWith(['hello world'], { type: 'text/plain;charset=utf-8' });
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0][0];
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('download')).toBe('report.txt');
    expect(anchor.getAttribute('href')).toBe(fakeBlobUrl);
    expect(anchor.style.display).toBe('none');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(anchor);
    expect(document.body.querySelector('a')).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeBlobUrl);
  });
});
