import { GenericDataTable } from "../data_formats/generic-data-table.js";
import { GherkinConvertor } from "../data_formats/gherkin-convertor.js";
import { MarkdownConvertor } from "../data_formats/markdown-convertor.js";
import { HtmlConvertor } from "../data_formats/html-convertor.js";
import { JsonConvertor } from "../data_formats/json-convertor.js";
import { JavascriptConvertor } from "../data_formats/javascript-convertor.js";
import { CsvConvertor } from "../data_formats/csv-convertor.js";
import { DelimiterConvertor } from "../data_formats/delimiter-convertor.js";
import { DelimiterOptions } from "../data_formats/delimiter-options.js";
import {fileTypes} from '../data_formats/file-types.js';

class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;
        this.csvDelimiter= new DelimiterOptions('"');
        this.delimiter= new DelimiterOptions("\t");
    }

    canExport(type){
        const supportedTypes = ["markdown", "csv", "dsv", "json", "javascript", "gherkin", "html", "asciitable"]
        return supportedTypes.includes(type);
    }

    getFileExtensionFor(type){
        return fileTypes[type].fileExtension;
    }

    getGridAs(type){

        if(type=="markdown") {
          return this.getGridAsMarkdown();
        }
      
        if(type=="csv") {
            return this.getGridAsCsv();
        }

        if(type=="dsv") {
            return this.getGridAsDsv();
        }
      
        if(type=="json") {
            return this.getGridAsJson();
        }
      
        if(type=="javascript") {
            return this.getGridAsJavaScriptJson();
        }
      
        if(type=="gherkin") {
            return this.getGridAsGherkin();
        }
      
        if(type=="html") {
            return this.getGridAsHTML();
        }

        if(type=="asciitable") {
            return this.getGridAsAsciiTable();
        }

        return "";
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

    getGridAsMarkdown(){       
        return new MarkdownConvertor().formatAsMarkdownTable(this.getGridAsGenericDataTable());
    }

    getGridAsGherkin(){
        return new GherkinConvertor().formatAsGherkinTable(this.getGridAsGenericDataTable());
    }

    getGridAsHTML(){
        return new HtmlConvertor().formatAsHTMLTable(this.getGridAsGenericDataTable());
    }

    getGridAsJavaScriptJson(){
        return JSON.stringify(new JavascriptConvertor().formatAsObjects(this.getGridAsGenericDataTable()), null, "\t");
    }

    getGridAsJson(){
        return JSON.stringify(new JsonConvertor().formatAsObjects(this.getGridAsGenericDataTable()), null, "\t");
    }

    setCsvDelimiterOptions(options){
        this.csvDelimiter.mergeOptions(options);
    }

    setDelimiterOptions(options){
        this.delimiter.mergeOptions(options);
    }

    getGridAsCsv(){
        return new CsvConvertor({options : this.csvDelimiter.options}).convertFrom(this.getGridAsGenericDataTable());
    }

    getGridAsDsv(){
        return new DelimiterConvertor({options : this.delimiter.options}).convertFrom(this.getGridAsGenericDataTable());
    }

    getGridAsAsciiTable(){
        // hack out a quick experiment with asciitable
        let dataTable = this.getGridAsGenericDataTable()
        var table = new AsciiTable()
            .setHeading(dataTable.getHeaders())
            .addRowMatrix(dataTable.rows);

            return table.render();
    }
}

export {Exporter}