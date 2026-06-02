import { Download } from '../shared/download.js';
import { scheduleTimeout } from '../shared/unref-timeout.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

class ExportsPageMap {
  constructor() {
    this.fileDownloadButtonQuery = '#filedownload';
    this.markdownTextArea = '#markdownarea';
    this.copyTextButton = '#copyTextButton';
    this.exportProgressStatus = '#export-progress-status';
  }
}

class ExportControls {
  constructor(exporter, { documentObj = getDefaultDocumentObj() } = {}) {
    this.pageMap = new ExportsPageMap();
    this.exporter = exporter;
    this.documentObj = documentObj;
    this.root = null;
  }

  addHooksToPage(container) {
    this.root = container;
    var element = this._query(this.pageMap.fileDownloadButtonQuery);
    if (!element) {
      return;
    }
    var addDownloadButtonListener = this.fileDownload.bind(this);
    element.addEventListener('click', addDownloadButtonListener, false);
    if (element) {
      if (!element.dataset.downloadBusy) {
        element.dataset.downloadBusy = 'false';
      }
      if (!element.dataset.importBusy) {
        element.dataset.importBusy = 'false';
      }
      this._syncDownloadButtonState();
    }

    var copyButton = this._query(this.pageMap.copyTextButton);
    if (!copyButton) {
      return;
    }
    var copyTextButtonListener = this.copyText.bind(this);
    copyButton.addEventListener('click', copyTextButtonListener, false);
  }

  async fileDownload() {
    this._setDownloadBusyState(true);
    this._setExportProgressStatus('Preparing download...', true);

    try {
      await this._yieldToUi();
      var type = this._query('li.active-type a')?.getAttribute('data-type');

      if (!this.exporter.canExport(type)) {
        console.log(`Data Type ${type} not supported`);
        this._setExportProgressStatus('Export not available for this format.', false);
        return;
      }

      var filename = 'export' + this.exporter.getFileExtensionFor(type);

      this._setExportProgressStatus('Generating export text...', true);
      let text = '';
      if (typeof this.exporter.getGridAsAsync === 'function') {
        text = await this.exporter.getGridAsAsync(type, (message) => {
          if (message) {
            this._setExportProgressStatus(message, true);
          }
        });
      } else {
        text = this.exporter.getGridAs(type);
      }

      this._setExportProgressStatus('Starting download...', true);
      await this._yieldToUi();
      new Download(filename).downloadFile(text);
      this._setExportProgressStatus('Download started.', false);
    } catch (error) {
      console.error('Failed exporting download', error);
      this._setExportProgressStatus('Download failed. Please try again.', false);
    } finally {
      this._setDownloadBusyState(false);
      scheduleTimeout(() => this._clearExportProgressStatus(), 1200);
    }
  }

  copyText() {
    var copyText = this._query(this.pageMap.markdownTextArea);

    // select text
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    this.documentObj?.execCommand?.('copy');

    let copyButton = this._query(this.pageMap.copyTextButton);
    copyButton.innerText = 'Copied';
    scheduleTimeout(
      function (aButton) {
        aButton.innerText = 'Copy';
      },
      3000,
      copyButton
    );
  }

  renderTextFromGrid() {
    let type = this._query('li.active-type a')?.getAttribute('data-type');

    if (!this.exporter.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      return;
    }

    let textToRender = this.exporter.getGridAs(type);
    this.setTextFromString(textToRender);
  }

  setTextFromString(someText) {
    const textArea = this._query(this.pageMap.markdownTextArea);
    if (textArea) {
      textArea.value = someText;
    }
  }

  setImportBusyState(isBusy) {
    const button = this._query(this.pageMap.fileDownloadButtonQuery);
    if (!button) {
      return;
    }
    button.dataset.importBusy = isBusy === true ? 'true' : 'false';
    this._syncDownloadButtonState();
  }

  _setDownloadBusyState(isBusy) {
    const button = this._query(this.pageMap.fileDownloadButtonQuery);
    if (!button) {
      return;
    }
    button.dataset.downloadBusy = isBusy === true ? 'true' : 'false';
    this._syncDownloadButtonState();
  }

  _syncDownloadButtonState() {
    const button = this._query(this.pageMap.fileDownloadButtonQuery);
    if (!button) {
      return;
    }

    const downloadBusy = button.dataset.downloadBusy === 'true';
    const importBusy = button.dataset.importBusy === 'true';
    const isBusy = downloadBusy || importBusy;

    button.disabled = isBusy;
    button.setAttribute('aria-busy', isBusy ? 'true' : 'false');
  }

  _setExportProgressStatus(message, isLoading) {
    const statusElem = this._query(this.pageMap.exportProgressStatus);
    if (!statusElem) {
      return;
    }
    statusElem.textContent = message;
    statusElem.style.display = 'inline-block';
    statusElem.classList.toggle('is-loading', isLoading === true);
  }

  _clearExportProgressStatus() {
    const statusElem = this._query(this.pageMap.exportProgressStatus);
    if (!statusElem) {
      return;
    }
    statusElem.textContent = '';
    statusElem.style.display = 'none';
    statusElem.classList.remove('is-loading');
  }

  _yieldToUi() {
    return new Promise((resolve) => {
      if (typeof requestAnimationFrame !== 'function') {
        setTimeout(resolve, 0);
        return;
      }
      requestAnimationFrame(() => {
        setTimeout(resolve, 0);
      });
    });
  }

  _query(selector) {
    return this.root?.querySelector?.(selector) || this.documentObj?.querySelector?.(selector) || null;
  }
}

export { ExportControls, ExportsPageMap };
