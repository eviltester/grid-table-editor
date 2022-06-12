import { GenericDataTable } from "../data_formats/generic-data-table.js";
import { GherkinConvertor } from "../data_formats/gherkin-convertor.js";
import { MarkdownConvertor, MarkdownOptions } from "../data_formats/markdown-convertor.js";
import { HtmlConvertor } from "../data_formats/html-convertor.js";
import { JsonConvertor } from "../data_formats/json-convertor.js";
import { JavascriptConvertor } from "../data_formats/javascript-convertor.js";
import { CsvConvertor } from "../data_formats/csv-convertor.js";
import { DelimiterConvertor } from "../data_formats/delimiter-convertor.js";
import { DelimiterOptions } from "../data_formats/delimiter-options.js";
import { AsciiTableConvertor } from "../data_formats/asciitable-convertor.js";
import {fileTypes} from '../data_formats/file-types.js';

class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;
        this.csvDelimiter= new DelimiterOptions('"');
        this.delimiter= new DelimiterOptions("\t");

        // todo make this an 'AsciiTableOptions` object
        this.asciiTableOptions = {style : "default"};

        this.markdownOptions = new MarkdownOptions();

        this.options={};
        this.options["csv"] = this.csvDelimiter;
        this.options["dsv"] = this.delimiter;
        this.options["asciitable"] = this.asciiTableOptions;
        this.options["markdown"] = this.markdownOptions;
        

        this.exporters = {};
        this.exporters["markdown"]= new MarkdownConvertor();
        this.exporters["csv"]= new CsvConvertor();
        this.exporters["dsv"]= new DelimiterConvertor();
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


    // todo: import and export options setting should use a consistent approach
    setCsvDelimiterOptions(options){
        this.csvDelimiter.mergeOptions(options);
    }

    setDelimiterOptions(options){
        this.delimiter.mergeOptions(options);
    }

    setMarkdownOptions(options){
        this.markdownOptions.mergeOptions(options);
    }

    setAsciiTableOptions(options){
        if(options?.style){
            this.asciiTableOptions.style = options.style;
        }
    }



}

export {Exporter}