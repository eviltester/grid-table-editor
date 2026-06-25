import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import { createImportExportDownloadControlComponent } from '../../../js/gui_components/app/import-export-download-control/index.js';

describe('ImportExportDownloadControl', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    root = dom.window.document.getElementById('root');
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('renders the download button and status surface with the selected extension', () => {
    const onDownload = jest.fn();
    createImportExportDownloadControlComponent({
      root,
      props: {
        fileExtension: '.xml',
      },
      callbacks: {
        onDownload,
      },
    });

    const downloadButton = root.querySelector('[data-role="download-button"]');
    const lineEndingSelect = root.querySelector('[data-role="line-ending-select"]');
    const includeBomCheckbox = root.querySelector('[data-role="include-bom-checkbox"]');
    fireEvent.click(downloadButton);

    expect(downloadButton.id).toBe('filedownload');
    expect(downloadButton.getAttribute('aria-label')).toBe('Download file');
    expect(downloadButton.getAttribute('title')).toBe('Download file');
    expect(downloadButton.textContent).toContain('.xml');
    expect(lineEndingSelect.value).toBe('lf');
    expect(includeBomCheckbox.checked).toBe(false);
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  test('disables the download action while import or export work is active', () => {
    const component = createImportExportDownloadControlComponent({
      root,
      props: {
        supportsExport: true,
        importBusy: false,
        exportBusy: false,
      },
    });

    const downloadButton = root.querySelector('[data-role="download-button"]');
    expect(downloadButton.disabled).toBe(false);
    expect(downloadButton.getAttribute('aria-disabled')).toBe('false');

    component.update({
      exportBusy: true,
      exportStatusMessage: 'Generating export text...',
      exportStatusLoading: true,
    });

    const exportStatus = root.querySelector('[data-role="export-progress-status"]');
    expect(downloadButton.disabled).toBe(true);
    expect(downloadButton.getAttribute('aria-disabled')).toBe('true');
    expect(downloadButton.getAttribute('aria-busy')).toBe('true');
    expect(exportStatus.textContent).toBe('Generating export text...');
  });

  test('forwards export encoding settings changes through callbacks', () => {
    const onExportEncodingSettingsChange = jest.fn();
    createImportExportDownloadControlComponent({
      root,
      props: {
        exportEncodingSettings: {
          lineEnding: 'crlf',
          includeBom: true,
        },
      },
      callbacks: {
        onExportEncodingSettingsChange,
      },
    });

    const lineEndingSelect = root.querySelector('[data-role="line-ending-select"]');
    const includeBomCheckbox = root.querySelector('[data-role="include-bom-checkbox"]');

    expect(lineEndingSelect.value).toBe('crlf');
    expect(includeBomCheckbox.checked).toBe(true);

    fireEvent.change(lineEndingSelect, { target: { value: 'lf' } });
    fireEvent.click(includeBomCheckbox);

    expect(onExportEncodingSettingsChange).toHaveBeenNthCalledWith(1, { lineEnding: 'lf' });
    expect(onExportEncodingSettingsChange).toHaveBeenNthCalledWith(2, { includeBom: false });
  });
});
