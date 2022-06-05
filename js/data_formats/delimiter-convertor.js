import { JsonConvertor } from "./json-convertor.js";

export class DelimitorConvertor {

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

        if(params!==undefined){
            if(params.hasOwnProperty("options")){
              let localoptions = params.options;
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
        }

        // todo: need a way to configure delimiters from GUI
    }

    convertFrom(dataTable){
        
        let objects = new JsonConvertor().formatAsObjects(dataTable);
        return Papa.unparse(objects, this.options);
    }
}