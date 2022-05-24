export class MarkdownConvertor {

    // todo add any configuration options into the markdown converter
    constructor() {
    }

    // todo: create a GenericDataTable class with a 'headers' array and a rowdata[][] array
    markdownTableToDataRows(markdownTable){
        const rows = markdownTable.split(/[\r\n]+/);
        var data = [];
        var rowCount = 0;
        rows.forEach(row =>{
          var rowString = row.trim();
          
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
            console.log(cellValues);
            data.push(cellValues);
          }
    
          rowCount++;      
        });
    
        return data;
    }
}