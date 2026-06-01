import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';
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
    expect(legacyControls.bindExistingGui).toHaveBeenCalledTimes(1);

    documentObj.querySelector('.type-select-action[data-type="json"]')?.click();

    expect(legacyControls.renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(legacyControls.setFileFormatType).toHaveBeenCalledTimes(1);
    expect(legacyControls.setOptionsViewForFormatType).toHaveBeenCalledTimes(1);
    expect(component.getState().selectedFormat).toBe('json');
  });
});
