import { Download } from './download.js';

class ExportsPageMap {
  constructor() {
    this.fileDownloadButtonQuery = '#filedownload';
    this.markdownTextArea = '#markdownarea';
    this.copyTextButton = '#copyTextButton';
    this.exportProgressStatus = '#export-progress-status';
  }
}

class ExportControls {
  constructor(exporter) {
    this.pageMap = new ExportsPageMap();
    this.exporter = exporter;
  }

  addHooksToPage(container) {
    var element = container.querySelector(this.pageMap.fileDownloadButtonQuery);
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

    var copyButton = container.querySelector(this.pageMap.copyTextButton);
    var copyTextButtonListener = this.copyText.bind(this);
    copyButton.addEventListener('click', copyTextButtonListener, false);
  }

  async fileDownload() {
    this._setDownloadBusyState(true);
    this._setExportProgressStatus('Preparing download...', true);

    try {
      await this._yieldToUi();
      var type = document.querySelector('li.active-type a').getAttribute('data-type');

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

      const warnings = this.showWarnings(type, 'Download completed with export warnings.');

      this._setExportProgressStatus('Starting download...', true);
      await this._yieldToUi();
      new Download(filename).downloadFile(text);
      if (warnings.length > 0) {
        this._setExportProgressStatus(`Download started with ${warnings.length} warning(s).`, false);
      } else {
        this._setExportProgressStatus('Download started.', false);
      }
    } catch (error) {
      console.error('Failed exporting download', error);
      this._setExportProgressStatus('Download failed. Please try again.', false);
    } finally {
      this._setDownloadBusyState(false);
      setTimeout(() => this._clearExportProgressStatus(), 1200);
    }
  }

  copyText() {
    var copyText = document.querySelector(this.pageMap.markdownTextArea);

    // select text
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand('copy');

    let copyButton = document.querySelector(this.pageMap.copyTextButton);
    copyButton.innerText = 'Copied';
    setTimeout(
      function (aButton) {
        aButton.innerText = 'Copy';
      },
      3000,
      copyButton
    );
  }

  renderTextFromGrid() {
    let type = document.querySelector('li.active-type a').getAttribute('data-type');

    if (!this.exporter.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      return;
    }

    let textToRender = this.exporter.getGridAs(type);
    this.setTextFromString(textToRender);
    this.showWarnings(type, 'Preview contains export warnings.');
  }

  setTextFromString(someText) {
    document.getElementById('markdownarea').value = someText;
  }

  setImportBusyState(isBusy) {
    const button = document.querySelector(this.pageMap.fileDownloadButtonQuery);
    if (!button) {
      return;
    }
    button.dataset.importBusy = isBusy === true ? 'true' : 'false';
    this._syncDownloadButtonState();
  }

  _setDownloadBusyState(isBusy) {
    const button = document.querySelector(this.pageMap.fileDownloadButtonQuery);
    if (!button) {
      return;
    }
    button.dataset.downloadBusy = isBusy === true ? 'true' : 'false';
    this._syncDownloadButtonState();
  }

  _syncDownloadButtonState() {
    const button = document.querySelector(this.pageMap.fileDownloadButtonQuery);
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
    const statusElem = document.querySelector(this.pageMap.exportProgressStatus);
    if (!statusElem) {
      return;
    }
    statusElem.textContent = message;
    statusElem.style.display = 'inline-block';
    statusElem.classList.toggle('is-loading', isLoading === true);
  }

  _clearExportProgressStatus() {
    const statusElem = document.querySelector(this.pageMap.exportProgressStatus);
    if (!statusElem) {
      return;
    }
    statusElem.textContent = '';
    statusElem.style.display = 'none';
    statusElem.classList.remove('is-loading');
  }

  showWarnings(type, context) {
    const warnings = this.exporter?.getLastWarningsForType?.(type) || [];
    if (warnings.length === 0) {
      return [];
    }

    const warningLabel = warnings.length === 1 ? 'warning' : 'warnings';
    this._setExportProgressStatus(`${type.toUpperCase()} ${warningLabel}: ${warnings.length}. ${context}`, false);

    const alertFunc = globalThis?.alert || document?.defaultView?.alert;
    if (typeof alertFunc === 'function') {
      alertFunc(`${type.toUpperCase()} ${warningLabel}:\n${warnings.join('\n')}`);
    }

    setTimeout(() => this._clearExportProgressStatus(), 4000);
    return warnings;
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
}

export { ExportControls, ExportsPageMap };
