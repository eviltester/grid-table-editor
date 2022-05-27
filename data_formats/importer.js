import { MarkdownConvertor } from "./markdown_handler.js";

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
      // todo enable validation when we have the ability to show errors on the GUI
      return new MarkdownConvertor().markdownTableToDataRows(markdownTable);
    }

    gherkinToDataRows(gherkinTable){
      // todo enable validation when we have the ability to show errors on the GUI
      return new MarkdownConvertor({treatThisAsGherkin: true}).markdownTableToDataRows(gherkinTable);
    }


    importMarkDownTextFrom(aString){
      this.setGridFromData(
          this.markdownTableToDataRows(
            aString
          )
        );
    }

    importGherkinTextFrom(aString){
      this.setGridFromData(
          this.gherkinToDataRows(
            aString
          )
        );
    }
}

export {Importer}