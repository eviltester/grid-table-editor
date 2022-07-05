import { isNumber } from "../utils/number-convertor.js";
import { GenericDataTable } from "./generic-data-table.js";



class JsonConvertorOptions{

    constructor(){

        this.delimiterMappings={
            "tab": "\t",
            "dot": ".",
            "dash": "-",
            "underline": "_",
            "space": " ",
            "plus": "+",
        }

        this.options = {
            //  make numbers numeric - by default everything is a string by support numbers being unquoted
            makeNumbersNumeric: false,
            //pretty print or not - when not then every row is shown on same line and minified
            prettyPrint: true,
            // pretty print delimiter or this could be a number of spaces
            prettyPrintDelimiter: `\t`, 
            // output as array (false), or object with property named below
            asObject:false, 
            // as object with user configurable key name e.g. {"table":[...jsonrows]}
            asPropertyNamed: "data"
        };

        this.headerNameConvertor = (x)=>x;
    }

    mergeOptions(newoptions){
        if(newoptions.options){
            this.options = {...this.options, ...newoptions.options}
        }else{
            this.options = {...this.options, ...newoptions}
        }

        if(newoptions.headerNameConvertor){
          this.headerNameConvertor = newoptions.headerNameConvertor;
        }
    }
}

class JsonConvertor {

    constructor(params) {

        this.config = new JsonConvertorOptions();

        if(params!==undefined){
            this.setOptions(params);
        }
    }

    setOptions(newOptions){
        this.config.mergeOptions(newOptions);
    }

    formatAsObjects(dataTable){

        let fieldnames = dataTable.getHeaders().map(
                            header => this.config.headerNameConvertor(header)
                        );
        let objects = [];

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            //let row = dataTable.getRow(rowIndex);
            objects.push(dataTable.getRowAsObjectUsingHeadings(rowIndex,fieldnames))
        }

        return objects;
    }

    fromDataTable(dataTable){

        let replacer=null;
        if(this.config.options.makeNumbersNumeric){
            replacer = (key, value) => {
                if((value*1)==0){return 0;} // special case 0
                return (value == value * 1 ) ? value * 1 : value;
            }
        }

        let delimiter = null;
        if(this.config.options.prettyPrint){
            delimiter = this.config.options.prettyPrintDelimiter;
        }
        if(isNumber(delimiter)){
            delimiter = delimiter*1;
        }

        let data = this.formatAsObjects(dataTable);

        let toOutput = undefined;
        if(this.config.options.asObject){
            toOutput = {}
            toOutput[this.config.options.asPropertyNamed]=data;
        }else{
            toOutput = data;
        }
        return JSON.stringify(toOutput, replacer, delimiter);
    }
    

    toDataTable(textToImport){

        let jsonArray = [];
        if(this.config.options.asObject){
            let parsedJson = JSON.parse(textToImport);
            jsonArray = parsedJson[this.config.options.asPropertyNamed];
        }else{
            jsonArray = JSON.parse(textToImport);
        }

        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects(jsonArray)
        return dataTable;
    }

}

export {JsonConvertor, JsonConvertorOptions}