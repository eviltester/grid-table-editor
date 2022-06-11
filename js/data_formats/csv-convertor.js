import { DelimiterConvertor } from "./delimiter-convertor.js";

export class CsvConvertor {

    constructor(params) {

        this.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\n",
        }

        this.storedHeaders = [];

        if(params!==undefined){
          this.setOptions(params);
        }
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
        // CSV so do not allow changing delimiter
        // if(localoptions.hasOwnProperty("delimiter")){
        //   this.options.delimiter = localoptions.delimiter;
        // }
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

    fromDataTable(dataTable){   
        return new DelimiterConvertor({options: this.options, headers: this.storedHeaders}).fromDataTable(dataTable);
    }

    toDataTable(textToImport){
        return new DelimiterConvertor({options: this.options, headers: this.storedHeaders}).toDataTable(textToImport);
    }
}