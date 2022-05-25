export class MarkdownConvertor {

  
    // todo add any configuration options into the markdown converter
    constructor(params) {
      this.validateSeperatorLength=false;
      
      if(params!==undefined){
        if(params.hasOwnProperty("validateSeperatorLength")){
          this.validateSeperatorLength = params.validateSeperatorLength;
        }
      }
    }

    isMarkdownTableSeperatorRowValid(theRow){

      let rowString = theRow.trim();
      let values = rowString.split("|");

      if(values[0]!=""){
        return false; // first value should be empty
      }

      if(values[values.length-1]!=""){
        return false; // last value should be empty
      }

      values = values.slice(1,-1); // remove first and last items which are empty

      let cellValues = values.map(contents => {return contents.trim()});

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
    
    // todo: create a GenericDataTable class with a 'headers' array and a rowdata[][] array
    markdownTableToDataRows(markdownTable){

        // todo: split is removing blank lines in the middle rather than stopping processing early
        let rows = markdownTable.split(/[\r\n]+/);
        let data = [];
        let rowCount = 0;
        let processingStarted = false;
        for(const row of rows){
          let rowString = row.trim();

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
    
          rowString = rowString.trim();
    
          // it is the "|---|" separator row
          if(rowString.length>0 && rowCount==1){
            if(this.validateSeperatorLength){
              if(!this.isMarkdownTableSeperatorRowValid(rowString)){
                // not valid return empty data
                return [];
              }
            }
          }

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