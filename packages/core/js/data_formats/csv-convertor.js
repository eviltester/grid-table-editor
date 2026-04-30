import { DelimiterConvertor } from './delimiter-convertor.js';
import { DelimiterOptions } from './delimiter-options.js';
import { CsvExporter } from './dsv-exporter.js';

export class CsvConvertor {
  constructor(params) {
    this.options = new DelimiterOptions(',');
    this.delegateTo = new DelimiterConvertor(this.options);
    this.csvExporter = new CsvExporter(this.options.options);

    if (params !== undefined) {
      this.setOptions(params);
    }
  }

  setOptions(delimiterOptions) {
    this.options.mergeOptions(delimiterOptions);
    this.options.delimiter = ',';
    this.delegateTo = new DelimiterConvertor(this.options);
    this.delegateTo.setPapaParse(this.papaparse);
    this.csvExporter.setOptions(this.options.options);
  }

  setPapaParse(papaparse) {
    this.papaparse = papaparse;
    this.delegateTo.setPapaParse(papaparse);
  }

  fromDataTable(dataTable) {
    return this.csvExporter.fromDataTable(dataTable);
  }

  async fromDataTableAsync(dataTable, progressCallback) {
    return this.csvExporter.fromDataTableAsync(dataTable, progressCallback);
  }

  toDataTable(textToImport) {
    return this.delegateTo.toDataTable(textToImport);
  }
}
