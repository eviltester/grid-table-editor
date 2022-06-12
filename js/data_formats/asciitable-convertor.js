import {AsciiTable3} from "../libs/ascii-table3/ascii-table3.js"

// using slightly chanced version of https://github.com/AllMightySauron/ascii-table3 to run in browser

// note: not a high priority as most IDEs can comment out lines
// todo: option to remove header
// todo: asciiDoc format
// todo: add line code commenting styles to allow pasting generated string into code
// todo: add block code commenting styles to allow pasting generated string into code


export class AsciiTableConvertor {

    constructor(params) {

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
            "markdown (reddot)":"reddit-markdown",
            "reStructuredText":"ascii-reStructuredText",
            "reStructuredText simple":"ascii-reStructuredText-simple",
            "rounded":"ascii-rounded",
            "unicode single":"unicode-single",
            "unicode double":"unicode-double",
            "unicode mix":"unicode-mix",
        }

        if(params?.options){
            this.setOptions(params.options);
        }
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

    setOptions(options){
        if(options?.style){
            if(this.isValidStyleKey(options.style)){
                this.options.style = this.styleNames[options.style];
            }else{
                if(this.isValidStyleName(options.style)){
                    this.options.style = options.style;
                }else{
                    console.log(`ascii table style ${options.style} not found`);
                }
            }
        }
    }


    fromDataTable(dataTable){

        // setHeading doesn't take an array it takes an expanded set of items
        var tableOutput = new AsciiTable3();
        tableOutput.setStyle(this.options.style)
            .setHeading(...dataTable.getHeaders())
            .addRowMatrix(dataTable.rows);
            return tableOutput.toString();
    }

    // toDataTable(textToImport){
    //     return this.delegateTo.toDataTable(textToImport);
    // }

}