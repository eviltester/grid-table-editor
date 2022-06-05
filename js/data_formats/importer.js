import { GherkinConvertor } from "./gherkin-convertor.js";
import { MarkdownConvertor } from "./markdown-convertor.js";

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

    // todo: phase this out and use the GenericDataTable
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

    setGridFromGenericDataTable(dataTable){

      if(dataTable.getColumnCount()==0){
        // will not create a table with no columns
        // todo: report errors on screen
      }

      this.gridExtras.createColumns(dataTable.getHeaders());
      this.gridApi.setRowData([]);

      let addRows = [];
      
      let fieldnames = this.gridApi.getColumnDefs().map(col => col.field);

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
        
          // var vals = {};
          // let row= dataTable.getRow(rowIndex);
          // for (const propertyid in fieldnames) {
          //   vals[fieldnames[propertyid]] = row[propertyid];
          // }
          // addRows.push(vals);
          addRows.push(dataTable.getRowAsObjectUsingHeadings(rowIndex,fieldnames));
      }

      // todo: apply transactions incrementally for larger data sets
      this.gridApi.applyTransaction({ add: addRows });
    }
      
    importMarkDownTextFrom(aString){
      this.setGridFromGenericDataTable(new MarkdownConvertor().markdownTableToDataTable(aString));
    }

    // todo: create a setGridFromDataTable method to handle the GenericDataTable
    importGherkinTextFrom(aString){
      this.setGridFromGenericDataTable(new GherkinConvertor().gherkinTableToDataTable(aString));
    }
}

export {Importer}