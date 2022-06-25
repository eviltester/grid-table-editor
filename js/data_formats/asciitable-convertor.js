import {AsciiTable3} from "../libs/ascii-table3/ascii-table3.js"

// using slightly changed version of https://github.com/AllMightySauron/ascii-table3 to run in browser

// note: not a high priority as most IDEs can comment out lines
// TODO : option to remove header
// TODO : asciiDoc format
// TODO : add line code commenting styles to allow pasting generated string into code
// TODO : add block code commenting styles to allow pasting generated string into code

class AsciiTableOptions{

    constructor(){
        this.options = {
            style: "ramac",
            linePrefix: ""
        }

        this.styleNames={
            "default":"ramac",
            "blank":"none",
            "compact":"compact",
            "dot corner":"ascii-table",
            "dotted":"ascii-dots",
            "clean":"ascii-clean",
            "girder":"ascii-girder",
            "markdown (github)":"github-markdown",
            "markdown (reddit)":"reddit-markdown",
            "reStructuredText":"ascii-reStructuredText",
            "reStructuredText simple":"ascii-reStructuredText-simple",
            "rounded":"ascii-rounded",
            "unicode single":"unicode-single",
            "unicode double":"unicode-double",
            "unicode mix":"unicode-mix",
        }

    }
  
    mergeOptions(newoptions){
        let optionstoSet ={};
        if(newoptions.options){
            optionstoSet = {...this.options, ...newoptions.options}
        }else{
            optionstoSet = {...this.options, ...newoptions}
        }

        if(optionstoSet?.style){
            if(this.isValidStyleKey(optionstoSet.style)){
                this.options.style = this.styleNames[optionstoSet.style];
            }else{
                if(this.isValidStyleName(optionstoSet.style)){
                    this.options.style = optionstoSet.style;
                }else{
                    console.log(`ascii table style ${optionstoSet.style} not found`);
                }
            }
        }
        this.options.linePrefix = optionstoSet.linePrefix ? optionstoSet.linePrefix : "";
    }

    isValidStyleKey(name){
        return this.styleNames[name]!==undefined;
    }

    isValidStyleName(name){
        for (const [key, value] of Object.entries(this.styleNames)) {
            if(name==value){
                return true;
            }
        }
        return false;
    }
  }


class AsciiTableConvertor {

    constructor(params) {

        this.options = new AsciiTableOptions();
        
        if(params?.options){
            this.setOptions(params.options);
        }
    }

    setOptions(options){
        this.options.mergeOptions(options);
    }


    fromDataTable(dataTable){

        // setHeading doesn't take an array it takes an expanded set of items
        var tableOutput = new AsciiTable3();
        tableOutput.setStyle(this.options.options.style)
            .setHeading(...dataTable.getHeaders())
            .addRowMatrix(dataTable.rows);
            return tableOutput.toString();
    }

    // toDataTable(textToImport){
    //     return this.delegateTo.toDataTable(textToImport);
    // }

}

export {AsciiTableConvertor, AsciiTableOptions};