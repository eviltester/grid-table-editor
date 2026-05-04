import { GherkinConvertor, GherkinOptions } from '../data_formats/gherkin-convertor.js';
import { MarkdownConvertor, MarkdownOptions } from '../data_formats/markdown-convertor.js';
import { HtmlConvertor, HtmlConvertorOptions } from '../data_formats/html-convertor.js';
import { JsonConvertor, JsonConvertorOptions } from '../data_formats/json-convertor.js';
import { JavaConvertor, JavaConvertorOptions } from '../data_formats/java-convertor.js';
import { JavascriptConvertor, JavascriptConvertorOptions } from '../data_formats/javascript-convertor.js';
import { PythonConvertor, PythonConvertorOptions } from '../data_formats/python-convertor.js';
import { PhpConvertor, PhpConvertorOptions } from '../data_formats/php-convertor.js';
import { RubyConvertor, RubyConvertorOptions } from '../data_formats/ruby-convertor.js';
import { KotlinConvertor, KotlinConvertorOptions } from '../data_formats/kotlin-convertor.js';
import { CSharpConvertor, CSharpConvertorOptions } from '../data_formats/csharp-convertor.js';
import { PerlConvertor, PerlConvertorOptions } from '../data_formats/perl-convertor.js';
import { TypeScriptConvertor, TypeScriptConvertorOptions } from '../data_formats/typescript-convertor.js';
import { TestFrameworkConvertor, TestFrameworkConvertorOptions } from '../data_formats/test-framework-convertor.js';
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
    this.options['php'] = new PhpConvertorOptions();
    this.options['ruby'] = new RubyConvertorOptions();
    this.options['kotlin'] = new KotlinConvertorOptions();
    this.options['csharp'] = new CSharpConvertorOptions();
    this.options['perl'] = new PerlConvertorOptions();
    this.options['typescript'] = new TypeScriptConvertorOptions();
    this.options['junit4'] = new TestFrameworkConvertorOptions();
    this.options['junit5'] = new TestFrameworkConvertorOptions();
    this.options['junit6'] = new TestFrameworkConvertorOptions();
    this.options['testng'] = new TestFrameworkConvertorOptions();
    this.options['pytest'] = new TestFrameworkConvertorOptions();
    this.options['jest'] = new TestFrameworkConvertorOptions();
    this.options['xunit'] = new TestFrameworkConvertorOptions();
    this.options['rspec'] = new TestFrameworkConvertorOptions();
    this.options['phpunit'] = new TestFrameworkConvertorOptions();
    this.options['kotest'] = new TestFrameworkConvertorOptions();
    this.options['test-more'] = new TestFrameworkConvertorOptions();
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
    this.exporters['php'] = new PhpConvertor();
    this.exporters['ruby'] = new RubyConvertor();
    this.exporters['kotlin'] = new KotlinConvertor();
    this.exporters['csharp'] = new CSharpConvertor();
    this.exporters['perl'] = new PerlConvertor();
    this.exporters['typescript'] = new TypeScriptConvertor();
    this.exporters['junit4'] = new TestFrameworkConvertor();
    this.exporters['junit4'].setFramework('junit4');
    this.exporters['junit5'] = new TestFrameworkConvertor();
    this.exporters['junit5'].setFramework('junit5');
    this.exporters['junit6'] = new TestFrameworkConvertor();
    this.exporters['junit6'].setFramework('junit6');
    this.exporters['testng'] = new TestFrameworkConvertor();
    this.exporters['testng'].setFramework('testng');
    this.exporters['pytest'] = new TestFrameworkConvertor();
    this.exporters['pytest'].setFramework('pytest');
    this.exporters['jest'] = new TestFrameworkConvertor();
    this.exporters['jest'].setFramework('jest');
    this.exporters['xunit'] = new TestFrameworkConvertor();
    this.exporters['xunit'].setFramework('xunit');
    this.exporters['rspec'] = new TestFrameworkConvertor();
    this.exporters['rspec'].setFramework('rspec');
    this.exporters['phpunit'] = new TestFrameworkConvertor();
    this.exporters['phpunit'].setFramework('phpunit');
    this.exporters['kotest'] = new TestFrameworkConvertor();
    this.exporters['kotest'].setFramework('kotest');
    this.exporters['test-more'] = new TestFrameworkConvertor();
    this.exporters['test-more'].setFramework('test-more');
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
