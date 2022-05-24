export class MarkdownConvertor {

    // todo add any configuration options into the markdown converter
    constructor() {
    }

    // todo: create a GenericDataTable class with a 'headers' array and a rowdata[][] array
    markdownTableToDataRows(markdownTable){

        // todo: split is removing blank lines in the middle rather than stopping processing early
        let rows = markdownTable.split(/[\r\n]+/);
        let data = [];
        let rowCount = 0;
        let processingStarted = false;
        for(const row of rows){
          var rowString = row.trim();

          if(processingStarted===true && rowString.length===0){
              // skip empty it is a gap in the table
              break;
          }

          if(processingStarted===false && rowString.length===0){
            // skip empty lines
            continue;
          }else{
            processingStarted=true;
          }
          
          
          if(rowString.charAt(0)=="|"){
            rowString = rowString.substring(1);
          }
          if(rowString.charAt(rowString.length-1)=="|"){
            rowString=rowString.slice(0, -1);
          }
    
          var rowString = rowString.trim();
    
          if(rowString.length>0 && rowCount!=1){
            var values = rowString.split("|");
            var cellValues = values.map(contents => contents.trim());
            //console.log(cellValues);
            data.push(cellValues);
          }
    
          rowCount++;      
        };
    
        return data;
    }
}