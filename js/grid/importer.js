import { DelimiterOptions } from "../data_formats/delimiter-options.js";
import { GherkinConvertor } from "../data_formats/gherkin-convertor.js";
import { MarkdownConvertor } from "../data_formats/markdown-convertor.js";

class Importer{

    constructor(gridApi,gridExtension) {
        this.gridApi = gridApi;
        this.gridExtras=gridExtension;
        this.importOptions= new DelimiterOptions();
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

      let rememberOptionsHeader=undefined;

      if(typeToImport=="csv" || typeToImport=="dsv") {

        let headerText="";

        if(this.importOptions){
          if(this.importOptions.options.header==false){
            // if we have any stored headers then add them to the input
            let headers = this.importOptions.headers;
            if(headers!==undefined && headers.length>0){
              headerText = Papa.unparse([this.importOptions.headers], this.importOptions.options)
              headerText = headerText+this.importOptions.options.newline;
            }
            
          }
        }
        // if importOptions header is false then it returns an array
        // we have currently only coded setGridFromData to handle this
        if(this.importOptions){
          rememberOptionsHeader = this.importOptions.options.header;
          this.importOptions.options.header=false;
        }
        
        var results=Papa.parse(headerText + textToImport, this.importOptions.options);
        //console.log(results.errors);
        this.setGridFromData(results.data);
      }

      if(typeToImport=="json" || typeToImport=="javascript") {
        this.setGridFromData(Papa.parse(Papa.unparse(JSON.parse(textToImport))).data);
      }

      if(rememberOptionsHeader!==undefined){
        this.importOptions.options.header=rememberOptionsHeader;
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