import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { Download } from '../../../js/gui_components/shared/download.js';

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
    const URLObj = {
      createObjectURL: jest.fn(() => fakeBlobUrl),
      revokeObjectURL: jest.fn(),
    };
    const BlobCtor = jest.fn((content, options) => ({ content, options }));

    const download = new Download('report.txt', {
      documentObj: document,
      URLObj,
      BlobCtor,
    });
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    download.downloadFile('hello world');

    expect(BlobCtor).toHaveBeenCalledWith(['hello world'], {
      type: 'text/plain;charset=utf-8',
      endings: 'transparent',
    });
    expect(URLObj.createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0][0];
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('download')).toBe('report.txt');
    expect(anchor.getAttribute('href')).toBe(fakeBlobUrl);
    expect(anchor.style.display).toBe('none');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(anchor);
    expect(document.body.querySelector('a')).toBeNull();
    expect(URLObj.revokeObjectURL).toHaveBeenCalledWith(fakeBlobUrl);
  });

  test('downloadFile is a safe no-op without a document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const download = new Download('report.txt');
      expect(download.downloadFile('hello world')).toBe(false);
    } finally {
      global.document = originalDocument;
    }
  });

  test('prefers injected owner-window URL and Blob over ambient globals', () => {
    const isolatedDom = new JSDOM(`<!doctype html><html><body></body></html>`);
    const fakeBlobUrl = 'blob:http://isolated/fake-uuid';
    const ownerWindowObj = {
      URL: {
        createObjectURL: jest.fn(() => fakeBlobUrl),
        revokeObjectURL: jest.fn(),
      },
      Blob: jest.fn((content, options) => ({ content, options })),
      HTMLAnchorElement: isolatedDom.window.HTMLAnchorElement,
    };

    const ambientCreateObjectURL = global.URL.createObjectURL;
    const ambientRevokeObjectURL = global.URL.revokeObjectURL;
    const ambientBlob = global.Blob;
    global.URL.createObjectURL = jest.fn(() => 'blob:http://ambient/should-not-be-used');
    global.URL.revokeObjectURL = jest.fn();
    global.Blob = jest.fn();

    try {
      const clickSpy = jest.spyOn(isolatedDom.window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const download = new Download('report.txt', {
        documentObj: isolatedDom.window.document,
        windowObj: ownerWindowObj,
      });

      download.downloadFile('owner-window-text');

      expect(ownerWindowObj.Blob).toHaveBeenCalledWith(['owner-window-text'], {
        type: 'text/plain;charset=utf-8',
        endings: 'transparent',
      });
      expect(ownerWindowObj.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(global.URL.createObjectURL).not.toHaveBeenCalled();
      expect(ownerWindowObj.URL.revokeObjectURL).toHaveBeenCalledWith(fakeBlobUrl);
      expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    } finally {
      global.URL.createObjectURL = ambientCreateObjectURL;
      global.URL.revokeObjectURL = ambientRevokeObjectURL;
      global.Blob = ambientBlob;
      isolatedDom.window.close();
    }
  });
});
