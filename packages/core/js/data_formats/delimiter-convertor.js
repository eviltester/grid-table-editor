import { DelimiterOptions } from './delimiter-options.js';
import { GenericDataTableUtils } from './generic-data-table-utils.js';
import { GenericDataTable } from './generic-data-table.js';
import { DsvExporter } from './dsv-exporter.js';

export class DelimiterConvertor {
  constructor(params) {
    this.delimiterOptions = new DelimiterOptions();
    this.dsvExporter = new DsvExporter(this.delimiterOptions.options);

    if (params !== undefined) {
      this.setOptions(params);
    }
  }

  setOptions(newOptions) {
    this.delimiterOptions.mergeOptions(newOptions);
    this.dsvExporter.setOptions(this.delimiterOptions.options);
  }

  setPapaParse(papaparse) {
    this.papaparse = papaparse;
  }

  fromDataTable(dataTable) {
    return this.dsvExporter.fromDataTable(dataTable);
  }

  toDataTable(textToImport) {
    let headerText = '';

    if (this.delimiterOptions) {
      if (this.delimiterOptions.options.header == false) {
        // if we have any stored headers then add them to the input
        let headers = this.delimiterOptions.headers;
        if (headers !== undefined && headers.length > 0) {
          headerText = this.papaparse.unparse([this.delimiterOptions.headers], this.delimiterOptions.options);
          headerText = headerText + this.delimiterOptions.options.newline;
        }
      }
    }

    let rememberOptionsHeader = undefined;

    // we want PapaParse to return an array of nested arrays with first being headers
    if (this.delimiterOptions) {
      rememberOptionsHeader = this.delimiterOptions.options.header;
      this.delimiterOptions.options.header = false;
    }

    var results = this.papaparse.parse(headerText + textToImport, this.delimiterOptions.options);

    if (rememberOptionsHeader !== undefined) {
      this.delimiterOptions.options.header = rememberOptionsHeader;
    }

    let dataTable = new GenericDataTable();
    let utils = new GenericDataTableUtils();
    utils.setGenericDataTableFromDataArray(dataTable, results.data);
    return dataTable;
  }
}
