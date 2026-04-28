import { GherkinConvertor, GherkinOptions } from '../data_formats/gherkin-convertor.js';
import { MarkdownConvertor, MarkdownOptions } from '../data_formats/markdown-convertor.js';
import { HtmlConvertor, HtmlConvertorOptions } from '../data_formats/html-convertor.js';
import { JsonConvertor, JsonConvertorOptions } from '../data_formats/json-convertor.js';
import { JavaConvertor, JavaConvertorOptions } from '../data_formats/java-convertor.js';
import { JavascriptConvertor, JavascriptConvertorOptions } from '../data_formats/javascript-convertor.js';
import { PythonConvertor, PythonConvertorOptions } from '../data_formats/python-convertor.js';
import { TypeScriptConvertor, TypeScriptConvertorOptions } from '../data_formats/typescript-convertor.js';
import { XmlConvertor, XmlConvertorOptions } from '../data_formats/xml-convertor.js';
import { SqlConvertor, SqlConvertorOptions } from '../data_formats/sql-convertor.js';
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
    this.options['jsonl'] = new JsonConvertorOptions();
    this.options['jsonl'].mergeOptions({
      options: {
        prettyPrint: false,
        asObject: false,
        asPropertyNamed: '',
        outputAsJsonLines: true,
      },
    });
    this.options['java'] = new JavaConvertorOptions();
    this.options['javascript'] = new JavascriptConvertorOptions();
    this.options['python'] = new PythonConvertorOptions();
    this.options['typescript'] = new TypeScriptConvertorOptions();
    this.options['xml'] = new XmlConvertorOptions();
    this.options['sql'] = new SqlConvertorOptions();
    this.options['html'] = new HtmlConvertorOptions();
    this.options['gherkin'] = new GherkinOptions();

    this.exporters = {};
    this.exporters['markdown'] = new MarkdownConvertor();
    this.exporters['csv'] = new CsvConvertor();
    this.exporters['csv'].setPapaParse(new PapaWrappa());
    this.exporters['dsv'] = new DelimiterConvertor();
    this.exporters['dsv'].setPapaParse(new PapaWrappa());
    this.exporters['json'] = new JsonConvertor();
    this.exporters['jsonl'] = new JsonConvertor();
    this.exporters['java'] = new JavaConvertor();
    this.exporters['javascript'] = new JavascriptConvertor();
    this.exporters['python'] = new PythonConvertor();
    this.exporters['typescript'] = new TypeScriptConvertor();
    this.exporters['xml'] = new XmlConvertor();
    this.exporters['sql'] = new SqlConvertor();
    this.exporters['gherkin'] = new GherkinConvertor();
    this.exporters['html'] = new HtmlConvertor();
    this.exporters['asciitable'] = new AsciiTableConvertor();
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
      return '';
    }

    if (Object.prototype.hasOwnProperty.call(this.exporters, type)) {
      let exporterToUse = this.exporters[type];
      let optionsToUse = this.options[type];
      if (optionsToUse !== undefined) {
        exporterToUse?.setOptions?.(optionsToUse);
      }
      return exporterToUse?.fromDataTable(dataTable);
    }
  }

  async getDataTableAsAsync(type, dataTable, progressCallback) {
    if (!this.canExport(type)) {
      console.log(`Data Type ${type} not supported for exporting`);
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
        return exporterToUse.fromDataTableAsync(dataTable, prefixedProgress);
      }
      return exporterToUse?.fromDataTable(dataTable);
    }
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
}

export { Exporter };
