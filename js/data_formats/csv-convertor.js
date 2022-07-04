import { DelimiterConvertor } from "./delimiter-convertor.js";
import { DelimiterOptions } from "./delimiter-options.js";

export class CsvConvertor {

    constructor(params) {
        this.options = new DelimiterOptions(",");
        this.delegateTo =  new DelimiterConvertor(this.options);

        if(params!==undefined){
          this.setOptions(params);
        }
    }

    setOptions(delimiterOptions){
      this.options.mergeOptions(delimiterOptions);
      this.options.delimiter = ",";
      this.delegateTo = new DelimiterConvertor(this.options);
      this.delegateTo.setPapaParse(this.papaparse);
    }

    setPapaParse(papaparse){
      this.papaparse=papaparse;
      this.delegateTo.setPapaParse(papaparse);
    }

    fromDataTable(dataTable){   
        return this.delegateTo.fromDataTable(dataTable);
    }

    toDataTable(textToImport){
        return  this.delegateTo.toDataTable(textToImport);
    }
}