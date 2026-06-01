import { Download } from '../../shared/download.js';
import { scheduleTimeout } from '../../shared/unref-timeout.js';

function createClipboardService({ documentObj = document } = {}) {
  return {
    copyFromTextArea(textArea) {
      if (!textArea) {
        return;
      }

      textArea.select();
      textArea.setSelectionRange(0, 99999);
      documentObj.execCommand('copy');
    },
  };
}

function createDownloadService({ DownloadCtor = Download } = {}) {
  return {
    downloadText(filename, text) {
      new DownloadCtor(filename).downloadFile(text);
    },
  };
}

class ExportActionsAdapter {
  constructor({
    exporter = null,
    root = null,
    documentObj = document,
    clipboardService = createClipboardService({ documentObj }),
    downloadService = createDownloadService(),
    scheduleTimeoutFn = scheduleTimeout,
  } = {}) {
    this.exporter = exporter;
    this.root = root;
    this.documentObj = documentObj;
    this.clipboardService = clipboardService;
    this.downloadService = downloadService;
    this.scheduleTimeoutFn = scheduleTimeoutFn;
    this.pageMap = {
      fileDownloadButtonQuery: '#filedownload',
      markdownTextArea: '#markdownarea',
      copyTextButton: '#copyTextButton',
      exportProgressStatus: '#export-progress-status',
    };
    this.handleDownloadClick = () => this.fileDownload();
    this.handleCopyClick = () => this.copyText();
  }

  bind(root = this.root) {
    this.root = root;

    const downloadButton = this._query(this.pageMap.fileDownloadButtonQuery);
    if (downloadButton) {
      downloadButton.addEventListener('click', this.handleDownloadClick, false);
      if (!downloadButton.dataset.downloadBusy) {
        downloadButton.dataset.downloadBusy = 'false';
      }
      if (!downloadButton.dataset.importBusy) {
        downloadButton.dataset.importBusy = 'false';
      }
      this._syncDownloadButtonState();
    }

    const copyButton = this._query(this.pageMap.copyTextButton);
    if (copyButton) {
      copyButton.addEventListener('click', this.handleCopyClick, false);
    }
  }

  destroy() {
    this._query(this.pageMap.fileDownloadButtonQuery)?.removeEventListener('click', this.handleDownloadClick, false);
    this._query(this.pageMap.copyTextButton)?.removeEventListener('click', this.handleCopyClick, false);
  }

  setExporter(exporter) {
    this.exporter = exporter;
  }

  async fileDownload() {
    this._setDownloadBusyState(true);
    this._setExportProgressStatus('Preparing download...', true);

    try {
      await this._yieldToUi();
      const type = this._getActiveType();

      if (!this.exporter?.canExport?.(type)) {
        console.log(`Data Type ${type} not supported`);
        this._setExportProgressStatus('Export not available for this format.', false);
        return;
      }

      const filename = 'export' + this.exporter.getFileExtensionFor(type);

      this._setExportProgressStatus('Generating export text...', true);
      let text = '';
      if (typeof this.exporter?.getGridAsAsync === 'function') {
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
      this.downloadService.downloadText(filename, text);
      this._setExportProgressStatus('Download started.', false);
    } catch (error) {
      console.error('Failed exporting download', error);
      this._setExportProgressStatus('Download failed. Please try again.', false);
    } finally {
      this._setDownloadBusyState(false);
      this.scheduleTimeoutFn(() => this._clearExportProgressStatus(), 1200);
    }
  }

  copyText() {
    const textArea = this._query(this.pageMap.markdownTextArea);
    this.clipboardService.copyFromTextArea(textArea);

    const copyButton = this._query(this.pageMap.copyTextButton);
    if (!copyButton) {
      return;
    }
    copyButton.innerText = 'Copied';
    this.scheduleTimeoutFn(
      (button) => {
        button.innerText = 'Copy';
      },
      3000,
      copyButton
    );
  }

  renderTextFromGrid() {
    const type = this._getActiveType();

    if (!this.exporter?.canExport?.(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      return;
    }

    const textToRender = this.exporter.getGridAs(type);
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

  _getActiveType() {
    return this._query('li.active-type a')?.getAttribute('data-type');
  }

  _query(selector) {
    return this.root?.querySelector?.(selector) || this.documentObj?.querySelector?.(selector) || null;
  }
}

function createExportActionsAdapter(options) {
  return new ExportActionsAdapter(options);
}

export { createExportActionsAdapter, ExportActionsAdapter, createClipboardService, createDownloadService };
