import { GenericDataTable } from "./generic-data-table.js";

// todo: options - make numbers numeric - by default everything is a string by support numbers being unquoted
// todo: options - pretty print or not - when not then every row is shown on a new line
// todo: options - minify - all on one line
// todo: options - as object with user configurable key name e.g. {"table":[...jsonrows]}

export class JsonConvertor {

    constructor(params) {

        this.convertor = function (header){
            return header;
        }

        if(params!==undefined){
            if(params.hasOwnProperty("headerNameConvertor")){
                this.convertor = params.headerNameConvertor;
            }
        }
    }

    formatAsObjects(dataTable){

        let fieldnames = dataTable.getHeaders().map(header => this.convertor(header));
        let objects = [];

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);
            objects.push(dataTable.getRowAsObjectUsingHeadings(rowIndex,fieldnames))
        }

        return objects;
    }

    fromDataTable(dataTable){
            return JSON.stringify(this.formatAsObjects(dataTable), null, "\t");
    }
    
    toDataTable(textToImport){
        let results = Papa.parse(Papa.unparse(JSON.parse(textToImport)));
        let dataTable = new GenericDataTable();
        dataTable.setFromDataArray(results.data);
        return dataTable;
    }

}