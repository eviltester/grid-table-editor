import { ExportControls } from './exportControls.js';
import { DragDropControl } from './drag-drop-control.js';
import { CsvDelimitedOptions } from './options_panels/options-csv-delimited-controls.js';
import { DelimitedOptions } from './options_panels/options-delimited-controls.js';
import { AsciiTableOptionsPanel } from './options_panels/options-ascii-table.js';
import { MarkdownOptionsPanel } from './options_panels/options-markdown-panel.js';
import { JsonOptionsPanel } from './options_panels/options-json-panel.js';
import { JavaOptionsPanel } from './options_panels/options-java-panel.js';
import { JavascriptOptionsPanel } from './options_panels/options-javascript-panel.js';
import { PythonOptionsPanel } from './options_panels/options-python-panel.js';
import { PhpOptionsPanel } from './options_panels/options-php-panel.js';
import { RubyOptionsPanel } from './options_panels/options-ruby-panel.js';
import { KotlinOptionsPanel } from './options_panels/options-kotlin-panel.js';
import { CSharpOptionsPanel } from './options_panels/options-csharp-panel.js';
import { PerlOptionsPanel } from './options_panels/options-perl-panel.js';
import { TypeScriptOptionsPanel } from './options_panels/options-typescript-panel.js';
import { XmlOptionsPanel } from './options_panels/options-xml-panel.js';
import { SqlOptionsPanel } from './options_panels/options-sql-panel.js';
import { GherkinOptionsPanel } from './options_panels/options-gherkin-panel.js';
import { HtmlOptionsPanel } from './options_panels/options-html-panel.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

class ImportExportControls {
  constructor() {
    this.previewRowLimit = 10;
    this.textEditMode = 'preview';
  }

  addHTMLtoGui(parentelement) {
    parentelement.innerHTML = `<span data-help="import-export-controls" class="helpicon"></span>
            <button id="settextfromgridbutton">v Set Text From Grid v</button>
            <button id="setgridfromtextbutton" disabled>^ Set Grid From Text ^</button>
            <label id="csvinputlabel"><span class="fileFormat">.csv</span> import ^:<input type="file" id="csvinput"/></label>
            <button id="filedownload"><span class="fileFormat">.csv</span> Download</button>
            <div id="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <label id="dropzone">
            <span>[Drag And Drop <span class="fileFormat">.csv</span> File Here]</span>
            </label>
            <div id="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
        `;

    let settextfromgridbutton = parentelement.querySelector('#settextfromgridbutton');
    let setTextAreaClickListener = this.renderTextFromGrid.bind(this);
    settextfromgridbutton.addEventListener('click', setTextAreaClickListener, false);

    let setgridfromtextbutton = parentelement.querySelector('#setgridfromtextbutton');
    let importTextAreaClickListener = this.importTextArea.bind(this);
    setgridfromtextbutton.addEventListener('click', importTextAreaClickListener, false);
    this._syncGridFromTextButtonState();

    this.fileInputElement = parentelement.querySelector('#csvinput');
    let csvinputchangelistener = this.loadFile.bind(this);
    // clear file upload on click to allow re-uploading same file after option changes e.g for delimiters
    this.fileInputElement.addEventListener(
      'click',
      (e) => {
        e.currentTarget.value = '';
      },
      false
    );
    this.fileInputElement.addEventListener('change', csvinputchangelistener, false);

    // setup the drop zone
    const dragDropZone = new DragDropControl(this.readFile.bind(this));
    dragDropZone.configureAsDropZone(parentelement.querySelector('#dropzone'));
  }

  setImporter(anImporter) {
    this.importer = anImporter;
  }

  setExporter(anExporter) {
    this.exporter = anExporter;

    this.exportControls = new ExportControls(this.exporter);
    this.exportControls.addHooksToPage(document);
  }

  getExportControls() {
    return this.exportControls;
  }

  importTextArea() {
    if (this.isPreviewTextMode()) {
      alert('Grid to Text only availalable in Edit mode');
      return;
    }

    const typeToImport = document.querySelector('li.active-type a').getAttribute('data-type');
    const textToImport = document.getElementById('markdownarea').value;

    this.setCurrentTypeOptions();
    return this.importer.importText(typeToImport, textToImport);
  }

