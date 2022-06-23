import { GenericDataTable } from "./generic-data-table.js";

// TODO : expose options at GUI
// TODO : option - allow finer grained control for all columns
class MarkdownOptions{

  constructor(){
      this.options = {
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
          // pretty print to size out the columns - like Gherkin
          prettyPrint: false,
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

      let cellValues = this.getOutputCellsFromTableRow(rowString);

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


    getValidTableCellValueFromInputFormatCell(aCellValue){
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
    
    getOutputCellsFromTableRow(aRowString){

      let rowString = aRowString.trim();

      if(rowString.charAt(0)=="|"){
        rowString = rowString.substring(1);
      }
      if(rowString.charAt(rowString.length-1)=="|"){
        rowString=rowString.slice(0, -1);
      }

      var values = rowString.split("|");

      var cellValues = values.map(contents => {
        let actualContents = this.getValidTableCellValueFromInputFormatCell(contents);
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
            var headerValues = this.getOutputCellsFromTableRow(rowString);
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
          var cellValues = this.getOutputCellsFromTableRow(rowString);
          dataTable.appendDataRow(cellValues);
        }
  
        rowCount++;      
      };
  
      return dataTable;
  }


   // TODO : remove this, it is out of date and only used by tests
    markdownTableToDataRows(markdownTable){
      return this.toDataTable(markdownTable).asDataArray();
    }


    // make sure it is valid markdown
    getValidOutputFormatCellValue(data){
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

      return leftPadding + this.getValidOutputFormatCellValue(value) + rightPadding;
    }


    getPrettyPrintColumnWidths(dataTable){

      let prettyPrintColumnWidths=[];

      dataTable.getHeaders().forEach(
          (header, index) =>{
              let output = this.formatCell(header, true, index+1);
              prettyPrintColumnWidths[index] = output.length;
          } 
      );

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          let row = dataTable.getRow(rowIndex);               
          row.forEach((cellvalue, index) =>{
              let output =this.formatCell(cellvalue, false, index+1);
              if(output.length > prettyPrintColumnWidths[index]){
                  prettyPrintColumnWidths[index] = output.length;
              }
          });
      }

      return prettyPrintColumnWidths;
    }

    padCell(value, maxWidth, charToPadWith){

      if(maxWidth===null || maxWidth===undefined){
        return value;
      }

      let padChar = charToPadWith ? charToPadWith : " ";

      let padding="";
      if(maxWidth > value.length){
          let padBy = maxWidth - value.length;
          padding = Array(padBy+1).join(padChar);
      }

      let lpadding = "";
      let rpadding = "";

      // by default right padding
      rpadding = padding;

      // handle alignment
      if(this.options.options.globalColumnAlign==="right"){
        lpadding = padding;
        rpadding = "";
      }

      if(this.options.options.globalColumnAlign==="center"){
        if(padding.length>0){
          let lpadlen = Math.floor(padding.length/2);
          if(lpadlen>0){
            lpadding =  Array(lpadlen+1).join(padChar);
          }
          let rpadlen = padding.length-lpadlen;
          if(rpadlen>0){
            rpadding =  Array(rpadlen+1).join(padChar);
          }
        }
      }


      return lpadding + value + rpadding;
    }

    // https://www.markdownguide.org/extended-syntax/
    fromDataTable(dataTable){
      // display a pipe (|) character in a table by using its HTML character code (&#124;).

      let prettyPrintColumnWidths=[];
      if(this.options.options.prettyPrint){
          // pre-process the table and work out the maximum length for each column cell
          prettyPrintColumnWidths = this.getPrettyPrintColumnWidths(dataTable);
      }

      let renderHeaders = dataTable.getHeaders().map((header, index) => {
          return this.padCell(
                        this.formatCell(header, true, index+1),
                        prettyPrintColumnWidths[index]);
      });

      let border = '|';
      if(this.options.options.borderBars===false){
        border="";
      }

      let markdownTable =  border + renderHeaders.join('|') + border + '\n';

      // TODO : use length of header to adjust the number of ---- output
      markdownTable =
          markdownTable + border + dataTable.getHeaders().map((name, index) =>{
           // for the horizontal line we want to pad it them format to add borders etc.
           let sep = this.formatCell(
                          this.padCell("-----", prettyPrintColumnWidths[index], "-")
                             ,false, undefined);
            // handle special cases where formatting added values to header
            if(sep.length >  prettyPrintColumnWidths[index]){
              let removeCount = sep.length-prettyPrintColumnWidths[index];
              while(removeCount>0){
                sep=sep.replace("-","");
                removeCount--;
              }
            }
            return sep;
          }).join('|') + border + '\n';

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          let row = dataTable.getRow(rowIndex);

          let renderValues = row.map((value, index) => {
            return this.padCell(
                          this.formatCell(value, false, index+1),
                          prettyPrintColumnWidths[index]);
          });

          markdownTable = markdownTable + border + renderValues.join('|') + border + '\n';
      };

      return markdownTable;
  }
}

export {MarkdownConvertor, MarkdownOptions}