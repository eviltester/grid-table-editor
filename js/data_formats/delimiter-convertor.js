import { GenericDataTable } from "./generic-data-table.js";
import { JsonConvertor } from "./json-convertor.js";

export class DelimiterConvertor {

    constructor(params) {

        this.options = {
            quotes: false, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
            columns: null //or array of strings
        }

        this.storedHeaders = [];

        if(params!==undefined){
          this.setOptions(params);
        }

        // todo: need a way to configure delimiters from GUI
    }

    setOptions(delimiterOptions){
      if(delimiterOptions.hasOwnProperty("options")){
        let localoptions = delimiterOptions.options;
        if(localoptions.hasOwnProperty("quotes")){
          this.options.quotes = localoptions.quotes;
        }
        if(localoptions.hasOwnProperty("quoteChar")){
          this.options.quoteChar = localoptions.quoteChar;
        }
        if(localoptions.hasOwnProperty("escapeChar")){
          this.options.escapeChar = localoptions.escapeChar;
        }
        if(localoptions.hasOwnProperty("delimiter")){
          this.options.delimiter = localoptions.delimiter;
        }
        if(localoptions.hasOwnProperty("header")){
          this.options.header = localoptions.header;
        }
        if(localoptions.hasOwnProperty("newline")){
          this.options.newline = localoptions.newline;
        }
      }
      if(delimiterOptions.hasOwnProperty("headers")){
        this.storedHeaders = delimiterOptions.headers.map(header => header);
      }else{
        this.storedHeaders = [];
      }
    }

    convertFrom(dataTable){      
        let objects = new JsonConvertor().formatAsObjects(dataTable);
        return Papa.unparse(objects, this.options);
    }

    toDataTable(textToImport){
        let headerText="";

        if(this.options){
          if(this.options.header==false){
            // if we have any stored headers then add them to the input
            let headers = this.storedHeaders;
            if(headers!==undefined && headers.length>0){
              headerText = Papa.unparse([this.storedHeaders], this.options)
              headerText = headerText+this.options.newline;
            }
            
          }
        }

        let rememberOptionsHeader=undefined;

        // we want PapaParse to return an array of nested arrays with first being headers
        if(this.options){
          rememberOptionsHeader = this.options.header;
          this.options.header=false;
        }
        
        var results=Papa.parse(headerText + textToImport, this.options);

        if(rememberOptionsHeader!==undefined){
          this.options.header=rememberOptionsHeader;
        }

        let dataTable = new GenericDataTable();
        dataTable.setFromDataArray(results.data);
        return dataTable;
    }
}