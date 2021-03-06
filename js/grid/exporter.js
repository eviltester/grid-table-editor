import { GenericDataTable } from "../data_formats/generic-data-table.js";
import { GherkinConvertor, GherkinOptions } from "../data_formats/gherkin-convertor.js";
import { MarkdownConvertor, MarkdownOptions } from "../data_formats/markdown-convertor.js";
import { HtmlConvertor, HtmlConvertorOptions } from "../data_formats/html-convertor.js";
import { JsonConvertor, JsonConvertorOptions } from "../data_formats/json-convertor.js";
import { JavascriptConvertor, JavascriptConvertorOptions } from "../data_formats/javascript-convertor.js";
import { CsvConvertor } from "../data_formats/csv-convertor.js";
import { DelimiterConvertor } from "../data_formats/delimiter-convertor.js";
import { DelimiterOptions } from "../data_formats/delimiter-options.js";
import { AsciiTableConvertor, AsciiTableOptions } from "../data_formats/asciitable-convertor.js";
import {fileTypes} from '../data_formats/file-types.js';
import { PapaWrappa } from "../utils/papawrappa.js";

class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;

        this.options={};
        this.options["csv"] = new DelimiterOptions('"');
        this.options["dsv"] = new DelimiterOptions("\t");
        this.options["asciitable"] = new AsciiTableOptions();
        this.options["markdown"] = new MarkdownOptions();
        this.options["json"] = new JsonConvertorOptions();
        this.options["javascript"] = new JavascriptConvertorOptions();
        this.options["html"] = new HtmlConvertorOptions();
        this.options["gherkin"] = new GherkinOptions();
        
        this.exporters = {};
        this.exporters["markdown"]= new MarkdownConvertor();
        this.exporters["csv"]= new CsvConvertor();
        this.exporters["csv"].setPapaParse(new PapaWrappa())
        this.exporters["dsv"]= new DelimiterConvertor();
        this.exporters["dsv"].setPapaParse(new PapaWrappa())
        this.exporters["json"] = new JsonConvertor();
        this.exporters["javascript"] = new JavascriptConvertor();
        this.exporters["gherkin"] = new GherkinConvertor();
        this.exporters["html"] = new HtmlConvertor();
        this.exporters["asciitable"] = new AsciiTableConvertor();
    }

    canExport(type){
        return this.exporters.hasOwnProperty(type);
    }

    getFileExtensionFor(type){
        return fileTypes[type].fileExtension;
    }

    getGridAs(type){

        if(!this.canExport(type)){
            console.log(`Data Type ${type} not supported for exporting`);
            return "";
        }

        if(this.exporters.hasOwnProperty(type)){
            let exporterToUse = this.exporters[type];
            let optionsToUse = this.options[type];
            if(optionsToUse!==undefined){
                exporterToUse?.setOptions?.(optionsToUse);
            }
            return exporterToUse?.fromDataTable(this.getGridAsGenericDataTable());
        }
    }

    getGridAsGenericDataTable(){
        let dataTable = new GenericDataTable();
        dataTable.setHeaders(this.gridApi.getColumnDefs().map(col => col.headerName));

        var fieldnames = this.gridApi.getColumnDefs().map(col => col.field);
    
        // since we can filter and sort...
        // if we use forEachNode then it ignores the filter and does not honour the sorting
        this.gridApi.forEachNodeAfterFilterAndSort(node => {
            var vals = [];

            for (const propertyid in fieldnames) {
                var property = fieldnames[propertyid];
                vals.push(node.data[property] ? String(node.data[property]) : '');
            }
            dataTable.appendDataRow(vals);
        });

        return dataTable;
    }

    getHeadersFromGrid(){
        return this.gridApi.getColumnDefs().map(col => col.headerName);
    }

 
    getOptionsForType(type){
        return this.options[type];
    }

    setOptionsForType(type, options){
        if(this.options[type]){
            let optionsToUse = this.options[type];
            optionsToUse.mergeOptions(options);

            // because we can switch headers off for these types
            // we need to remember them
            if(type==="csv" || type ==="dsv"){

                if(optionsToUse.header===false){
                    // store headers from the grid in the options
                    optionsToUse.headers = this.getHeadersFromGrid();
                }
            }            
        }
    }
}

export {Exporter}