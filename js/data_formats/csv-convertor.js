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

        // allow configuring off...
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
        return new DelimiterConvertor({options: this.options}).convertFrom(dataTable);
    }
}