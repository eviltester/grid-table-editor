import { DelimiterOptions } from "./delimiter-options.js";
import { GenericDataTable } from "./generic-data-table.js";
import { JsonConvertor } from "./json-convertor.js";


export class DelimiterConvertor {

    constructor(params) {

        this.delimiterOptions = new DelimiterOptions();

        if(params!==undefined){
          this.setOptions(params);
        }
    }

    setOptions(newOptions){

      this.delimiterOptions.mergeOptions(newOptions);
    }

    setPapaParse(papaparse){
      this.papaparse=papaparse;
    }

    fromDataTable(dataTable){      
        let objects = new JsonConvertor().formatAsObjects(dataTable);
        return this.papaparse.unparse(objects, this.delimiterOptions.options);
    }

    toDataTable(textToImport){
        let headerText="";

        if(this.delimiterOptions){
          if(this.delimiterOptions.options.header==false){
            // if we have any stored headers then add them to the input
            let headers = this.delimiterOptions.headers;
            if(headers!==undefined && headers.length>0){
              headerText = this.papaparse.unparse([this.delimiterOptions.headers], this.delimiterOptions.options)
              headerText = headerText+this.delimiterOptions.options.newline;
            }
            
          }
        }

        let rememberOptionsHeader=undefined;

        // we want PapaParse to return an array of nested arrays with first being headers
        if(this.delimiterOptions){
          rememberOptionsHeader = this.delimiterOptions.options.header;
          this.delimiterOptions.options.header=false;
        }
        
        var results=this.papaparse.parse(headerText + textToImport, this.delimiterOptions.options);

        if(rememberOptionsHeader!==undefined){
          this.delimiterOptions.options.header=rememberOptionsHeader;
        }

        let dataTable = new GenericDataTable();
        dataTable.setFromDataArray(results.data);
        return dataTable;
    }
}