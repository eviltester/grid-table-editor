import { GherkinConvertor } from "./gherkin-convertor.js";
import { MarkdownConvertor } from "./markdown-convertor.js";

class Importer{

    constructor(gridApi,gridExtension) {
        this.gridApi = gridApi;
        this.gridExtras=gridExtension;
        this.importOptions={};
        this.importOptions.options={};
    }

    canImport(type){
        // todo support html import , "html"
        const supportedTypes = ["markdown", "csv", "json", "javascript", "gherkin", "dsv"]
        return supportedTypes.includes(type);
    }

    setImportOptions(options){
      this.importOptions=options;
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

      if(typeToImport=="csv" || typeToImport=="dsv") {

        // if importOptions header is false then it returns an array
        // we have currently only coded setGridFromData to handle this
        if(this.importOptions){
          this.importOptions.header=false;
        }
        
        var results=Papa.parse(textToImport, this.importOptions);
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