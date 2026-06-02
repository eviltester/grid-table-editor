import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { CustomHeaderAgGrid } from '../../../js/gui_components/data-grid-editor/ag-grid/customHeader-ag-grid.js';
import { SelectFilterEditor } from '../../../js/gui_components/data-grid-editor/ag-grid/select-filter-editor.js';

describe('AG Grid header compatibility components', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('CustomHeaderAgGrid can initialize from the host ownerDocument without a global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const header = new CustomHeaderAgGrid();
      const host = dom.window.document.getElementById('host');
      const column = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        isSortAscending: jest.fn(() => false),
        isSortDescending: jest.fn(() => false),
        isFilterActive: jest.fn(() => false),
        colId: 'column1',
      };

      header.init({
        displayName: 'Column 1',
        enableMenu: false,
        enableSorting: false,
        eGridHeader: host,
        api: {},
        column,
      });

      expect(header.getGui()).toBeTruthy();
      expect(header.getGui().ownerDocument).toBe(dom.window.document);
      const addLeftButton = header.getGui().querySelector('.customHeaderAddLeftButton');
      expect(addLeftButton.tagName).toBe('BUTTON');
      expect(addLeftButton.getAttribute('title')).toBe('Add column left');
      expect(addLeftButton.getAttribute('aria-label')).toBe('Add column left');
      expect(addLeftButton.querySelector('svg.header-action-icon')).not.toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });

  test('SelectFilterEditor can initialize from an injected document without a global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const editor = new SelectFilterEditor();
      editor.init({
        value: 'helpers.arrayElement',
        values: ['helpers.arrayElement'],
        stopEditing: jest.fn(),
        documentObj: dom.window.document,
      });

      expect(editor.getGui()).toBeTruthy();
      expect(editor.getGui().ownerDocument).toBe(dom.window.document);
      expect(editor.getValue()).toBe('helpers.arrayElement');
    } finally {
      global.document = originalDocument;
    }
  });
});
