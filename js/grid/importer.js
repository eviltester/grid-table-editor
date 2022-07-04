import { DelimiterOptions } from "../data_formats/delimiter-options.js";
import { GherkinConvertor } from "../data_formats/gherkin-convertor.js";
import { MarkdownConvertor, MarkdownOptions } from "../data_formats/markdown-convertor.js";
import { HtmlConvertor, HtmlConvertorOptions } from "../data_formats/html-convertor.js";
import { DelimiterConvertor } from "../data_formats/delimiter-convertor.js";
import { CsvConvertor } from "../data_formats/csv-convertor.js";
import { JsonConvertor, JsonConvertorOptions } from "../data_formats/json-convertor.js";
import { JavascriptConvertor, JavascriptConvertorOptions } from "../data_formats/javascript-convertor.js";
import { fileTypes } from "../data_formats/file-types.js";

class Importer{

    constructor(gridApi,gridExtension) {
        this.gridApi = gridApi;
        this.gridExtras=gridExtension;

        this.options={};
        this.options["csv"] = new DelimiterOptions('"');
        this.options["dsv"] = new DelimiterOptions("\t");
       // this.options["asciitable"] = new AsciiTableOptions();
        this.options["markdown"] = new MarkdownOptions();
        this.options["json"] = new JsonConvertorOptions();
        this.options["javascript"] = new JavascriptConvertorOptions();
        this.options["html"] = new HtmlConvertorOptions();

        this.convertors = {};
        this.convertors["markdown"] = new MarkdownConvertor();
        this.convertors["gherkin"] = new GherkinConvertor();
        this.convertors["html"] = new HtmlConvertor();
        this.convertors["dsv"] = new DelimiterConvertor();
        this.convertors["csv"] = new CsvConvertor();
        this.convertors["json"] = new JsonConvertor();
        this.convertors["javascript"] = new JavascriptConvertor();

    }

    canImport(type){
        return this.convertors.hasOwnProperty(type);
    }

    getFileExtensionFor(type){
        return fileTypes[type]?.fileExtension;
    }

    setOptionsForType(type, options){

      if(this.options[type]){
        let optionsToUse = this.options[type];
        optionsToUse.mergeOptions(options);        
      }
    }

    // text area import
    importText(typeToImport, textToImport){

      if(!this.canImport(typeToImport)){
        console.log(`Data Type ${typeToImport} not supported for importing`);
        return;
      }

      let optionsToUse = {};
      if(this.options[typeToImport]){
        optionsToUse = this.options[typeToImport];     
      }

      let convertorToUse = this.convertors[typeToImport];
      if(convertorToUse !== undefined){
        convertorToUse?.setOptions?.(optionsToUse);
        this.setGridFromGenericDataTable(convertorToUse.toDataTable(textToImport));
        return;
      }
    }

    // TODO : phase this out and use the GenericDataTable
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
        // TODO : report errors on screen
      }

      this.gridExtras.createColumns(dataTable.getHeaders());
      this.gridApi.setRowData([]);

      let addRows = [];
      
      let fieldnames = this.gridApi.getColumnDefs().map(col => col.field);

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          addRows.push(dataTable.getRowAsObjectUsingHeadings(rowIndex,fieldnames));
      }

      // TODO : apply transactions incrementally for larger data sets
      this.gridApi.applyTransaction({ add: addRows });
    }
}

export {Importer}