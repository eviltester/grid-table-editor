class DelimiterOptions{

    constructor(delimiter){
        this.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: "\"",
            header: true,
            newline: "\n",
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
       
    }

}

export {DelimiterOptions}