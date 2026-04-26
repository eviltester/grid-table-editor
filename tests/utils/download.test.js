import { JSDOM } from 'jsdom';
import { Download } from '../../js/gui_components/download.js';

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
    const download = new Download('report.txt');
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    const clickSpy = jest
      .spyOn(window.HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    download.downloadFile('hello world');

    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0][0];
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('download')).toBe('report.txt');
    expect(anchor.getAttribute('href')).toBe('data:text/plain;charset=utf-8,hello%20world');
    expect(anchor.style.display).toBe('none');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(anchor);
    expect(document.body.querySelector('a')).toBeNull();
  });
});