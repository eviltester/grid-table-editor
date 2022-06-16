import { DelimiterConvertor } from "./delimiter-convertor.js";
import { DelimiterOptions } from "./delimiter-options.js";

export class CsvConvertor {

    constructor(params) {
        this.options = new DelimiterOptions(",");

        if(params!==undefined){
          this.setOptions(params);
        }
    }

    setOptions(delimiterOptions){
      this.options.mergeOptions(delimiterOptions);
      this.options.delimiter = ",";
    }

    fromDataTable(dataTable){   
        return new DelimiterConvertor(this.options).fromDataTable(dataTable);
    }

    toDataTable(textToImport){
        return new DelimiterConvertor(this.options).toDataTable(textToImport);
    }
}