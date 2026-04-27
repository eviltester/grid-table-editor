import { GherkinConvertor, GherkinOptions } from '../data_formats/gherkin-convertor.js';
import { MarkdownConvertor, MarkdownOptions } from '../data_formats/markdown-convertor.js';
import { HtmlConvertor, HtmlConvertorOptions } from '../data_formats/html-convertor.js';
import { JsonConvertor, JsonConvertorOptions } from '../data_formats/json-convertor.js';
import { JavascriptConvertor, JavascriptConvertorOptions } from '../data_formats/javascript-convertor.js';
import { XmlConvertor, XmlConvertorOptions } from '../data_formats/xml-convertor.js';
import { CsvConvertor } from '../data_formats/csv-convertor.js';
import { DelimiterConvertor } from '../data_formats/delimiter-convertor.js';
import { DelimiterOptions } from '../data_formats/delimiter-options.js';
import { AsciiTableConvertor, AsciiTableOptions } from '../data_formats/asciitable-convertor.js';
import { fileTypes } from '../data_formats/file-types.js';
import { PapaWrappa } from '../utils/papawrappa.js';

class Exporter {
  constructor(gridExtensions) {
    // TODO: this should be a higher level api than the low level ag-grid api
    // e.g. move to grid extensions or a GridExportExtensions
    this.gridExtensions = gridExtensions;

    this.options = {};
    this.options['csv'] = new DelimiterOptions('"');
    this.options['dsv'] = new DelimiterOptions('\t');
    this.options['asciitable'] = new AsciiTableOptions();
    this.options['markdown'] = new MarkdownOptions();
    this.options['json'] = new JsonConvertorOptions();
    this.options['javascript'] = new JavascriptConvertorOptions();
    this.options['xml'] = new XmlConvertorOptions();
    this.options['html'] = new HtmlConvertorOptions();
    this.options['gherkin'] = new GherkinOptions();

    this.exporters = {};
    this.exporters['markdown'] = new MarkdownConvertor();
    this.exporters['csv'] = new CsvConvertor();
    this.exporters['csv'].setPapaParse(new PapaWrappa());
    this.exporters['dsv'] = new DelimiterConvertor();
    this.exporters['dsv'].setPapaParse(new PapaWrappa());
    this.exporters['json'] = new JsonConvertor();
    this.exporters['javascript'] = new JavascriptConvertor();
    this.exporters['xml'] = new XmlConvertor();
    this.exporters['gherkin'] = new GherkinConvertor();
    this.exporters['html'] = new HtmlConvertor();
    this.exporters['asciitable'] = new AsciiTableConvertor();

    this.lastWarnings = {};
  }

  canExport(type) {
    return Object.prototype.hasOwnProperty.call(this.exporters, type);
  }

  getFileExtensionFor(type) {
    return fileTypes[type].fileExtension;
  }

  getGridAs(type) {
    return this.getDataTableAs(type, this.getGridAsGenericDataTable());
  }

  async getGridAsAsync(type, progressCallback) {
    const dataTable = await this.getGridAsGenericDataTableAsync(undefined, progressCallback);
    return this.getDataTableAsAsync(type, dataTable, progressCallback);
  }

  getDataTableAs(type, dataTable) {
    if (!this.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      this.lastWarnings[type] = [];
      return '';
    }

    if (Object.prototype.hasOwnProperty.call(this.exporters, type)) {
      let exporterToUse = this.exporters[type];
      let optionsToUse = this.options[type];
      if (optionsToUse !== undefined) {
        exporterToUse?.setOptions?.(optionsToUse);
      }
      const output = exporterToUse?.fromDataTable(dataTable);
      this._storeWarnings(type, exporterToUse);
      return output;
    }

    this.lastWarnings[type] = [];
  }

  async getDataTableAsAsync(type, dataTable, progressCallback) {
    if (!this.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
      this.lastWarnings[type] = [];
      return '';
    }

    if (Object.prototype.hasOwnProperty.call(this.exporters, type)) {
      let exporterToUse = this.exporters[type];
      let optionsToUse = this.options[type];
      if (optionsToUse !== undefined) {
        exporterToUse?.setOptions?.(optionsToUse);
      }

      const prefixedProgress = (message) => {
        if (!message) {
          return;
        }
        progressCallback?.(`${type.toUpperCase()}: ${message}`);
      };

      prefixedProgress('Formatting... 0%');
      if (typeof exporterToUse?.fromDataTableAsync === 'function') {
        const output = await exporterToUse.fromDataTableAsync(dataTable, prefixedProgress);
        this._storeWarnings(type, exporterToUse);
        return output;
      }
      const output = exporterToUse?.fromDataTable(dataTable);
      this._storeWarnings(type, exporterToUse);
      return output;
    }

    this.lastWarnings[type] = [];
  }

  getGridAsGenericDataTable(maxRows) {
    return this.gridExtensions.getGridAsGenericDataTable(maxRows);
  }

  async getGridAsGenericDataTableAsync(maxRows, progressCallback) {
    progressCallback?.('Reading grid data... 0%');
    if (typeof this.gridExtensions.getGridAsGenericDataTableAsync === 'function') {
      return this.gridExtensions.getGridAsGenericDataTableAsync(maxRows, progressCallback);
    }
    return this.gridExtensions.getGridAsGenericDataTable(maxRows);
  }

  getHeadersFromGrid() {
    return this.gridExtensions.getHeadersFromGrid();
  }

  getOptionsForType(type) {
    return this.options[type];
  }

  getLastWarningsForType(type) {
    const warnings = this.lastWarnings[type];
    if (!Array.isArray(warnings)) {
      return [];
    }
    return warnings.map((warning) => warning);
  }

  setOptionsForType(type, options) {
    if (this.options[type]) {
      let optionsToUse = this.options[type];
      optionsToUse.mergeOptions(options);

      // because we can switch headers off for these types
      // we need to remember them
      if (type === 'csv' || type === 'dsv') {
        if (optionsToUse.options?.header === false) {
          // store headers from the grid in the options
          optionsToUse.headers = this.getHeadersFromGrid();
        }
      }
    }
  }

  _storeWarnings(type, exporterToUse) {
    if (typeof exporterToUse?.getWarnings === 'function') {
      const warnings = exporterToUse.getWarnings();
      this.lastWarnings[type] = Array.isArray(warnings) ? warnings.map((warning) => warning) : [];
      return;
    }
    this.lastWarnings[type] = [];
  }
}

export { Exporter };
