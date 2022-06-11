import { GenericDataTable } from "./generic-data-table.js";

export class GherkinConvertor {

    constructor(params) {
    }

    getValuesFromTableRow(aRowString){

      let rowString = aRowString.trim();

      if(rowString.charAt(0)=="|"){
        rowString = rowString.substring(1);
      }
      if(rowString.charAt(rowString.length-1)=="|"){
        rowString=rowString.slice(0, -1);
      }

      // allow split to take place by formating the escaped bars
      rowString = rowString.replaceAll("\\|", "&#124;");

      let values = rowString.split("|");

      let cellValues = values.map(contents => {
            let actualContents = contents.trim();

            // after split set the bars back to escaped
            actualContents = actualContents.replaceAll("&#124;", "\\|");
            
            // handle any special character conversions for gherkin
            actualContents = actualContents.replaceAll('\\\\','\\').replaceAll("\\|","|")
            
            return actualContents;
      });

      return cellValues;
    }

    validGherkinCellValue(data){
        return data.replaceAll('\\','\\\\').replaceAll("|","\\|")
    }

    fromDataTable(dataTable){

        // display a pipe (|) character in a table by using its HTML character code (&#124;).

        var renderHeaders = dataTable.getHeaders().map(header => this.validGherkinCellValue(header));
        var markdownTable =  '|' + renderHeaders.join('|') + '|' + '\n';

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);               
            var renderValues = row.map(value => this.validGherkinCellValue(value));
            markdownTable = markdownTable + '|' + renderValues.join('|') + '|' + '\n';
        };

        return markdownTable;
    }


    toDataTable(gherkinTable){

        let dataTable = new GenericDataTable();

        let rows = [];
        // should not really need to handle \r because a trim will remove it
        rows=gherkinTable.split("\n");

        let rowCount = 0;
        let processingStarted = false;
        for(const row of rows){
            let rowString = row.trim();

            if(processingStarted===false && rowString.length===0){
                // skip empty lines at the start of the input string
                continue;
            }else{
                processingStarted=true;
            }

            if(processingStarted===true && rowString.length===0){
                // gap in the table when processing means end of table
                break;
            }

            // first row in the table are the headers
            if(rowString.length>0 && rowCount===0){
                let headerValues = this.getValuesFromTableRow(rowString);
                dataTable.setHeaders(headerValues);
            }

            if(rowString.length>0 && rowCount!==0){
                let cellValues = this.getValuesFromTableRow(rowString);
                dataTable.appendDataRow(cellValues);
            }
        
            rowCount++;      
        };
    
        return dataTable;
    }

    gherkinTableToDataRows(gherkinTable){
        return this.toDataTable(gherkinTable).asDataArray();
    }
}