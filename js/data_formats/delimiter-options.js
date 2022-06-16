class DelimiterOptions{

    constructor(delimiter){
        this.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: "\"",
            header: true,
            newline: "\n",
            skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
            columns: null //or array of strings
        }

        if(delimiter!==undefined){
            this.options.delimiter = delimiter;
        }

        this.headers = [];
    }

    mergeOptions(delimiterOptions){

        if(delimiterOptions.options){
            this.options = {...this.options, ...delimiterOptions.options}
        }else{
            this.options = {...this.options, ...delimiterOptions}
        }
       
        if(delimiterOptions.hasOwnProperty("headers")){
            this.headers = delimiterOptions.headers.map(header => header);
          }else{
            this.headers = [];
          }
    }

}

export {DelimiterOptions}