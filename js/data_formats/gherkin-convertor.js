import { GenericDataTable } from "./generic-data-table.js";

// TODO: options - pretty print (calculate max width of each col, pad out entries on export for columns)
// e.g. | title              | author          |
//      | quite a long title | the author name |

class GherkinOptions{

    constructor(){
        this.options = {
            // include/hide headings
            showHeadings: true,
            // left indent table tabs, 2 spaces, 4 spaces, custom
            leftIndent: "",
            // padding inside the cells
            inCellPadding: "none", // left, right, both, none
            inCellPadder: " ",
            // pretty print to pad out all cell values to the same amount
            // pretty print (calculate max width of each col, pad out entries on export for columns)
            // e.g. | title              | author          |
            //      | quite a long title | the author name |
            prettyPrint: false,
        }
    }

    mergeOptions(newoptions){
        if(newoptions.options){
            this.options = {...this.options, ...newoptions.options}
        }else{
            this.options = {...this.options, ...newoptions}
        }

        // validation
        if(this.options.leftIndent===null || this.options.leftIndent===undefined){
            this.options.leftIndent = "";
        }

        if(this.options.inCellPadder===null || this.options.inCellPadder===undefined){
            this.options.inCellPadder = "";
        }
    }
}






class GherkinConvertor {

    constructor(params) {
        this.options=new GherkinOptions();
      
        if(params?.options){
            this.setOptions(params);
        }
    }

    setOptions(newOptions){
        this.options.mergeOptions(newOptions);
    }

    getValidTableCellValueFromInputFormatCell(contents){
        let actualContents = contents.trim();

        // after split set the bars back to escaped
        actualContents = actualContents.replaceAll("&#124;", "\\|");
        
        // handle any special character conversions for gherkin
        actualContents = actualContents.replaceAll('\\\\','\\').replaceAll("\\|","|")
        
        return actualContents;
    }

    getOutputCellsFromTableRow(aRowString){

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
            return this.getValidTableCellValueFromInputFormatCell(contents);
      });

      return cellValues;
    }

    // make sure it is valid gherkin
    getValidOutputFormatCellValue(data){
        return data.replaceAll('\\','\\\\').replaceAll("|","\\|")
    }

    // apply cell formatting style options
    formatCell(value){

        let leftPadding = "";
        let rightPadding = "";

        let formatting = this.options.options;
        if(formatting.inCellPadding!=="none"){
            if(formatting.inCellPadding=== "left" || formatting.inCellPadding==="both"){
                leftPadding = formatting.inCellPadder;
            }
            if(formatting.inCellPadding=== "right" || formatting.inCellPadding==="both"){
                rightPadding = formatting.inCellPadder;
            }
        }

        return  leftPadding + this.getValidOutputFormatCellValue(value) + rightPadding;
    }


    getPrettyPrintColumnWidths(dataTable){

        let prettyPrintColumnWidths=[];
        let formatting = this.options.options;

        if(formatting.showHeadings){
            dataTable.getHeaders().forEach(
                (header, index) =>{
                    let output = this.formatCell(header);
                    prettyPrintColumnWidths[index] = output.length;
                } 
            );
        }

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);               
            row.forEach((cellvalue, index) =>{
                let output =this.formatCell(cellvalue);
                if(output.length > prettyPrintColumnWidths[index]){
                    prettyPrintColumnWidths[index] = output.length;
                }
            });
        }

        return prettyPrintColumnWidths;
    }

    padCell(value, maxWidth){

        if(maxWidth===null || maxWidth===undefined){
            return value;
        }

        let padding="";
        if(maxWidth > value.length){
            let padBy = maxWidth - value.length;
            padding = Array(padBy+1).join(" ");
        }
        return value + padding;
    }

    fromDataTable(dataTable){

        // display a pipe (|) character in a table by using its HTML character code (&#124;).

        let prettyPrintColumnWidths=[];
        if(this.options.options.prettyPrint){
            // pre-process the table and work out the maximum length for each column cell
            prettyPrintColumnWidths = this.getPrettyPrintColumnWidths(dataTable);
        }

        let output = "";
        let formatting = this.options.options;
        let leftIndent = formatting.leftIndent;
        if(formatting.showHeadings){
            var renderHeaders = dataTable.getHeaders().map(
                    (header, index) => this.padCell(
                                                this.formatCell(header),
                                                prettyPrintColumnWidths[index])
                );
            output =  leftIndent + '|' + renderHeaders.join('|') + '|' + '\n';
        }

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);               
            var renderValues = row.map(
                    (value, index) => this.padCell(
                                            this.formatCell(value),
                                            prettyPrintColumnWidths[index])
                );
            output = output + leftIndent + '|' + renderValues.join('|') + '|' + '\n';
        };

        return output;
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
                let headerValues = this.getOutputCellsFromTableRow(rowString);
                dataTable.setHeaders(headerValues);
            }

            if(rowString.length>0 && rowCount!==0){
                let cellValues = this.getOutputCellsFromTableRow(rowString);
                dataTable.appendDataRow(cellValues);
            }
        
            rowCount++;      
        };
    
        return dataTable;
    }

     // TODO : remove this, it is out of date and only used by tests
    gherkinTableToDataRows(gherkinTable){
        return this.toDataTable(gherkinTable).asDataArray();
    }
}


export {GherkinConvertor, GherkinOptions}