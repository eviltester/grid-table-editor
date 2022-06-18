import { GenericDataTable } from "./generic-data-table.js";

// TODO : expose options at GUI
// TODO : option - allow finer grained control for all columns
class MarkdownOptions{

  constructor(){
      this.options = {
          // was going to add readable but the ascii output will handle that
          compact: true,
          // space padding add space (left, right, both ) e.g. | value| or |value | or | value |
          spacePadding: 'none', // none, left, right, both
          // tab padding add tab (left, right, both ) e.g. | value| or |value | or | value |
          tabPadding: 'none', // none, left, right, both
          // border bars e.g. | at start and end of table line, when off then generate "Heading1 | Heading2", "row0-1 | row0-2"
          borderBars: true,
          //embolden headers e.g. | **header1** |
          emboldenHeaders: false,
          //emphasis on headers e.g. | _header1_ |
          emphasisHeaders: false,
          //embolden columns (given a list of numbers e.g. 1,2)(not zero indexed since this is for humans) e.g. | **row0-1** |
          emboldenColumns: [],
          // emphasis on columns (given a list of numbers e.g. 1,2)(not zero indexed since this is for humans) e.g. e.g. | _header1_ |
          emphasisColumns: [],
          // support alignment with a global config "default align", "left align", "center", "right alignment"
          //alignment on headers --- :--- :---: ---:
          globalColumnAlign: 'default', //default, left, center, right 
      }
      this.validateSeparatorLength = false;
  }

  mergeOptions(newoptions){
      if(newoptions.options){
          this.options = {...this.options, ...newoptions.options}
      }else{
          this.options = {...this.options, ...newoptions}
      }
      if(newoptions.validateSeparatorLength){
        this.validateSeparatorLength = newoptions.validateSeparatorLength;
      }
  }
}


class MarkdownConvertor {

    constructor(params) {
      this.options=new MarkdownOptions();
      
      if(params?.options){
          this.setOptions(params);
      }
    }

    setOptions(newOptions){
        this.options.mergeOptions(newOptions);
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


    // TODO: wrap with unit tests
    getValidTableCellValueFromMarkdownCell(aCellValue){
      let actualContents = aCellValue.trim();

      // handle any special character conversions for markdown
      actualContents = actualContents.replaceAll("&#124;","|")

      // remove formatting

      // remove emphasis _ _  
      // (^| ) for at start or preceeded by space
      // ([\S]+) sequence of non white space characters
      // ($| ) for at end or followed by space
      const emRegexp = /(^| )_([\S]+)_($| )/g;
      actualContents = actualContents.replace(emRegexp,"$1$2$3");

      // remove bold ** **
      const boldRegexp = /(^| )\*\*([\S]+)\*\*($| )/g;
      actualContents = actualContents.replace(boldRegexp,"$1$2$3");
      
      return actualContents;
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
        let actualContents = this.getValidTableCellValueFromMarkdownCell(contents);
        return actualContents;
      });

      return cellValues;
    }

   
    toDataTable(markdownTable){

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
          if(this.options.validateSeparatorLength){
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


   // TODO : migrate away from this and use the Generic Data Table
    markdownTableToDataRows(markdownTable){
      return this.toDataTable(markdownTable).asDataArray();
    }


    validMarkdownCellValue(data){
      return data.replaceAll("|","&#124;");
    }

    formatCell(value, isHeader, index){
      let leftPadding = "";
      let rightPadding = "";

      if(index===undefined){
        // it is the header marker
          if(this.options.options.globalColumnAlign==="left" || this.options.options.globalColumnAlign==="center"){
            leftPadding = ":" + leftPadding;
          }
          if(this.options.options.globalColumnAlign==="right" || this.options.options.globalColumnAlign==="center"){
            rightPadding = rightPadding + ":";
          }
      }
      if(isHeader){
        if(this.options.options.emboldenHeaders===true || this.options.options.emboldenColumns.includes(index)){
          leftPadding = "**" + leftPadding;
          rightPadding = rightPadding + "**";
        }
        if(this.options.options.emphasisHeaders===true || this.options.options.emphasisColumns.includes(index)){
          leftPadding = "_" + leftPadding;
          rightPadding = rightPadding + "_";
        }
      }else{
        if(this.options.options.emboldenColumns.includes(index)){
          leftPadding = "**" + leftPadding;
          rightPadding = rightPadding + "**";
        }
        if(this.options.options.emphasisColumns.includes(index)){
          leftPadding = "_" + leftPadding;
          rightPadding = rightPadding + "_";
        }
      }
      if(this.options.options.spacePadding==='left' || this.options.options.spacePadding==='both'){
        leftPadding = " " + leftPadding;
      }
      if(this.options.options.spacePadding==='right' || this.options.options.spacePadding==='both'){
        rightPadding = rightPadding + " ";
      }
      if(this.options.options.tabPadding==='left' || this.options.options.tabPadding==='both'){
        leftPadding = "\t" + leftPadding;
      }
      if(this.options.options.tabPadding==='right' || this.options.options.tabPadding==='both'){
        rightPadding = rightPadding + "\t";
      }

      return leftPadding + this.validMarkdownCellValue(value) + rightPadding;
    }

    // https://www.markdownguide.org/extended-syntax/
    fromDataTable(dataTable){
      // display a pipe (|) character in a table by using its HTML character code (&#124;).

      let renderHeaders = dataTable.getHeaders().map((header, index) => {
          return this.formatCell(header, true, index+1);
      });

      let border = '|';
      if(this.options.options.borderBars===false){
        border="";
      }

      let markdownTable =  border + renderHeaders.join('|') + border + '\n';

      // TODO : use length of header to adjust the number of ---- output
      markdownTable =
          markdownTable + border + dataTable.getHeaders().map(name =>{
           return this.formatCell('-----', false, undefined);
          }).join('|') + border + '\n';

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          let row = dataTable.getRow(rowIndex);

          let renderValues = row.map((value, index) => {
            return this.formatCell(value, false, index+1);
          });

          markdownTable = markdownTable + border + renderValues.join('|') + border + '\n';
      };

      return markdownTable;
  }
}

export {MarkdownConvertor, MarkdownOptions}