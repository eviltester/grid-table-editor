import { GenericDataTable } from "./generic-data-table.js";

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

}