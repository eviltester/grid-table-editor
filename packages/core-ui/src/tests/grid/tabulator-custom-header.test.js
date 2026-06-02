import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  headerPopupFormatter,
  emptyHeaderFilter,
} from '../../../js/gui_components/data-grid-editor/tabulator/customHeader-tabulator.js';

describe('Tabulator custom header helpers', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('build header popup content from an injected document without relying on global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const onAddLeftButtonClick = jest.fn();
      const context = {
        documentObj: dom.window.document,
        onAddLeftButtonClick,
        onRenameButtonClick: jest.fn(),
        onDeleteButtonClick: jest.fn(),
        onDuplicateButtonClick: jest.fn(),
        onAddRightButtonClick: jest.fn(),
      };
      const column = {
        getHeaderFilterValue: jest.fn(() => 'status'),
      };

      const popup = headerPopupFormatter.call(context, null, column, null);
      expect(popup).not.toBeNull();
      expect(popup.querySelector('input').value).toBe('status');

      popup.querySelector('.customHeaderAddLeftButton').click();
      expect(onAddLeftButtonClick).toHaveBeenCalledTimes(1);
    } finally {
      global.document = originalDocument;
    }
  });

  test('creates the empty header filter element from an injected document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const placeholder = emptyHeaderFilter.call({ documentObj: dom.window.document });
      expect(placeholder?.tagName).toBe('DIV');
    } finally {
      global.document = originalDocument;
    }
  });
});