  renderTextFromGrid() {
    if (this.isPreviewTextMode()) {
      this._renderPreviewTextFromGrid();
      return;
    }
    this.exportControls.renderTextFromGrid();
  }

  loadFile() {
    this.setCurrentTypeOptions();
    this._setImportProgressStatus('Preparing file import...', true);
    this.readFile(this.fileInputElement.files[0]);
  }

  readFile(aFile) {
    if (!aFile) {
      this._setExportActionsBusyState(false);
      this._clearImportProgressStatus();
      return;
    }

    this._setExportActionsBusyState(true);
    const reader = new FileReader();
    this._setImportProgressStatus(`Loading ${aFile.name}... 0%`, true);

    reader.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pct = Math.min(100, Math.round((event.loaded / event.total) * 100));
        this._setImportProgressStatus(`Loading ${aFile.name}... ${pct}%`, true);
        return;
      }
      this._setImportProgressStatus(`Loading ${aFile.name}...`, true);
    });

    reader.addEventListener('load', (event) => {
      this._setImportProgressStatus(this.isPreviewTextMode() ? 'Preparing preview...' : 'Importing into grid...', true);
      this._yieldToUi().then(async () => {
        try {
          const type = this._getActiveType();
          const importedText = event.target.result;
          if (this.isPreviewTextMode()) {
            await this._previewThenImportToGrid(type, importedText);
          } else {
            this.exportControls.setTextFromString(importedText);
            this._setImportProgressStatus('Importing full data into grid...', true);
            await this._yieldToUi();
            await Promise.resolve(this.importer.importText(type, importedText));
            this._setImportProgressStatus('Import complete.', false);
          }
        } catch (error) {
          console.error('Failed importing file', error);
          this._setImportProgressStatus('Import failed. Check file format/options.', false);
          return;
        } finally {
          this._setExportActionsBusyState(false);
        }

        setTimeout(() => this._clearImportProgressStatus(), 1200);
      });
    });

    reader.addEventListener('error', () => {
      this._setImportProgressStatus('File read failed.', false);
      this._setExportActionsBusyState(false);
    });

    reader.addEventListener('abort', () => {
      this._setImportProgressStatus('File read cancelled.', false);
      this._setExportActionsBusyState(false);
    });

    reader.readAsText(aFile);
  }

  _setImportProgressStatus(message, isLoading) {
    const statusElem = document.querySelector('#import-progress-status');
    if (!statusElem) {
      return;
    }
    statusElem.textContent = message;
    statusElem.style.display = 'inline-block';
    statusElem.classList.toggle('is-loading', isLoading === true);
  }

  _clearImportProgressStatus() {
    const statusElem = document.querySelector('#import-progress-status');
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

  _setExportActionsBusyState(isBusy) {
    const setTextFromGridButton = document.querySelector('#settextfromgridbutton');
    if (setTextFromGridButton) {
      const busy = isBusy === true;
      setTextFromGridButton.disabled = busy;
      setTextFromGridButton.setAttribute('aria-busy', busy ? 'true' : 'false');
    }

    this.exportControls?.setImportBusyState?.(isBusy === true);
  }

  setFileFormatType() {
    // TODO : these should not be document based locators, they should work from the parent

    // get data format type
    const type = document.querySelector('li.active-type a').getAttribute('data-type');

    // set import control visibility
    const importControlLocators = ['#setgridfromtextbutton', '#dropzone', '#csvinputlabel', '#csvinput'];
    let importControls = [];
    importControlLocators.forEach((locator) => {
      let elem = document.querySelector(locator);
      if (elem) {
        importControls.push(elem);
      }
    });

    let importVisibility = 'visible';

    if (!this.importer.canImport(type)) {
      console.log(`Data Type ${type} not supported for importing`);
      importVisibility = 'hidden';
    }

    importControls.forEach((e) => (e.style.visibility = importVisibility));
    this._syncGridFromTextButtonState();

    // set export controls visibility
    const exportControlLocators = ['#filedownload'];
    let exportControls = [];
    exportControlLocators.forEach((locator) => {
      let elem = document.querySelector(locator);
      if (elem) {
        exportControls.push(elem);
      }
    });

    let exportVisibility = 'visible';

    if (!this.exporter.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      exportVisibility = 'hidden';
    }

    exportControls.forEach((e) => (e.style.visibility = exportVisibility));

    // TODO : allow export and import to have different file types
    // configure file type display
    const fileType = this.importer.getFileExtensionFor(type);

    document.querySelectorAll('.fileFormat').forEach((elem) => (elem.innerText = fileType));
  }

  setupOptionsPanelsWithin(optionsparent) {
    if (this.optionsPanels === undefined) {
      if (optionsparent) {
        this.optionsPanels = {};
        this.optionsPanels['csv'] = new CsvDelimitedOptions(optionsparent);
        this.optionsPanels['dsv'] = new DelimitedOptions(optionsparent);
        this.optionsPanels['asciitable'] = new AsciiTableOptionsPanel(optionsparent);
        this.optionsPanels['markdown'] = new MarkdownOptionsPanel(optionsparent);
        this.optionsPanels['json'] = new JsonOptionsPanel(optionsparent);
        this.optionsPanels['jsonl'] = new JsonOptionsPanel(optionsparent, 'jsonl-options', { jsonlMode: true });
        this.optionsPanels['javascript'] = new JavascriptOptionsPanel(optionsparent);
        this.optionsPanels['java'] = new JavaOptionsPanel(optionsparent);
        this.optionsPanels['python'] = new PythonOptionsPanel(optionsparent);
        this.optionsPanels['kotlin'] = new KotlinOptionsPanel(optionsparent);
        this.optionsPanels['csharp'] = new CSharpOptionsPanel(optionsparent);
        this.optionsPanels['perl'] = new PerlOptionsPanel(optionsparent);
        this.optionsPanels['php'] = new PhpOptionsPanel(optionsparent);
        this.optionsPanels['ruby'] = new RubyOptionsPanel(optionsparent);
        this.optionsPanels['typescript'] = new TypeScriptOptionsPanel(optionsparent);
        this.optionsPanels['xml'] = new XmlOptionsPanel(optionsparent);
        this.optionsPanels['sql'] = new SqlOptionsPanel(optionsparent);
        this.optionsPanels['html'] = new HtmlOptionsPanel(optionsparent);
        this.optionsPanels['gherkin'] = new GherkinOptionsPanel(optionsparent);
      }
    }
  }
  setOptionsViewForFormatType() {
    const type = document.querySelector('li.active-type a').getAttribute('data-type');

    const edit_area = document.querySelector('div.edit-area');
    const optionsparent = document.querySelector('div.options-parent');
    const text_area = document.getElementById('markdown');

    edit_area.style.width = '100%';
    edit_area.style.height = '30%';

    if (this.optionsPanels === undefined) {
      this.setupOptionsPanelsWithin(optionsparent);
    }

    let optionsPanel = this.optionsPanels[type];

    if (optionsPanel === undefined) {
      console.log('undefined panel type for ' + type);
      edit_area.style.display = 'block';
      optionsparent.style.display = 'none';
      text_area.style.width = '100%';
      text_area.style.height = '100%';
      return;
    }

    edit_area.style.display = 'flex';

    text_area.style.width = '100%';
    text_area.style.height = '100%';

    optionsparent.style.width = '17em';
    optionsparent.style.height = '100%';

    optionsparent.innerHTML = '';

    if (optionsPanel) {
      optionsPanel.addToGui();
      optionsPanel.setFromOptions(this.exporter.getOptionsForType(type));
      this.configureOptionsApplyDirtyState(optionsparent);
      optionsPanel.setApplyCallback((options) => {
        this.applyCurrentTypeOptions(options);
        this.setOptionsApplyDirtyState(optionsparent, false);
      });
      if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
        window.updateHelpHints();
      }
    }

    optionsparent.style.display = 'block';
  }

  setOptionsApplyDirtyState(optionsparent, isDirty) {
    const applyButton = optionsparent?.querySelector?.('.apply-options');
    if (!applyButton) {
      return;
    }

    applyButton.disabled = isDirty !== true;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  configureOptionsApplyDirtyState(optionsparent) {
    const panelRoot = optionsparent?.firstElementChild;
    if (!panelRoot) {
      return;
    }

    this.setOptionsApplyDirtyState(optionsparent, false);

    const markDirty = (event) => {
      const target = event?.target;
      if (!target || typeof target.closest !== 'function') {
        return;
      }
      if (target.closest('.apply-options')) {
        return;
      }
      this.setOptionsApplyDirtyState(optionsparent, true);
    };

    panelRoot.addEventListener('input', markDirty);
    panelRoot.addEventListener('change', markDirty);
  }

  setCurrentTypeOptions() {
    const type = document.querySelector('li.active-type a').getAttribute('data-type');
    this.importer.setOptionsForType(type, this.optionsPanels[type].getOptionsFromGui());
    this.exporter.setOptionsForType(type, this.optionsPanels[type].getOptionsFromGui());
  }

  applyCurrentTypeOptions(options) {
    const type = document.querySelector('li.active-type a').getAttribute('data-type');
    this.importer.setOptionsForType(type, options);
    this.exporter.setOptionsForType(type, options);
    this.renderTextFromGrid();
  }

  isPreviewTextMode() {
    return this.textEditMode === 'preview';
  }

  getPreviewRowLimit() {
    return this.previewRowLimit;
  }

  toggleTextEditMode() {
    if (this.isPreviewTextMode()) {
      this.textEditMode = 'edit';
      this._syncGridFromTextButtonState();
      if (confirm('Do you want to Set Text From Grid?')) {
        this.renderTextFromGrid();
      } else {
        this.exportControls.setTextFromString('');
      }
      return this.textEditMode;
    }

    this.textEditMode = 'preview';
    this._syncGridFromTextButtonState();
    this.renderTextFromGrid();
    return this.textEditMode;
  }

  _renderPreviewTextFromGrid() {
    const type = this._getActiveType();
    const previewDataTable = this.exporter.getGridAsGenericDataTable(this.previewRowLimit);
    const textToRender = this.exporter.getDataTableAs(type, previewDataTable);
    this.exportControls.setTextFromString(textToRender);
  }

  _renderPreviewTextFromInput(type, textToImport) {
    const dataTable = this.importer.toGenericDataTable(type, textToImport);
    this._renderPreviewTextFromDataTable(type, dataTable);
  }

  _renderPreviewTextFromDataTable(type, dataTable) {
    const limitedDataTable = this._limitDataTableRows(dataTable, this.previewRowLimit);
    const textToRender = this.exporter.getDataTableAs(type, limitedDataTable);
    this.exportControls.setTextFromString(textToRender);
  }

  async _previewThenImportToGrid(type, textToImport) {
    const dataTable = this.importer.toGenericDataTable(type, textToImport);
    if (!dataTable) {
      throw new Error('Unable to parse input into data table.');
    }

    this._renderPreviewTextFromDataTable(type, dataTable);
    this._setImportProgressStatus(
      `Preview loaded (first ${this.previewRowLimit} items). Loading full data into grid...`,
      true
    );
    await this._yieldToUi();
    this._setImportProgressStatus('Importing full data into grid...', true);
    await this._yieldToUi();

    await Promise.resolve(this.importer.setGridFromGenericDataTable(dataTable));
    this._setImportProgressStatus('Import complete.', false);
  }

  _limitDataTableRows(dataTable, maxRows) {
    const limited = new GenericDataTable();
    if (!dataTable) {
      return limited;
    }

    const headers = dataTable.getHeaders ? dataTable.getHeaders() : [];
    limited.setHeaders(headers);

    const rowCount = dataTable.getRowCount ? dataTable.getRowCount() : 0;
    const limit = Math.min(Math.max(maxRows, 0), rowCount);
    for (let rowIndex = 0; rowIndex < limit; rowIndex++) {
      limited.appendDataRow(dataTable.getRow(rowIndex));
    }
    return limited;
  }

  _getActiveType() {
    return document.querySelector('li.active-type a').getAttribute('data-type');
  }

  _syncGridFromTextButtonState() {
    const importButton = document.querySelector('#setgridfromtextbutton');
    if (!importButton) {
      return;
    }
    importButton.disabled = this.isPreviewTextMode();
  }
}

export { ImportExportControls };
