class Importer{

    constructor(gridApi,gridExtension) {
        this.gridApi = gridApi;
        this.gridExtras=gridExtension;
    }

    canImport(type){
        // todo support html import , "html"
        const supportedTypes = ["markdown", "csv", "json", "javascript", "gherkin"]
        return supportedTypes.includes(type);
    }

    // text area import

    setGridFromData(data){

        // data is row of values where the first row is the headers

        var header = true;

        var addRows = [];

        data.forEach(row => {
          if (header) {
            this.gridExtras.createColumns(row);
            header = false;
            this.gridApi.setRowData([]);
          } else {
            var fieldnames = this.gridApi
              .getColumnDefs()
              .map(col => col.field);
            var vals = {};
            for (const propertyid in fieldnames) {
              vals[fieldnames[propertyid]] = row[propertyid];
            }
            addRows.push(vals);
          }
        });

        this.gridApi.applyTransaction({ add: addRows });
      }
      
      
      // Basic Markdown Table Parsing
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


      importMarkDownTextFrom(aString){
        this.setGridFromData(
            this.markdownTableToDataRows(
              aString
            )
          );
      }
}