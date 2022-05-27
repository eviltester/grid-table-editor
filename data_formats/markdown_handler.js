export class MarkdownConvertor {

    constructor(params) {
      this.validateSeparatorLength=false;
      this.treatThisAsGherkin=false;
      
      if(params!==undefined){
        if(params.hasOwnProperty("validateSeparatorLength")){
          // configure to stop parsing table string if header separators are wrong
          this.validateSeparatorLength = params.validateSeparatorLength;
        }
        if(params.hasOwnProperty("treatThisAsGherkin")){
          // configure to stop parsing table string if header separators are wrong
          this.treatThisAsGherkin = params.treatThisAsGherkin;
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

      if(this.treatThisAsGherkin){
        // quick hack to allow split to work
        rowString = rowString.replaceAll("|", "&#124;");
      }

      var values = rowString.split("|");

      var cellValues = values.map(contents => {
        let actualContents = contents.trim();

        // handle any special character conversions for markdown
        // also handles the split hack for Gherkin
        actualContents = actualContents.replaceAll("&#124;","|")

        if(this.treatThisAsGherkin){
          // handle any special character conversions for gherkin
          actualContents = actualContents.replaceAll('\\\\','\\').replaceAll("\\|","|")
        }
        

        return actualContents;
      });

      return cellValues;
    }

    // todo: create a GenericDataTable class with a 'headers' array and a rowdata[][] array
    markdownTableToDataRows(markdownTable){

        let rows = [];
        // should not really need to handle \r because a trim will remove it
        rows=markdownTable.split("\n");

        let data = [];
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

          // it is the "|---|" separator row
          if(rowString.length>0 && rowCount==1){
            if(this.validateSeparatorLength){
              if(!this.isMarkdownTableSeparatorRowValid(rowString)){
                // not valid return empty data
                return [];
              }
            }
          }

          // todo: create a proper gherkin importer
          if(this.treatThisAsGherkin){
            // with Gherkin row count 1 is a normal row
            if(rowString.length>0 && rowCount==1){
              var cellValues = this.getValuesFromMarkdownTableRow(rowString);
              data.push(cellValues);
            }
          }

          if(rowString.length>0 && rowCount!=1){
            var cellValues = this.getValuesFromMarkdownTableRow(rowString);
            data.push(cellValues);
          }
    
          rowCount++;      
        };
    
        return data;
    }
}