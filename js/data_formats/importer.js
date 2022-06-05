import { GherkinConvertor } from "./gherkin-convertor.js";
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
    // todo: move into Importer
    importText(typeToImport, textToImport){

      if(!this.canImport(typeToImport)){
        console.log(`Data Type ${typeToImport} not supported for importing`);
        return;
      }

      if(typeToImport=="markdown") {
        this.importMarkDownTextFrom(textToImport);
      }

      if(typeToImport=="gherkin") {
        this.importGherkinTextFrom(textToImport);
      }

      if(typeToImport=="csv") {
        var results=Papa.parse(textToImport);
        //console.log(results.errors);
        this.setGridFromData(results.data);
      }

      if(typeToImport=="json" || typeToImport=="javascript") {
        this.setGridFromData(Papa.parse(Papa.unparse(JSON.parse(textToImport))).data);
      }

    }

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
      return new GherkinConvertor().gherkinTableToDataRows(gherkinTable);
    }


    importMarkDownTextFrom(aString){
      this.setGridFromData(
          this.markdownTableToDataRows(
            aString
          )
        );
    }

    // todo: create a setGridFromDataTable method to handle the GenericDataTable
    importGherkinTextFrom(aString){
      this.setGridFromData(
          this.gherkinToDataRows(
            aString
          )
        );
    }
}

export {Importer}