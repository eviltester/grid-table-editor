import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import { createImportExportWorkspaceComponent } from '../../../js/gui_components/app/import-export-workspace/index.js';

describe('ImportExportWorkspace', () => {
  let dom;
  let documentObj;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    documentObj = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('mounts workspace roots and delegates format changes to the injected legacy controls', () => {
    const legacyControls = {
      bindExistingGui: jest.fn(),
      renderTextFromGrid: jest.fn(),
      setFileFormatType: jest.fn(),
      setOptionsViewForFormatType: jest.fn(),
      toggleTextEditMode: jest.fn(async () => 'edit'),
      _syncGridFromTextButtonState: jest.fn(),
      setPreviewRowLimit: jest.fn(),
      setExporter: jest.fn(),
      setImporter: jest.fn(),
      setGridChangeSource: jest.fn(),
    };

    const component = createImportExportWorkspaceComponent({
      root: documentObj.getElementById('root'),
      documentObj,
      services: {
        importExportControls: legacyControls,
      },
    });

    expect(documentObj.querySelector('#tabbedTextArea')).not.toBeNull();
    expect(documentObj.querySelector('#settextfromgridbutton')).not.toBeNull();
    expect(documentObj.querySelector('#previewRowsCount')).not.toBeNull();
    expect(documentObj.querySelector('#previewRowsCount').getAttribute('aria-label')).toBe('Preview row count');
    expect(legacyControls.bindExistingGui).toHaveBeenCalledTimes(1);
    expect(legacyControls.setPreviewRowLimit).toHaveBeenCalledWith(10);

    documentObj.querySelector('.type-select-action[data-type="json"]')?.click();

    expect(legacyControls.renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(legacyControls.setFileFormatType).toHaveBeenCalledTimes(1);
    expect(legacyControls.setOptionsViewForFormatType).toHaveBeenCalledTimes(1);
    expect(component.getState().selectedFormat).toBe('json');

    const previewRowCount = documentObj.querySelector('#previewRowsCount');
    previewRowCount.value = '7';
    fireEvent.input(previewRowCount, { target: { value: '7' } });

    expect(component.getState().previewRowLimit).toBe(7);
    expect(legacyControls.setPreviewRowLimit).toHaveBeenLastCalledWith(7);
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const isolatedDom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const component = createImportExportWorkspaceComponent({
        root: isolatedDom.window.document.getElementById('root'),
        services: {
          importExportControls: {
            bindExistingGui: jest.fn(),
            renderTextFromGrid: jest.fn(),
            setFileFormatType: jest.fn(),
            setOptionsViewForFormatType: jest.fn(),
            toggleTextEditMode: jest.fn(async () => 'edit'),
            _syncGridFromTextButtonState: jest.fn(),
            setPreviewRowLimit: jest.fn(),
            destroy: jest.fn(),
          },
        },
      });

      expect(isolatedDom.window.document.querySelector('#tabbedTextArea')).not.toBeNull();
      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      isolatedDom.window.close();
    }
  });
});
