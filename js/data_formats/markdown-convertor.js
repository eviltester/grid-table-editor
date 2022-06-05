import { GenericDataTable } from "./generic-data-table.js";

export class MarkdownConvertor {

    constructor(params) {
      this.validateSeparatorLength=false;
      
      if(params!==undefined){
        if(params.hasOwnProperty("validateSeparatorLength")){
          // configure to stop parsing table string if header separators are wrong
          this.validateSeparatorLength = params.validateSeparatorLength;
        }
      }
    }

    isMarkdownTableSeparatorRowValid(theRow){

      let rowString = theRow.trim();

      if(!rowString.startsWith("|")){
        return false; // should start with |
      }

      if(!rowString.endsWith("|")){
        return false; // last char should be |
      }

      let cellValues = this.getValuesFromMarkdownTableRow(rowString);

      let sizeCheckedValues = cellValues.filter(value => {

        if(value.startsWith(":")){
          value = value.slice(1); // remove first char
        }
        if(value.endsWith(":")){
          value = value.slice(0,-1); // trim last char
        }

        let nominus = value.replace(/-/g,"");
        // nominus should now be empty
        if(nominus.length!=0){
          // not valid
          return false;
        }else{
          if(value.length<3){
            // not valid
            return false;
          }
        }
        return true;
      })

      if(sizeCheckedValues.length<cellValues.length){
        return false;
      }

      return true;
    }
    
    getValuesFromMarkdownTableRow(aRowString){

      let rowString = aRowString.trim();

      if(rowString.charAt(0)=="|"){
        rowString = rowString.substring(1);
      }
      if(rowString.charAt(rowString.length-1)=="|"){
        rowString=rowString.slice(0, -1);
      }

      var values = rowString.split("|");

      var cellValues = values.map(contents => {
          let actualContents = contents.trim();

          // handle any special character conversions for markdown
          actualContents = actualContents.replaceAll("&#124;","|")
          
          return actualContents;
      });

      return cellValues;
    }

   
    markdownTableToDataTable(markdownTable){

      let rows = [];
      // should not really need to handle \r because a trim will remove it
      rows=markdownTable.split("\n");

      let dataTable = new GenericDataTable();
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

        // it is the header row
        if(rowString.length>0 && rowCount===0){
            var headerValues = this.getValuesFromMarkdownTableRow(rowString);
            dataTable.setHeaders(headerValues);
        }

        // it is the "|---|" separator row
        if(rowString.length>0 && rowCount===1){
          if(this.validateSeparatorLength){
            if(!this.isMarkdownTableSeparatorRowValid(rowString)){
              // not valid return empty dataTable
              return new GenericDataTable();
            }
          }
        }

        // it is row data
        if(rowString.length>0 && rowCount>=2){
          var cellValues = this.getValuesFromMarkdownTableRow(rowString);
          dataTable.appendDataRow(cellValues);
        }
  
        rowCount++;      
      };
  
      return dataTable;
  }


   // todo: migrate away from this and use the Generic Data Table
    markdownTableToDataRows(markdownTable){
      return this.markdownTableToDataTable(markdownTable).asDataArray();
    }


    validMarkdownCellValue(data){
      return data.replaceAll("|","&#124;");
    }

    // https://www.markdownguide.org/extended-syntax/
    formatAsMarkdownTable(dataTable){
      // display a pipe (|) character in a table by using its HTML character code (&#124;).

      let renderHeaders = dataTable.getHeaders().map(header => this.validMarkdownCellValue(header));
      let markdownTable =  '|' + renderHeaders.join('|') + '|' + '\n';

      // todo: use length of header to adjust the number of ---- output
      markdownTable =
          markdownTable + '|' + dataTable.getHeaders().map(name => '-----').join('|') + '|' + '\n';

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          let row = dataTable.getRow(rowIndex);                    
          let renderValues = row.map(value => this.validMarkdownCellValue(value));
          markdownTable = markdownTable + '|' + renderValues.join('|') + '|' + '\n';
      };

      return markdownTable;
  }
}